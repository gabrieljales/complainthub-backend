// Arquivo responsável por unir todas as rotas da aplicação

import { Router } from "express";
import { usersRoutes } from "./UsersRoutes";
import { complaintsRoutes } from "./ComplaintsRoutes";

const router = Router(); // Instanciando um Router

// Rotas de usuários
router.use("/users", usersRoutes);

// Rotas de reclamações
router.use("/complaints", complaintsRoutes);

export { router };