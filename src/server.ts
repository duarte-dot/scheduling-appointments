import { app } from "./app";

const PORT = Number(process.env.PORT) || 3333;

app.listen(
  {
    port: PORT,
  },
  () => {
    console.log(`🚀 rodando na porta ${PORT}`);
  }
);
