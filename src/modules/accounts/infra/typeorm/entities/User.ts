import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ResetToken } from "./ResetToken";
import { Complaint } from "../../../../complaints/infra/typeorm/entities/Complaint";

export enum UserTypeEnum {
  MANAGER = 'manager',
  CLIENT = 'client'
}

@Entity("users") // Nome da tabela é users
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  last_name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserTypeEnum,
    default: UserTypeEnum.CLIENT,
  })
  type?: UserTypeEnum;

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updated_at: Date;

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[];

  @OneToMany(() => ResetToken, (resetToken) => resetToken.user)
  resetTokens: ResetToken[];
}
