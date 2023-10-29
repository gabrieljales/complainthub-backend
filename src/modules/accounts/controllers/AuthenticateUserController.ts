import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

// Controller responsável pela autenticação do usuário
export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { password, email } = request.body; // Obtendo email e senha do corpo da requisição
    const authenticateUserService = new AuthenticateUserService(); // Instanciando um AuthenticateUserService

    // Chamando o serviço de autenticação, passando senha e email
    const token = await authenticateUserService.execute({ password, email });

    // Retorna um objeto com informações do usuário (email e senha) e o token para acesso
    // OBS: Caso esteja testando pelo Postman ou qualquer API Client,
    // esse token deve ser inserido em Authorization > Bearer Token > adicionar no espaço reservado
    return response.json(token);
  }
}