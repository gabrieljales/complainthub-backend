// DTO representando corpo da mensagem que será enviada via email
export interface IMailDTO {
  from: {
    name: string;
    email: string;
  };
  to: string;
  subject: string;
  text: string;
}