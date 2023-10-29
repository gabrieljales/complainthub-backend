import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/App.Error";
import { UsersService } from "../../../../modules/accounts/services/UsersService";
import { UserTypeEnum } from "../../../../modules/accounts/infra/typeorm/entities/User";

// Interface que define a estrutura de payload do token
interface IPayload {
  sub: number;
  type: UserTypeEnum;
}

// Middleware usado para garantir que uma solicitação seja autenticada antes de prosseguir para o próximo middleware ou rota.
// Ele faz isso verificando a presença de um token JWT (JSON Web Token) no cabeçalho de autorização da solicitação e verificando se o token é válido.
export async function EnsureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization; // Obtém o cabeçalho de autorização da solicitação
  const usersService = new UsersService(); // Instanciando um UsersService

  // Se o cabeçalho de autorização não estiver presente, lança um erro que o token está faltando. 401 Unauthorized (Não Autorizado)
  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  // Divide o cabeçalho de autorização em duas partes: 'Bearer' e o token em si
  // [0] = Bearer (ignorado), [1] = token
  const [, token] = authHeader.split(" ");

  try {
    // O método verify lança uma exceção em caso de erro, por isso o uso do try/catch

    // Verifica o token usando a chave secreta e extrai o ID do usuário (sub) e o tipo do usuário do payload do token
    const { sub: user_id, type } = verify(token, process.env.JWT_SECRET) as IPayload;

    const user = await usersService.findById(user_id); // Busca o usuário pelo ID

    // Se o usuário não for encontrado, lança um erro 401 Unauthorized (Não Autorizado)
    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    // Adiciona as informações do usuário ao objeto de solicitação para uso posterior
    request.user = {
      id: user_id,
      type
    };

    next(); // Chama o próximo middleware ou rota
  } catch (error) {
    // Se ocorrer um erro ao verificar o token, lança um erro 401 Unauthorized (Não Autorizado)
    throw new AppError("Invalid token!", 401);
  }
}
