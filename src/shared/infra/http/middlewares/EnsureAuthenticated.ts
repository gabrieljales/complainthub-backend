import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/App.Error";
import { UsersService } from "../../../../modules/accounts/services/UsersService";
import { UserTypeEnum } from "../../../../modules/accounts/infra/typeorm/entities/User";

interface IPayload {
  sub: number;
  type: UserTypeEnum;
}

export async function EnsureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;
  const usersService = new UsersService();

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  // [0] = Bearer (ignorado), [1] = token
  const [, token] = authHeader.split(" ");

  try {
    // O método verify lança uma exceção em caso de erro, por isso o uso do try/catch
    const { sub: user_id, type } = verify(token, process.env.JWT_SECRET) as IPayload;

    const user = await usersService.findById(user_id);

    if (!user) {
      throw new AppError("User does not exists!", 401);
    }

    request.user = {
      id: user_id,
      type
    };

    next();
  } catch (error) {
    throw new AppError("Invalid token!", 401);
  }
}
