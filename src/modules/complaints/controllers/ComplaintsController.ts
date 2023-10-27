import { Request, Response } from "express";
import { ComplaintsService } from "../services/ComplaintsService";

export class ComplaintsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { description, title } = request.body;
    const complaintsService = new ComplaintsService();

    // Utilizando o ComplaintsService para salvar a reclamação
    await complaintsService.create({
      description,
      title,
      user_id: 1 // OBS: Depois pegar o user_id do usuário logado atualmente, via const { id } = request.user;
    });

    // Retornando código 201 (created)
    return response.status(201).send();
  }
}