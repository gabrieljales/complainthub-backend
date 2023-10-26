import { MigrationInterface, QueryRunner } from "typeorm";

// Essa migração foi gerada com o comando:
// npm run typeorm migration:generate ./src/shared/infra/typeorm/migrations/InitialMigration -- -d ./src/shared/infra/typeorm/index.ts

// Observação: Para gerar essa migração, primeiro criamos todas as entidades com seus campos e relacionamentos, para então executar o comando acima.

export class InitialMigration1698280014800 implements MigrationInterface {
  name = 'InitialMigration1698280014800'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // O método "up" é executado quando nós rodamos o comando npm run typeorm migration:run -- -d ./src/shared/infra/typeorm/index.ts

    // Cria a enumeração complaint_status_enum
    await queryRunner.query(`
            CREATE TYPE "public"."complaint_status_enum" AS ENUM('solved', 'underAnalysis', 'unsolved')
        `);

    // Cria a tabela complaints
    await queryRunner.query(`
            CREATE TABLE "complaints" (
                "id" SERIAL NOT NULL, 
                "description" character varying NOT NULL, 
                "status" "public"."complaint_status_enum" NOT NULL DEFAULT 'underAnalysis', 
                "user_id" integer, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_a9c8dbc2ab4988edcc2ff0a7337" PRIMARY KEY ("id")
            )
        `);

    // Cria a enumeração users_type_enum
    await queryRunner.query(`
            CREATE TYPE "public"."users_type_enum" AS ENUM('manager', 'client')
        `);

    // Cria a tabela users
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL, 
                "name" character varying NOT NULL,
                "last_name" character varying NOT NULL,  
                "password" character varying NOT NULL, 
                "email" character varying NOT NULL, 
                "type" "public"."users_type_enum" NOT NULL DEFAULT 'client', 
                "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), 
                "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), 
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

    // Cria a tabela reset_tokens
    await queryRunner.query(`
            CREATE TABLE "reset_tokens" (
                "id" SERIAL NOT NULL, 
                "token" character varying NOT NULL, 
                "user_id" integer, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "PK_acd6ec48b54150b1736d0b454b9" PRIMARY KEY ("id")
            )
        `);

    // Adiciona uma chave estrangeira em complaints, referenciando o campo "id" da tabela users
    await queryRunner.query(`
            ALTER TABLE "complaints"
            ADD CONSTRAINT "FK_1ab3e07eb3ce33129dfb6d6af83"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

    // Adiciona uma chave estrangeira em reset_tokens, referenciando o campo "id" da tabela users
    await queryRunner.query(`
            ALTER TABLE "reset_tokens"
            ADD CONSTRAINT "FK_61c9431c5fe994696fe1760a4df"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // O método "down" é executado quando nós revertemos uma migração
    // O comando para reverter a última migração feita é npm run typeorm migration:revert -- -d ./src/shared/infra/typeorm/index.ts
    // Abaixo, nós estamos desfazendo tudo que nós criamos no método "up"

    await queryRunner.query(`ALTER TABLE "reset_tokens" DROP CONSTRAINT "FK_61c9431c5fe994696fe1760a4df"`);

    await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_1ab3e07eb3ce33129dfb6d6af83"`);

    await queryRunner.query(`DROP TABLE "reset_tokens"`);

    await queryRunner.query(`DROP TABLE "users"`);

    await queryRunner.query(`DROP TYPE "public"."users_type_enum"`);

    await queryRunner.query(`DROP TABLE "complaints"`);

    await queryRunner.query(`DROP TYPE "public"."complaint_status_enum"`);
  }
}