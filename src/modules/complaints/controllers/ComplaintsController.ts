import { Request, Response } from "express";
import { ComplaintsService } from "../services/ComplaintsService";
import { IUpdateComplaintDTO } from "../dtos/IUpdateComplaintDTO";

// Controller com os métodos relacionados as reclamações
export class ComplaintsController {
  // Método responsável por criar uma reclamação
  async create(request: Request, response: Response): Promise<Response> {
    const { description, title } = request.body; // Obtendo descrição e título fornecidos no corpo da requisição
    const { id } = request.user; // Obtendo id do usuário autenticado/logado
    const complaintsService = new ComplaintsService(); // Instanciando um ComplaintsService

    // Utilizando o ComplaintsService para salvar a reclamação
    await complaintsService.create({
      description,
      title,
      user_id: id
    });

    // Retornando código 201 (created)
    return response.status(201).send();
  }

  // Método responsável por listar todas as reclamações
  async list(request: Request, response: Response): Promise<Response> {
    const complaintsService = new ComplaintsService();  // Instanciando um ComplaintsService

    const complaints = await complaintsService.list(); // Obtendo a lista de reclamações

    return response.json(complaints); // Retornando para o client
  }

  // Método responsável por buscar uma reclamação pelo ID
  async findById(request: Request, response: Response): Promise<Response> {
    const { id } = request.params; // Id da reclamação obtido dos parâmetros da rota
    const { id: user_id, type } = request.user; // Obtendo tipo do usuário autenticado/logado

    const complaintsService = new ComplaintsService(); // Instanciando um ComplaintsService

    const complaint = await complaintsService.findById(+id, user_id, type); // +id: Convertendo id de string para número

    return response.json(complaint); // Retornando a reclamação, caso seja encontrada
  }

  // Método responsável por apagar uma reclamação por ID
  async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params; // Id da reclamação obtido dos parâmetros da rota
    const { id: user_id, type } = request.user; // Pegando id e tipo do usuário autenticado

    const complaintsService = new ComplaintsService();  // Instanciando um ComplaintsService

    await complaintsService.delete(+id, +user_id, type); // Deletando o usuário com o serviço

    return response.status(204).send(); // Retornando 204 No Content (sem conteúdo) para o client
  }

  // Método responsável por atualizar uma reclamação
  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params; // Id da reclamação obtido dos parâmetros da rota
    const data: IUpdateComplaintDTO = request.body; // Pegando os dados do corpo, são do tipo IUpdateComplaintDTO
    const { type } = request.user; // Obtendo tipo do usuário autenticado/logado
  
    const complaintsService = new ComplaintsService(); // Instanciando um ComplaintsService
  
    await complaintsService.update(+id, data, type); // Atualizando a reclamação com o serviço
  
    return response.status(200).send(); // Retornando um 200 OK, caso dê tudo certo
  }
}