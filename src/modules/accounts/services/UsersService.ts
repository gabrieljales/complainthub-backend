import { hash } from "bcrypt";
import { AppError } from "../../../shared/errors/App.Error";
import { User } from "../infra/typeorm/entities/User";
import { UsersRepository } from "../infra/typeorm/repositories/UsersRepository";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { Complaint } from "../../complaints/infra/typeorm/entities/Complaint";
import { SendGridMailProvider } from "../../../shared/providers/mail/SendGridMailProvider";
import { IMailDTO } from "../../../shared/providers/mail/IMailDTO";

// Service com métodos relacionados aos usuários
export class UsersService {
  // Método responsável por criar um usuário
  async create({
    email,
    last_name,
    name,
    password,
    type
  }: ICreateUserDTO): Promise<void> {
    const mailProvider = new SendGridMailProvider(); // Instanciando um SendGridMalProvider

    // Informações do email que será enviado para o usuário
    const msg: IMailDTO = {
      to: email, // Email para qual será enviado
      from: {
        name: "ComplaintHub", // Nome de quem está enviando o email
        email: process.env.MAIL_SENDER, // Email que fará o envio
      },
      subject: "Cadastro na plataforma ComplaintHub", // Assunto do email
      text: "Oi! Bem-vindo(a) ao Complainthub, a casa dos insatisfeitos e inconformados. Junte-se a nós e vamos fazer barulho juntos! 📣" // Corpo do texto do email com a url para redefinir a senha
    };

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

    // Enviando email de confirmação de cadastro para o usuário
    await mailProvider.sendMail(msg).catch(console.error);
  }

  // Método responsável por listar todos os usuários
  async list(): Promise<User[]> {
    return await UsersRepository.find();  // Utilizando o repositório de usuários para realizar a busca
  }

  // Método responsável por buscar um usuário por id
  // Observação: relations é um parâmetro opcional para quando quisermos incluir uma relação na busca
  async findById(id: number, relations?: string[]): Promise<User> {
    const user = await UsersRepository.findOne({ where: { id }, relations }); // Utilizando o repositório de usuários para realizar a busca
  
    return user;
  }

  // Método responsável por buscar um usuário por email
  async findByEmail(email: string): Promise<User> {
    const user = await UsersRepository.findOne({ where: { email } });  // Utilizando o repositório de usuários para realizar a busca

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
  
    // Retornando reclamações ordenadas
    return userComplaintsInDescOrder;
  }
}