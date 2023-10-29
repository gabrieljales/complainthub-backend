// Rotas relacionados a autenticação

import { Router } from "express";
import { AuthenticateUserController } from "../../../../modules/accounts/controllers/AuthenticateUserController";

const authenticateRoutes = Router(); // Instanciando um Router

const authenticateUserController = new AuthenticateUserController(); // Instanciando um AuthenticateUserController

authenticateRoutes.post("/authenticate", authenticateUserController.handle); // Rota para autenticação: POST /authenticate

export { authenticateRoutes };
