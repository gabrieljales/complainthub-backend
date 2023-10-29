import { PostgresDataSource } from "../../../../../shared/infra/typeorm";
import { User } from "../entities/User";

// Aqui estamos criando um repositório para a entidade User usando o PostgresDataSource.
// Um repositório no TypeORM é uma classe que fornece métodos para operações de banco de dados como inserir, atualizar, excluir e buscar registros.
// O PostgresDataSource é uma fonte de dados configurada para se conectar ao banco de dados PostgreSQL.
// A função getRepository é usada para obter um repositório para a entidade User.
// Portanto, o UsersRepository fornecerá métodos para realizar operações de banco de dados na tabela 'users' do banco de dados PostgreSQL.
export const UsersRepository = PostgresDataSource.getRepository(User);