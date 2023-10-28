// Rotas relacionados aos usuários

import { Router } from "express";
import { UsersController } from "../../../../modules/accounts/controllers/UsersController";
import { EnsureManager } from "../middlewares/EnsureManager";
import { EnsureAuthenticated } from "../middlewares/EnsureAuthenticated";

const usersRoutes = Router(); // Instanciando um Router

const usersController = new UsersController(); // Instanciando um UsersController

usersRoutes.post("/", usersController.create); // Rota para criar um usuário: POST /users

usersRoutes.get(
  "/",
  EnsureAuthenticated, // Garantir que o usuário esteja autenticado
  EnsureManager, // Garantir que o usuário seja um manager
  usersController.list); // Rota para listar usuários: GET /users

usersRoutes.get(
  "/complaints",
  EnsureAuthenticated,
  usersController.findAllComplaintsByUserId); // Rota para listar todas as reclamações feitas por um usuário

export { usersRoutes };