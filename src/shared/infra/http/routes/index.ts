// Arquivo responsável por unir todas as rotas da aplicação

import { Router } from "express";
import { usersRoutes } from "./UsersRoutes";

const router = Router(); // Instanciando um Router

router.use("/users", usersRoutes);

export { router };