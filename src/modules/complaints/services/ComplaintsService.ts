import { AppError } from "../../../shared/errors/App.Error";
import { UserTypeEnum } from "../../accounts/infra/typeorm/entities/User";
import { UsersService } from "../../accounts/services/UsersService";
import { ICreateComplaintDTO } from "../dtos/ICreateComplaintDTO";
import { IUpdateComplaintDTO } from "../dtos/IUpdateComplaintDTO";
import { Complaint } from "../infra/typeorm/entities/Complaint";
import { ComplaintsRepository } from "../infra/typeorm/repositories/ComplaintsRepository";

export class ComplaintsService {
  // Método responsável por criar uma reclamação
  async create({
    description,
    title,
    user_id
  }: ICreateComplaintDTO): Promise<void> {
    const usersService = new UsersService();
    const user = await usersService.findById(user_id);

    // Se o usuário não existir, devemos lançar um erro BadRequest
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Criando uma nova instância da entidade Complaint
    const newComplaint = ComplaintsRepository.create({
      description,
      title,
      user
    });

    // Salvando a reclamação no banco
    // Veja que esse método retorna uma Promise, por isso o uso do await
    await ComplaintsRepository.save(newComplaint);
  }

  // Método responsável por listar todas as reclamações
  async list(): Promise<Complaint[]> {
    return await ComplaintsRepository.find({ order: { id: "DESC" } });
  }

  // Método responsável por buscar uma reclamação por id
  async findById(id: number): Promise<Complaint> {
    const complaint = await ComplaintsRepository.findOne({ where: { id } });

    return complaint;
  }

  // Método responsável por deletar uma reclamação de acordo com o id
  async delete(id: number): Promise<void> {
    // Primeiro, verificamos se a reclamação realmente existe
    const complaint = await this.findById(id);

    // Se a reclamação não existir, devemos lançar um erro BadRequest
    if (!complaint) {
      throw new AppError("Complaint not found", 404);
    }

    // Deletando a reclamação
    await ComplaintsRepository.delete(complaint);
  }

  // Método responsável por atualizar uma reclamação de acordo com o id
  async update(id: number, data: IUpdateComplaintDTO, user_type: UserTypeEnum): Promise<Complaint> {
    let complaint = await this.findById(id);

    // Se a reclamação não existir, devemos lançar um erro BadRequest
    if (!complaint) {
      throw new AppError("Complaint not found", 404);
    }

    // Se o status estiver sendo atualizado, verifique se o usuário é do tipo manager
    if (data.status && user_type !== UserTypeEnum.MANAGER) {
      throw new AppError("Only managers can update the status", 403);
    }

    // Combinando a reclamação existente com os novos dados
    complaint = ComplaintsRepository.merge(complaint, data);

    // Retornando a reclamação atualizada no banco de dados
    return await ComplaintsRepository.save(complaint);
  }
}