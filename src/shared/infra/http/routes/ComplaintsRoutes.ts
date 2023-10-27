import { Router } from "express";
import { ComplaintsController } from "../../../../modules/complaints/controllers/ComplaintsController";

const complaintsRoutes = Router(); // Instanciando um Router

const complaintsController = new ComplaintsController(); // Instanciando um ComplaintsController

complaintsRoutes.post("/", complaintsController.create);

export { complaintsRoutes }