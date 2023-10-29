import { AppError } from "../../../shared/errors/App.Error";
import { SendGridMailProvider } from "../../../shared/providers/mail/SendGridMailProvider";
import { UsersService } from "./UsersService";
import { v4 as uuidV4 } from 'uuid';
import { ResetTokensRepository } from "../infra/typeorm/repositories/ResetTokensRepository";
import { IMailDTO } from "../../../shared/providers/mail/IMailDTO";
import { UsersRepository } from "../infra/typeorm/repositories/UsersRepository";
import { hash } from "bcrypt";

// Service com os métodos relacionados aos tokens para recuperação de senha
export class ResetTokensService {
  // Método que irá enviar a URL com o token presente como parâmetro para o email fornecido (caso seja um email presente no banco).
  // Essa url serve para o próximo método
  // Exemplo de URL enviada: /reset-password/6b0feac6-4944-4ba0-877c-2227e71e7fe5
  async createPasswordResetToken(email: string): Promise<void> {
    const mailProvider = new SendGridMailProvider(); // Instanciando um SendGridMailProvider
    const usersService = new UsersService(); // Instanciando um UsersService

    const user = await usersService.findByEmail(email); // Como o email é um dado único na nossa aplicação, podemos buscar um usuário pelo seu email

    // Caso o usuário não seja encontrado, lançamos um erro 404 Not Found
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const resetToken = uuidV4(); // Gerando um token único com a biblioteca uuid

    // Criando uma nova instância da entidade ResetToken, passando o usuário e o token gerado com a biblioteca uuid
    const newResetToken = ResetTokensRepository.create({
      token: resetToken,
      user: user
    });

    await ResetTokensRepository.save(newResetToken); // Salvando o token de redefinição no banco de dados

    // Informações do email que será enviado para o usuário
    const msg: IMailDTO = {
      to: user.email, // Email para qual será enviado
      from: {
        name: "ComplaintHub", // Nome de quem está enviando o email
        email: process.env.MAIL_SENDER, // Email que fará o envio
      },
      subject: "Redefinição de senha", // Assunto do email
      text: `Você solicitou a redefinição da sua senha. Por favor, clique no link a seguir para redefinir sua senha: ${process.env.APP_URL}/reset-password/${resetToken}` // Corpo do texto do email com a url para redefinir a senha
    };

    // Enviando um e-mail para o usuário com o link para redefinir a senha
    await mailProvider.sendMail(msg).catch(console.error);
  }

    // Método que de fato é responsável por alterar a senha do usuário, caso o token fornecido seja válido
  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    // Buscando o token de redefinição no banco de dados
    // Veja que também estamos trazendo junto o usuário dono desse token, por meio do "relations"
    const resetTokenRecord = await ResetTokensRepository.findOne({ where: { token: resetToken }, relations: ['user'] });

    // Caso o token não seja encontrado por já ter sido apagado, retornamos um erro de token inválido com o código 400 Bad Request
    if (!resetTokenRecord) {
      throw new AppError("Invalid reset token", 400);
    }

    // Verificando se o token de redefinição não expirou
    const tokenExpirationDate = new Date(resetTokenRecord.created_at); // Data e hora que o token foi criado
    tokenExpirationDate.setHours(tokenExpirationDate.getHours() + 1); // O token expira após uma hora

    // Se o token estiver expirado, lançamos um erro 400 Bad Request
    if (new Date() > tokenExpirationDate) {
      throw new AppError("Reset token expired", 400);
    }

    const hashedPassword = await hash(newPassword, 8); // Redefinindo a senha do usuário

    const user = resetTokenRecord.user; // Usuário dono do token

    user.password = hashedPassword; // Definindo nova senha do usuário

    await UsersRepository.save(user); // Salvando os dados do usuário no banco

    await ResetTokensRepository.delete(resetTokenRecord.id); // Excluindo o token de redefinição usado do banco de dados
  }
}