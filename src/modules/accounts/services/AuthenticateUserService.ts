import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { AppError } from '../../../shared/errors/App.Error';
import { UsersService } from './UsersService';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  };
  token: string;
}

export class AuthenticateUserService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersService = new UsersService();
    const user = await usersService.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect!', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Email or password incorrect!', 401);
    }

    const token = sign({ type: user.type }, process.env.JWT_SECRET, {
      subject: String(user.id), // Convertendo o id, que é number, para string
      expiresIn: process.env.JWT_EXPIRES_IN, // Tempo expiração JWT
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}
