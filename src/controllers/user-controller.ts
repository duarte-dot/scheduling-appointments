// src/controllers/users-controller.ts
import { IncomingMessage, ServerResponse } from "http";
import { UserService } from "../services/user-service";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users";

export class UsersController {
  private userService: UserService;

  constructor() {
    const usersRepository = new InMemoryUsersRepository();
    this.userService = new UserService(usersRepository);
  }

  // Método para lidar com a criação de usuários
  async create(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const body = await this.getRequestBody(req);
      const { name, email } = JSON.parse(body);

      const user = await this.userService.execute({ name, email });

      if (!user) {
        res.statusCode = 400; // Bad Request
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "User not created" }));
      }

      res.statusCode = 201; // Created
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          message: "User created",
          user: {
            name: user.name,
            email: user.email,
          },
        })
      );
    } catch (error: unknown) {
      res.statusCode = 400; // Bad Request
      res.setHeader("Content-Type", "application/json");
      if (error instanceof Error) {
        res.end(JSON.stringify({ error: error.message }));
      } else {
        res.end(JSON.stringify({ error: "Unknown error" }));
      }
    }
  }

  async getById(
    req: IncomingMessage,
    res: ServerResponse,
    id: string
  ): Promise<void> {
    try {
      const user = await this.userService.findById(Number(id));

      if (!user) {
        res.statusCode = 404; // Not Found
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "User not found" }));
        return;
      }

      const body = await this.getRequestBody(req);
      let parsedBody: { includesDeleted?: boolean } = {};

      // Verifica se o body não está vazio antes de tentar parsear
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          res.statusCode = 400; // Bad Request
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Invalid JSON" }));
          return;
        }
      }

      // Checa se includesDeleted foi passado e é verdadeiro
      if (parsedBody.includesDeleted === true) {
        res.statusCode = 200; // OK
        res.setHeader("Content-Type", "application/json");

        const userData: {
          id: number;
          name: string;
          email: string;
          deletedAt?: Date | null;
        } = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        // Adiciona "deletedAt" apenas se não for null
        if (user.deletedAt !== null) {
          userData.deletedAt = user.deletedAt;
        }

        res.end(JSON.stringify(userData));
        return;
      }

      if (user.deletedAt !== null) {
        res.statusCode = 404; // Not Found
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "User not found" }));
        return;
      }

      res.statusCode = 200; // OK
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
        })
      );
    } catch (error: unknown) {
      res.statusCode = 400; // Bad Request
      res.setHeader("Content-Type", "application/json");
      if (error instanceof Error) {
        res.end(JSON.stringify({ error: error.message }));
      } else {
        res.end(JSON.stringify({ error: "Unknown error" }));
      }
    }
  }

  async getAll(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      const users = await this.userService.getAll();

      // Obtendo o corpo da requisição, caso ele exista
      const body = await this.getRequestBody(req);
      let parsedBody: { includesDeleted?: boolean } = {};

      // Verifica se o body não está vazio antes de tentar parsear
      if (body) {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          res.statusCode = 400; // Bad Request
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Invalid JSON" }));
          return;
        }
      }

      // Checa se includesDeleted foi passado e é verdadeiro
      if (parsedBody.includesDeleted === true) {
        res.statusCode = 200; // OK
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            users: users.map((user) => {
              const userData: {
                id: number;
                name: string;
                email: string;
                deletedAt?: Date | null;
              } = {
                id: user.id,
                name: user.name,
                email: user.email,
              };

              // Adiciona "deletedAt" apenas se não for null
              if (user.deletedAt !== null) {
                userData.deletedAt = user.deletedAt;
              }

              return userData;
            }),
          })
        );
        return;
      }

      // Caso includesDeleted não seja passado ou seja falso, filtra os usuários sem deletedAt
      res.statusCode = 200; // OK
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          users: users
            .filter((user) => user.deletedAt === null)
            .map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
            })),
        })
      );
    } catch (error: unknown) {
      res.statusCode = 400; // Bad Request
      res.setHeader("Content-Type", "application/json");
      if (error instanceof Error) {
        res.end(JSON.stringify({ error: error.message }));
      } else {
        res.end(JSON.stringify({ error: "Unknown error" }));
      }
    }
  }

  // deletes user by id (gets id from url)
  async delete(
    req: IncomingMessage,
    res: ServerResponse,
    id: string
  ): Promise<void> {
    try {
      await this.userService.delete(Number(id));

      res.statusCode = 200; // OK
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({ message: `User with id ${id} deleted successfully` })
      );
    } catch (error: unknown) {
      res.statusCode = 400; // Bad Request
      res.setHeader("Content-Type", "application/json");
      if (error instanceof Error) {
        res.end(JSON.stringify({ error: error.message }));
      } else {
        res.end(JSON.stringify({ error: "Unknown error" }));
      }
    }
  }

  // Método auxiliar para ler o corpo da requisição
  private getRequestBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        resolve(body);
      });
      req.on("error", (err) => {
        reject(err);
      });
    });
  }
}
