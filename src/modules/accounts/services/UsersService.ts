import { hash } from "bcrypt";
import { AppError } from "../../../shared/errors/App.Error";
import { User } from "../infra/typeorm/entities/User";
import { UsersRepository } from "../infra/typeorm/repositories/UsersRepository";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { Complaint } from "../../complaints/infra/typeorm/entities/Complaint";

export class UsersService {
  // Método responsável por criar um usuário
  async create({
    email,
    last_name,
    name,
    password,
    type
  }: ICreateUserDTO): Promise<void> {
    // Verificando a partir do email se o usuário já existe
    const userAlreadyExists = await this.findByEmail(email);

    // Se existir, devemos lançar um erro
    if (userAlreadyExists) {
      throw new AppError("User already exists");
    }

    // Criptografando a senha antes de salvar
    const hashedPassword = await hash(password, 8);

    // Criando uma nova instância da entidade User
    const newUser = UsersRepository.create({
      email,
      last_name,
      name,
      password: hashedPassword,
      type
    });

    // Salvando o usuário no banco
    // Veja que esse método retorna uma Promise, por isso o uso do await
    await UsersRepository.save(newUser);
  }

  // Método responsável por listar todos os usuários
  async list(): Promise<User[]> {
    return await UsersRepository.find();
  }

  // Método responsável por buscar um usuário por id
  // Observação: relations é um parâmetro opcional para quando quisermos incluir uma relação na busca
  async findById(id: number, relations?: string[]): Promise<User> {
    const user = await UsersRepository.findOne({ where: { id }, relations });
  
    return user;
  }

  // Método responsável por buscar um usuário por email
  async findByEmail(email: string): Promise<User> {
    const user = await UsersRepository.findOne({ where: { email } });

    return user;
  }

  // Método responsável por buscar reclamações por id do usuário
  async findAllComplaintsByUserId(user_id: number): Promise<Complaint[]> {
    const user = await this.findById(user_id, ["complaints"]);
  
    // Se o usuário não existir, devemos lançar um erro BadRequest
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Ordenar as reclamações, por ID, em ordem decrescente e sem alterar o array original
    const userComplaintsInDescOrder = [...user.complaints].sort((a, b) => b.id - a.id);
  
    return userComplaintsInDescOrder;
  }
}