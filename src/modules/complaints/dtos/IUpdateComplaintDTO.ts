import { ComplaintStatusEnum } from "../infra/typeorm/entities/Complaint";

// Interface representando os dados necessários para atualizar uma Complaint
// Vejam que todos os campos são opcionais, já que nem todos os campos necessitam ser atualizados de uma só vez
export interface IUpdateComplaintDTO {
  title?: string;
  description?: string;
  status?: ComplaintStatusEnum;
}