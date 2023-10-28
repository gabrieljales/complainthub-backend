import { Router } from "express";
import { ComplaintsController } from "../../../../modules/complaints/controllers/ComplaintsController";
import { EnsureAuthenticated } from "../middlewares/EnsureAuthenticated";

const complaintsRoutes = Router(); // Instanciando um Router

const complaintsController = new ComplaintsController(); // Instanciando um ComplaintsController

complaintsRoutes.post(
  "/",
  // EnsureAuthenticated,
  complaintsController.create
);
complaintsRoutes.get("/", complaintsController.list); // TODO: Só o admin poderá ver essa rota
complaintsRoutes.get("/:id", complaintsController.findById);
complaintsRoutes.delete("/:id", complaintsController.delete);

export { complaintsRoutes }