// Rotas relacionados aos usuários

import { Router } from "express";
import { UsersController } from "../../../../modules/accounts/controllers/UsersController";

const usersRoutes = Router(); // Instanciando um Router

const usersController = new UsersController(); // Instanciando um UsersController

usersRoutes.post("/", usersController.create); // Rota para criar um usuário: POST /users
usersRoutes.get("/", usersController.list); // Rota para listar usuários: GET /users

export { usersRoutes };