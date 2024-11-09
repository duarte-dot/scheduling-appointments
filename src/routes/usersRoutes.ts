import { FastifyInstance, FastifyRequest } from "fastify";
import { UsersController } from "../controllers/user-controller";

const usersController = new UsersController();

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    "/users",
    async (
      req: FastifyRequest<{
        Querystring: { includesDeleted?: "true" | "false" };
      }>,
      res
    ) => {
      await usersController.getAll(req, res);
    }
  );

  app.get(
    "/users/:id",
    async (
      req: FastifyRequest<{
        Params: { id: string };
      }>,
      res
    ) => {
      await usersController.getById(req, res);
    }
  );

  app.post(
    "/users",
    async (
      req: FastifyRequest<{ Body: { name: string; email: string } }>,
      res
    ) => {
      await usersController.create(req, res);
    }
  );

  app.put("/users", () => {
    return "put users";
  });

  app.delete(
    "/users/:id",
    async (req: FastifyRequest<{ Params: { id: string } }>, res) => {
      await usersController.delete(req, res);
    }
  );

  app.delete("/users", async () => {
    await usersController.clear();
  });
}
