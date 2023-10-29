// Rotas relacionados aos reset tokens

import { Router } from "express";
import { ResetTokensController } from "../../../../modules/accounts/controllers/ResetTokensController";


const resetTokensRoutes = Router(); // Instanciando um Router

const resetTokensController = new ResetTokensController(); // Instanciando um ResetTokensController

  resetTokensRoutes.post(
    "/password-reset-token",
    resetTokensController.createPasswordResetToken
  ); // Rota para criar um token de redefinição de senha: POST /password-reset-token
  
  resetTokensRoutes.post(
    "/reset-password/:resetToken",
    resetTokensController.resetPassword
  ); // Rota para redefinir a senha: POST /reset-password/:resetToken
  

export { resetTokensRoutes };