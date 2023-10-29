import { AppError } from "../../../shared/errors/App.Error";
import { UserTypeEnum } from "../../accounts/infra/typeorm/entities/User";
import { UsersService } from "../../accounts/services/UsersService";
import { ICreateComplaintDTO } from "../dtos/ICreateComplaintDTO";
import { IUpdateComplaintDTO } from "../dtos/IUpdateComplaintDTO";
import { Complaint } from "../infra/typeorm/entities/Complaint";
import { ComplaintsRepository } from "../infra/typeorm/repositories/ComplaintsRepository";

// Service com os métodos relacionados as reclamações
export class ComplaintsService {
  // Método responsável por criar uma reclamação
  async create({
    description,
    title,
    user_id
  }: ICreateComplaintDTO): Promise<void> {
    const usersService = new UsersService(); // Instanciando um UsersService
    const user = await usersService.findById(user_id); // Buscando usuário pelo ID

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
    return await ComplaintsRepository.find({ order: { id: "DESC" } }); // Perceba que é em ordem decrescente
  }

  // Método responsável por buscar uma reclamação por id
  // O usuário deve ter criado a reclamação ou ser um manager, para ver uma reclamação que não foi ele que criou
  async findById(id: number, user_id: number, user_type: UserTypeEnum): Promise<Complaint> {
    const complaint = await ComplaintsRepository.findOne({ where: { id }, relations: ["user"] });

    // Se a reclamação não existir ou o usuário autenticado não for o autor da reclamação e não for um gerente, lançamos um erro
    if (!complaint || (complaint.user.id !== user_id && user_type !== UserTypeEnum.MANAGER)) {

      // Dica de segurança: retornar um erro “Not Found” (404) em vez de “Unauthorized” (403) pode ser uma boa prática de segurança.
      // Isso pode evitar a divulgação de informações indesejadas sobre a existência de recursos que o usuário não tem permissão para acessar
      throw new AppError("Complaint not found", 404);
    }

    return complaint; // Retornando a reclamação
  }

  // Método responsável por deletar uma reclamação de acordo com o id
  async delete(id: number, user_id: number, type: string): Promise<void> {
    // Primeiro, verificamos se a reclamação realmente existe
    let complaint = await ComplaintsRepository.findOne({ where: { id }, relations: ["user"] }); // O usuário que criou a reclamação vem junto, por causa do relations

    // Se a reclamação não existir ou o usuário autenticado não for o autor da reclamação e não for um gerente, lançamos um erro
    // Retornamos 404 invés de 403 pelo mesmo motivo explicado no método anterior, findById, por segurança
    if (!complaint || (type === UserTypeEnum.CLIENT && (complaint.user.id) !== user_id)) {
      throw new AppError("Complaint not found", 404);
    }

    // Deletando a reclamação
    await ComplaintsRepository.delete(complaint.id);
  }

  // Método responsável por atualizar uma reclamação de acordo com o id
  async update(
    id: number,
    data: IUpdateComplaintDTO,
    user_type: UserTypeEnum
  ): Promise<Complaint> {
    let complaint = await ComplaintsRepository.findOne({ where: { id }, relations: ["user"] }); // Buscando a reclamação e o usuário que criou ela

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