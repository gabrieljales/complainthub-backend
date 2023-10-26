import { PostgresDataSource } from "../../../../../shared/infra/typeorm";
import { User } from "../entities/User";

export const UsersRepository = PostgresDataSource.getRepository(User);