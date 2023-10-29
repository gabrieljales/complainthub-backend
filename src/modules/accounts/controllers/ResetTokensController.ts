import { Request, Response } from "express";
import { ResetTokensService } from "../services/ResetTokensService";

export class ResetTokensController {
  async createPasswordResetToken(request: Request, response: Response): Promise<Response> {
    const { email } = request.body; // Obtendo o e-mail do corpo da requisição
  
    const resetTokensService = new ResetTokensService();
  
    await resetTokensService.createPasswordResetToken(email);
  
    // Retornando código 200 (OK)
    return response.status(200).send();
  }
  
  async resetPassword(request: Request, response: Response): Promise<Response> {
    // Pegando o token da url
    const { resetToken } = request.params;
    const { password } = request.body;
  
    const resetTokensService = new ResetTokensService();
  
    await resetTokensService.resetPassword(resetToken, password);
  
    // Retornando código 200 (OK)
    return response.status(200).send();
  }
}