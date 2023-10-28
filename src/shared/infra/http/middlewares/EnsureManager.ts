import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/App.Error";
import { UserTypeEnum } from "../../../../modules/accounts/infra/typeorm/entities/User";

export async function EnsureManager(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { type } = request.user;

  if (type !== UserTypeEnum.MANAGER) {
    throw new AppError("Access denied", 403);
  }

  return next();
}