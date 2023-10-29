import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { AppError } from '../../../shared/errors/App.Error';
import { UsersService } from './UsersService';

// Interface representando o corpo da requisição feita pelo client, iremos receber email e senha (ambos strings)
interface IRequest {
  email: string;
  password: string;
}

// Interface representando a resposta da API
interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}


// Método responsável pela autenticação do usuário, recebe email e senha do AuthenticateUserController
export class AuthenticateUserService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersService = new UsersService(); // Instanciando um UsersService
    const user = await usersService.findByEmail(email); // Como o email é um dado único na nossa aplicação, podemos buscar um usuário pelo seu email

    // Caso o usuário não seja encontrado, lançamos um erro 401 Unauthorized (não autorizado)
    // OBS: uma dica de segurança é não especificar explicitamente qual dos dois dados fornecidos está incorreto.
    // Por isso, mais abaixo, você verá a mesma mensagem caso o usuário erre a senha.
    // Isso evita que alguém com más intenções fique tentando "forçar" um acesso com a conta de alguém
    if (!user) {
      throw new AppError('Email or password incorrect!', 401);
    }

    // Comparando a senha fornecida na requisição com a senha que está criptografada no banco de dados
    const passwordMatched = await compare(password, user.password);

    // Caso o usuário erre a senha, também retornamos um erro 401 Unauthorized
    if (!passwordMatched) {
      throw new AppError('Email or password incorrect!', 401);
    }

    // Criando um JWT (JSON Web Token) para o usuário autenticado com a função sign.
    // Essa função tem como primeiro argumento o payload do token, que nesse caso é o tipo do usuário. Isso pode ser utilizado em outras rotas, para sabermos qual o tipo do usuário autenticado sem precisar fazer uma busca no banco.
    // O segundo argumento é a chave secreta usada para assinar o token (JWT_SECRET).
    const token = sign({ type: user.type }, process.env.JWT_SECRET, {
      // subject: é uma reivindicação sobre a entidade a quem o token pertence
      subject: String(user.id), // Convertendo o id, que é number, para string
      // expiresIn: duração de validade do token, após esse tempo o token não será mais válido
      expiresIn: process.env.JWT_EXPIRES_IN, // Tempo de expiração do JWT, que está no arquivo .env
    });

    // Retornando os dados do usuário autenticado (nome e email) e o token que será utilizado no campo de Authorization
    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}
