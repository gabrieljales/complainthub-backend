import { UserTypeEnum } from "../infra/typeorm/entities/User";

// Interface representando os dados necessários para criar um User
export interface ICreateUserDTO {
  name: string;
  last_name: string;
  password: string;
  email: string;
  type?: UserTypeEnum;
}
