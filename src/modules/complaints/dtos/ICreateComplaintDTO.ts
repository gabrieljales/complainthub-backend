import { ComplaintStatusEnum } from "../infra/typeorm/entities/Complaint";

// Interface representando os dados necessários para criar uma Complaint
export interface ICreateComplaintDTO {
  title: string;
  description: string;
  user_id: number;
}
