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
      user_id: id // TODO: Depois pegar o user_id do usuário logado atualmente, via const { id } = request.user;
    });

    // Retornando código 201 (created)
    return response.status(201).send();
  }

  async list(request: Request, response: Response): Promise<Response> {
    // TODO: Só o admin poderá ver essa rota
    const complaintsService = new ComplaintsService();

    const complaints = await complaintsService.list();

    return response.json(complaints);
  }

  async findById(request: Request, response: Response): Promise<Response> {
    // Id obtido dos parâmetros da rota
    const { id } = request.params;

    const complaintsService = new ComplaintsService();

    const complaint = await complaintsService.findById(+id); // Convertendo id para número

    // Se a reclamação não existir, devemos lançar um erro BadRequest
    if (!complaint) {
      throw new AppError("Complaint not found", 404);
    }

    return response.json(complaint);
  }

  async delete(request: Request, response: Response): Promise<Response> {
    // Id obtido dos parâmetros da rota
    const { id } = request.params;

    const complaintsService = new ComplaintsService();

    // Busca a reclamação no banco de dados
    const complaint = await complaintsService.findById(+id);

    // Se a reclamação não existir, retorna um erro
    if (!complaint) {
      throw new AppError("Complaint not found", 404);
    }

    // Passando o ir obtido dos parâmetros da rota (o operador '+' serve para converter para número)
    await complaintsService.delete(+id);

    return response.status(204).send();
  }

  async update() {
    // TODO: Pegar user_type do usuário logado
  }
}