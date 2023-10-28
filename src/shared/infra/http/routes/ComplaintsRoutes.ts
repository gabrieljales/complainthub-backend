import { Router } from "express";
import { ComplaintsController } from "../../../../modules/complaints/controllers/ComplaintsController";
import { EnsureAuthenticated } from "../middlewares/EnsureAuthenticated";
import { EnsureManager } from "../middlewares/EnsureManager";

const complaintsRoutes = Router(); // Instanciando um Router

const complaintsController = new ComplaintsController(); // Instanciando um ComplaintsController

// Rota para criar uma reclamação
complaintsRoutes.post(
  "/",
  EnsureAuthenticated, // Garantir que o usuário esteja autenticado
  complaintsController.create
);

// Rota para listar todas as reclamações cadastras, independente do usuário
complaintsRoutes.get(
  "/",
  EnsureAuthenticated,
  EnsureManager, // Garantir que o usuário seja um manager
  complaintsController.list
);

// Rota para buscar uma reclamação em específico, de acordo com o id
complaintsRoutes.get(
  "/:id",
  EnsureAuthenticated,
  complaintsController.findById
);

// Rota para deletar uma reclamação
complaintsRoutes.delete(
  "/:id",
  EnsureAuthenticated,
  complaintsController.delete
);


complaintsRoutes.put(
  "/:id",
  EnsureAuthenticated,
  complaintsController.update,
);

export { complaintsRoutes }