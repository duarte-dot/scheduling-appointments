// src/server.ts
import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import { UsersController } from "./controllers/user-controller";

// Define a porta na qual o servidor irá escutar
const PORT: number = 3000;

// Instancia o UsersController
const usersController = new UsersController();

// Função para lidar com as requisições
const requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
  const parsedUrl = parse(req.url || "", true);
  const { pathname } = parsedUrl;

  // Configura o cabeçalho padrão da resposta
  res.setHeader("Content-Type", "application/json");

  if (pathname === "/" && req.method === "GET") {
    // Rota raiz
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        message: "Bem-vindo ao servidor Node.js com TypeScript!",
      })
    );
  } else if (pathname === "/users" && req.method === "POST") {
    await usersController.create(req, res);
  } else if (pathname === "/users" && req.method === "GET") {
    await usersController.getAll(req, res);
  } else if (pathname?.startsWith("/users/") && req.method === "GET") {
    const userId = pathname.split("/")[2]; // Captura o ID da URL

    if (userId) {
      await usersController.getById(req, res, userId);
    } else {
      res.statusCode = 400; // Bad Request
      res.end(JSON.stringify({ error: "Missing user id" }));
    }
  } else if (pathname?.startsWith("/users/") && req.method === "DELETE") {
    const userId = pathname.split("/")[2]; // Captura o ID da URL

    if (userId) {
      await usersController.delete(req, res, userId);
    } else {
      res.statusCode = 400; // Bad Request
      res.end(JSON.stringify({ error: "Missing user id" }));
    }
  } else {
    // Rota não encontrada
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Rota não encontrada" }));
  }
};

// Cria o servidor
const server = createServer(requestHandler);

// Inicia o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
