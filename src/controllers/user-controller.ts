import { FastifyReply, FastifyRequest } from "fastify";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users";
import { UserService } from "../services/user-service";

export type UserData = {
  id: number;
  name: string;
  email: string;
  deletedAt?: Date | null;
};

export class UsersController {
  private userService: UserService;

  constructor() {
    const usersRepository = new InMemoryUsersRepository();
    this.userService = new UserService(usersRepository);
  }

  // Método para lidar com a criação de usuários
  async create(
    req: FastifyRequest<{ Body: { name: string; email: string } }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const { name, email } = req.body;

      const user = await this.userService.execute({ name, email });

      if (!user) {
        res.status(400).send({ error: "User not created" });
      }

      res.status(201).send({
        message: "User created",
        user: {
          name: user!.name,
          email: user!.email,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      }
    }
  }

  async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const { id } = req.params;

      const user = await this.userService.findById(Number(id));

      if (!user) {
        res.status(404).send({ error: "User not found" });
      } else {
        res.status(200).send({ name: user.name, email: user.email });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      }
    }
  }

  async getAll(
    req: FastifyRequest<{
      Querystring: { includesDeleted?: "true" | "false" };
    }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      const users = await this.userService.getAll();

      if (users.length === 0) {
        return res.status(200).send(users);
      }

      if (req.query.includesDeleted === "true") {
        res.status(200).send(
          users.map((user) => {
            const userData: UserData = {
              id: user.id,
              name: user.name,
              email: user.email,
            };

            // Adiciona "deletedAt" apenas se não for null
            if (user.deletedAt !== null) {
              userData.deletedAt = user.deletedAt;
            }

            return userData;
          })
        );
      }

      // Caso includesDeleted não seja passado ou seja falso, filtra os usuários sem deletedAt
      res.status(200).send(
        users
          .filter((user) => user.deletedAt === null)
          .map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
          }))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      }
    }
  }

  // deletes user by id (gets id from url)
  async delete(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply
  ): Promise<void> {
    try {
      await this.userService.delete(Number(req.params.id));

      res.status(202).send({
        message: `User with id ${req.params.id} deleted successfully`,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      }
    }
  }

  async clear(): Promise<void> {
    await this.userService.clear();
  }
}
