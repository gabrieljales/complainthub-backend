import { Repository } from "typeorm";

import { User } from "../entities/User";
import { PostgresDataSource } from "../../../../../shared/infra/typeorm";
import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";

class UsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = PostgresDataSource.getRepository(User);
  }

  async create({
    name,
  }: ICreateUserDTO): Promise<void> {
    const user = this.repository.create({
      name,
    });

    await this.repository.save(user);
  }
}

export { UsersRepository };
