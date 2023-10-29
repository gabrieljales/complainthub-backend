// Esse arquivo é uma declaração de tipo (type declaration) que estende a interface Request do Express.

import { UserTypeEnum } from "../../modules/accounts/infra/typeorm/entities/User";

// Isso é feito para adicionar uma nova propriedade user ao objeto request, que não está presente na definição de tipo original do Express.
// A propriedade user é um objeto que contém um id do tipo number e um type do tipo UserTypeEnum. Essa declaração de tipo não adiciona o id e o type do usuário ao objeto request, ela apenas informa ao TypeScript que essas propriedades podem existir.

// Como o tipo user não existe nas tipagens do express, precisamos sobrescrever essas tipagens adicionando o tipo desejado (user).

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: number;
        type: UserTypeEnum;
      };
    }
  }
}


