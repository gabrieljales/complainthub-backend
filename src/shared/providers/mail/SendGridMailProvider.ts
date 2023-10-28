import { MailDataRequired, MailService } from '@sendgrid/mail';
import { IMailDTO } from './IMailDTO';
import * as dotenv from "dotenv";

// dotenv.config(); // Carregar variáveis de ambiente do arquivo .env

export class SendGridMailProvider {
  private client: MailService

  constructor() {
    this.client = new MailService();
    this.client.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendMail(message: IMailDTO) {
    await this.client.send({
      from: message.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
  }
}
