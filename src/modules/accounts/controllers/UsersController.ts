import { Request, Response } from "express";

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {

    return response.json("Esse método cria um usuário");
  }
}

export { UsersController };
