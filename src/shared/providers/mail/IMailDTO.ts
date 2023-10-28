export interface IMailDTO {
  from: {
    name: string;
    email: string;
  };
  to: string;
  subject: string;
  text: string;
}