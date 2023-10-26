import { hash } from "bcrypt";
import { AppError } from "../../../shared/errors/App.Error";
import { User } from "../infra/typeorm/entities/User";
import { UsersRepository } from "../infra/typeorm/repositories/UsersRepository";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";

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
  async findById(id: number): Promise<User> {
    const user = await UsersRepository.findOne({ where: { id } });

    return user;
  }
  
  // Método responsável por buscar um usuário por email
  async findByEmail(email: string): Promise<User> {
    const user = await UsersRepository.findOne({ where: { email } });

    return user;
  }
}