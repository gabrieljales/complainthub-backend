import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/App.Error";
import { UserTypeEnum } from "../../../../modules/accounts/infra/typeorm/entities/User";

// middleware usado para garantir que uma solicitação seja feita por um usuário com o tipo ‘manager’ antes de prosseguir para o próximo middleware ou rota.
// Ele faz isso verificando o tipo de usuário no objeto request.user.
export async function EnsureManager(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { type } = request.user; // Extrai o tipo do usuário do objeto de solicitação

  // Se o tipo do usuário não for 'manager', lança um erro 403 Forbidden (Proibido)
  if (type !== UserTypeEnum.MANAGER) {
    throw new AppError("Access denied", 403); 
  }

  // Chama o próximo middleware ou rota
  return next();
}