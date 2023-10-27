import { PostgresDataSource } from "../../../../../shared/infra/typeorm";
import { Complaint } from "../entities/Complaint";

export const ComplaintsRepository = PostgresDataSource.getRepository(Complaint);