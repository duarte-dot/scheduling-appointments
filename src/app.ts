import fastify from "fastify";
import { usersRoutes } from "./routes/usersRoutes";

export const app = fastify();

app.register(usersRoutes);
