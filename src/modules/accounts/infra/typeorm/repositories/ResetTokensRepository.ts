import { PostgresDataSource } from "../../../../../shared/infra/typeorm";
import { ResetToken } from "../entities/ResetToken";

export const ResetTokensRepository = PostgresDataSource.getRepository(ResetToken);