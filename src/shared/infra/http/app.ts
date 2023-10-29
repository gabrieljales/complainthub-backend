// Arquivo principal da aplicação (configura a instância principal do app)
// É interessante separar a configuração da aplicação em si da execução do servidor (server.ts) para facilitar a manutenção e reutilização do código

import "reflect-metadata"; // Import necessário para o TypeOrm funcionar

import cors from "cors";

import * as dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors"; // Utilizado para tratar erros assíncronos
import { PostgresDataSource } from "../typeorm";
import { AppError } from "../../errors/App.Error";
import { router } from "./routes";

dotenv.config(); // Carregar variáveis de ambiente do arquivo .env

// Estabelecendo conexão com o banco
PostgresDataSource.initialize()
  .then(() => {
    console.log("Postgres Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express(); // Cria uma instância de uma aplicação Express

// Utiliza o middleware CORS para permitir que o frontend acesse a API
// CORS (Cross-Origin Resource Sharing) é uma medida de segurança que permite
// que recursos de um domínio sejam acessados por outro domínio
app.use(cors());

app.use(express.json()); // Middleware para analisar dados JSON nas requisições

app.use(router); // Utilizando as rotas criadas

// Middleware simples para tratar erros
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    // Verificamos se o erro ocorrido é uma instância de AppError, ou seja, se o erro foi tratado pelo desenvolvedor
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    // Caso não seja uma instância de AppError, tratamos então como um erro interno do servidor (inesperado)
    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };