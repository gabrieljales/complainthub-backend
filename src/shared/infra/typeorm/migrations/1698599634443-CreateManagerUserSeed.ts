import { MigrationInterface, QueryRunner } from "typeorm";
import { User, UserTypeEnum } from "../../../../modules/accounts/infra/typeorm/entities/User";
import { hash } from "bcrypt";

export class CreateManagerUserSeed1698599634443 implements MigrationInterface {
    name = 'CreateManagerUserSeed1698599634443'

    public async up(queryRunner: QueryRunner): Promise<void> {
      const managerUser = new User();
      managerUser.name = 'complainthub';
      managerUser.last_name = 'manager';
      managerUser.email = process.env.MANAGER_EMAIL;
      managerUser.password = await hash(process.env.MANAGER_PASSWORD, 8);
      managerUser.type = UserTypeEnum.MANAGER;
  
      await queryRunner.manager.save(managerUser);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.manager.delete(User, { email: 'manager@complainthub.com' });
    }

}
