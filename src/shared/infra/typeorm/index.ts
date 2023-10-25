import "reflect-metadata";
import * as dotenv from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";

dotenv.config(); // Carregar variáveis de ambiente do arquivo .env

// Criando uma conexão com o banco de dados
const PostgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_HOST_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: [join(__dirname, "../typeorm/migrations/*.{js,ts}")], // Caminho para o diretório das migrações do sistema
  migrationsTableName: "migrations",
  entities: [
    join(__dirname, "../../../modules/**/infra/typeorm/entities/*.{ts,js}"), // Caminho das entidades do sistema
  ],
});

export { PostgresDataSource };
