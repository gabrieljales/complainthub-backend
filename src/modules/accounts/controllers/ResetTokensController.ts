import { Request, Response } from "express";
import { ResetTokensService } from "../services/ResetTokensService";

// Controller com os métodos relacionados aos tokens para recuperação de senha
export class ResetTokensController {
  // Método que irá enviar a URL com o token presente como parâmetro para o email fornecido (caso seja um email presente no banco).
  // Essa url serve para o próximo método
  // Exemplo de URL enviada: /reset-password/6b0feac6-4944-4ba0-877c-2227e71e7fe5
  async createPasswordResetToken(request: Request, response: Response): Promise<Response> {
    const { email } = request.body; // Obtendo o e-mail do corpo da requisição
  
    const resetTokensService = new ResetTokensService(); // Instanciando um ResetTokensService
  
    await resetTokensService.createPasswordResetToken(email); // Chamando o método createPasswordToken, passando o email fornecido
  
    // Retornando código 200 (OK), caso tudo dê certo
    return response.status(200).send();
  }
  
  // Método que de fato é responsável por alterar a senha do usuário, caso o token fornecido seja válido
  async resetPassword(request: Request, response: Response): Promise<Response> {
    const { resetToken } = request.params; // Obtendo o token da url
    const { password } = request.body; // Obtendo a senha fornecida no corpo da requisição
  
    const resetTokensService = new ResetTokensService(); // Instanciando um ResetTokensService
  
    await resetTokensService.resetPassword(resetToken, password); // Chamando o método resetPassword, passando a nova senha e o token
  
    // Retornando código 200 (OK), caso tudo dê certo
    return response.status(200).send();
  }
}