// Arquivo responsável por unir todas as rotas da aplicação

import { Router } from "express";
import { usersRoutes } from "./UsersRoutes";
import { complaintsRoutes } from "./ComplaintsRoutes";
import { authenticateRoutes } from "./AuthenticateRoutes";
import { resetTokensRoutes } from "./ResetTokensRoutes";

const router = Router(); // Instanciando um Router

// Rotas de usuários
router.use("/users", usersRoutes);

// Rota de autenticação
router.use(authenticateRoutes); // Sem path (/)

// Rota de reset tokens
router.use(resetTokensRoutes); // Sem path (/)

// Rotas de reclamações
router.use("/complaints", complaintsRoutes);

export { router };