import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    // Extraindo dados do corpo da requisição
    const { email, last_name, name, password, type } = request.body;
    const usersService = new UsersService();

    // Utilizando UsersService para salvar o usuário
    await usersService.create({
      email,
      last_name,
      name,
      password,
      type
    });

    // Retornando código 201 (created)
    return response.status(201).send();
  }

  async list(request: Request, response: Response): Promise<Response> {
    const usersService = new UsersService();

    const users = await usersService.list();

    return response.json(users);
  }
}

export { UsersController };
