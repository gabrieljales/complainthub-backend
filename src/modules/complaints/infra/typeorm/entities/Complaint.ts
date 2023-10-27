import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../../../accounts/infra/typeorm/entities/User";

export enum ComplaintStatusEnum {
  SOLVED = 'solved',
  UNDER_ANALYSIS = 'underAnalysis',
  UNSOLVED = 'unsolved',
}

@Entity("complaints")
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ComplaintStatusEnum,
    default: ComplaintStatusEnum.UNSOLVED,
  })
  status?: ComplaintStatusEnum;

  @ManyToOne(() => User, (user) => user.complaints)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}