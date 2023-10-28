import { Request, Response } from "express";
import { ComplaintsService } from "../services/ComplaintsService";
import { AppError } from "../../../shared/errors/App.Error";

export class ComplaintsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { description, title } = request.body;
    const { id } = request.user; // Obtendo id do usuário autenticado/logado
    const complaintsService = new ComplaintsService();

    // Utilizando o ComplaintsService para salvar a reclamação
    await complaintsService.create({
      description,
      title,
      user_id: id
    });

    // Retornando código 201 (created)
    return response.status(201).send();
  }

  async list(request: Request, response: Response): Promise<Response> {
    const complaintsService = new ComplaintsService();

    const complaints = await complaintsService.list();

    return response.json(complaints);
  }

  async findById(request: Request, response: Response): Promise<Response> {
    // Id da reclamação obtido dos parâmetros da rota
    const { id } = request.params;
    const { id: user_id, type } = request.user; // Obtendo tipo do usuário autenticado/logado

    const complaintsService = new ComplaintsService();

    const complaint = await complaintsService.findById(+id, user_id, type); // +id: Convertendo id de string para número

    return response.json(complaint);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    // Id da reclamação obtido dos parâmetros da rota
    const { id } = request.params;
    const { id: user_id, type } = request.user; // Pegando id e tipo do usuário

    const complaintsService = new ComplaintsService();

    await complaintsService.delete(+id, user_id, type);

    return response.status(204).send();
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params; // Id da reclamação obtido dos parâmetros da rota
    const data = request.body;
    const { type } = request.user; // Obtendo tipo do usuário autenticado/logado
  
    const complaintsService = new ComplaintsService();
  
    await complaintsService.update(+id, data, type);
  
    return response.status(200).send();
  }
}