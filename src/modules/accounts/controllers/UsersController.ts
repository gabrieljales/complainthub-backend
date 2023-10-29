import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";
import { AppError } from "../../../shared/errors/App.Error";

// Controller com métodos relacionados aos usuários
export class UsersController {
  // Método responsável pelo registro de um usuário
  async create(request: Request, response: Response): Promise<Response> {
    const { email, last_name, name, password, type } = request.body; // Extraindo dados do corpo da requisição
    const usersService = new UsersService(); // Instanciando um UsersService

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

  // Método responsável por listar todos os usuários
  async list(request: Request, response: Response): Promise<Response> {
    const usersService = new UsersService(); // Instanciando um UsersService

    const users = await usersService.list(); // Utilizando o UsersService para listar os usuários

    return response.json(users); // Retornando a lista de usuários
  }

  // Método responsável por buscar todas as reclamações que foram criadas pelo usuário que está autenticado
  async findAllComplaintsByUserId(request: Request, response: Response): Promise<Response> {
    const { id } = request.user; // Obtendo id do usuário autenticado/logado

    const usersService = new UsersService();  // Instanciando um UsersService

    // Convertendo id para número e passando para o método do serviço
    const complaints = await usersService.findAllComplaintsByUserId(+id);

    // Se não forem encontradas reclamações desse usuário, devemos lançar um erro BadRequest
    if(!complaints) {
      throw new AppError("No complaints found for the specified user", 404);
    }

    // Retornando a lista com todas as reclamações
    return response.json(complaints);
  }
}
