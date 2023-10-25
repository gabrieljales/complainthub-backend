// Rotas relacionados aos usuários

import { Router } from "express";
import { UsersController } from "../../../../modules/accounts/controllers/UsersController";

const usersRoutes = Router(); // Instanciando um Router

const usersController = new UsersController();

usersRoutes.post("/", usersController.create);

export { usersRoutes };