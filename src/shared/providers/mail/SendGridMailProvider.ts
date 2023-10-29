import { MailService } from '@sendgrid/mail';
import { IMailDTO } from './IMailDTO';

// Classe usada para enviar e-mails usando a API do SendGrid
export class SendGridMailProvider {
  private client: MailService // Declarando uma propriedade privada chamada client que é uma instância do serviço de e-mail do SendGrid.

  // Este é o construtor da classe, que é chamado quando uma nova instância da classe é criada. 
  // Dentro do construtor, ele inicializa o cliente do serviço de e-mail e configura a chave da API do SendGrid.
  constructor() {
    this.client = new MailService();
    this.client.setApiKey(process.env.SENDGRID_API_KEY);
  }

  // Método que envia um e-mail usando o cliente do serviço de e-mail.
  // Ele aceita um objeto message do tipo IMailDTO, que define a estrutura dos dados do e-mail.
  // O método send do cliente do serviço de e-mail é então chamado com os dados do e-mail.
  async sendMail(message: IMailDTO) {
    await this.client.send({
      from: message.from,
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
  }
}
