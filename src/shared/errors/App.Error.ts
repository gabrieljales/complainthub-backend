// Classe utilizada para lidar com os erros da aplicação

export class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  // Aqui nós recebemos a mensagem e o código de status passado
  // Caso o código não seja fornecido, o padrão será 400
  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
