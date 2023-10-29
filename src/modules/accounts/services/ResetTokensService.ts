import { AppError } from "../../../shared/errors/App.Error";
import { SendGridMailProvider } from "../../../shared/providers/mail/SendGridMailProvider";
import { UsersService } from "./UsersService";
import { v4 as uuidV4 } from 'uuid';
import { ResetTokensRepository } from "../infra/typeorm/repositories/ResetTokensRepository";
import { IMailDTO } from "../../../shared/providers/mail/IMailDTO";
import { UsersRepository } from "../infra/typeorm/repositories/UsersRepository";
import { hash } from "bcrypt";

export class ResetTokensService {
  async createPasswordResetToken(email: string): Promise<void> {
    const mailProvider = new SendGridMailProvider();
    const usersService = new UsersService();

    const user = await usersService.findByEmail(email);
  
    if (!user) {
      throw new AppError("User not found", 404);
    }
  
    // Gere um token único
    const resetToken = uuidV4();
  
    // Crie uma nova instância da entidade ResetToken
    const newResetToken = ResetTokensRepository.create({
      token: resetToken,
      user: user
    });
  
    // Salve o token de redefinição no banco de dados
    await ResetTokensRepository.save(newResetToken);
  
    // Envie um e-mail para o usuário com o link para redefinir a senha
    const msg: IMailDTO = {
      to: user.email,
      from: {
        name: "ComplaintHub",
        email: process.env.MAIL_SENDER,
      },
      subject: "Redefinição de senha",
      text: `Você solicitou a redefinição da sua senha. Por favor, clique no link a seguir para redefinir sua senha: ${process.env.APP_URL}/reset-password/${resetToken}`
    };
  
    await mailProvider.sendMail(msg).catch(console.error);
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    // Encontre o token de redefinição no banco de dados
    const resetTokenRecord = await ResetTokensRepository.findOne({ where: { token: resetToken }, relations: ['user'] });
  
    if (!resetTokenRecord) {
      throw new AppError("Invalid reset token", 400);
    }
  
    // Verifique se o token de redefinição não expirou
    const tokenExpirationDate = new Date(resetTokenRecord.created_at);
    tokenExpirationDate.setHours(tokenExpirationDate.getHours() + 1); // O token expira após uma hora
  
    if (new Date() > tokenExpirationDate) {
      throw new AppError("Reset token expired", 400);
    }
  
    // Redefina a senha do usuário
    const hashedPassword = await hash(newPassword, 8);
    
    const user = resetTokenRecord.user;
    
    // Definindo nova senha do usuário
    user.password = hashedPassword;
    
    // Salvando no banco
    await UsersRepository.save(user);
  
    // Exclua o token de redefinição do banco de dados
    await ResetTokensRepository.delete(resetTokenRecord.id);
  }
}