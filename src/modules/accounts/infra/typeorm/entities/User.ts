import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ResetToken } from "./ResetToken";
import { Complaint } from "../../../../complaints/infra/typeorm/entities/Complaint";

// Enumeração com os tipos de usuário do sistema
export enum UserTypeEnum {
  MANAGER = 'manager',
  CLIENT = 'client'
}

@Entity("users") // Nome da tabela é users
export class User {
  @PrimaryGeneratedColumn() // Decorator usado para definir uma coluna primária gerada automaticamente quando novos registros são criados
  id: number;

  @Column() // Define que é uma coluna comum da tabela
  name: string;

  @Column()
  last_name: string;

  @Column()
  password: string;

  @Column({ unique: true }) // unique:true significa que um email dever ser único na coluna e não pode repetir-se
  email: string;

  // Define uma coluna que usa uma enumeração, nesse caso a enum UserTypeEnum
  @Column({
    type: 'enum',
    enum: UserTypeEnum,
    default: UserTypeEnum.CLIENT, // O valor padrão é 'client'
  })
  type?: UserTypeEnum;

  // CreateDateColumn: usado para denotar uma coluna que armazena a data e hora de quando o registro foi criado. O TypeORM automaticamente define o valor desta coluna quando um novo registro é criado.
  @CreateDateColumn({ type: 'timestamp with time zone', nullable: true })
  created_at: Date;

  // UpdateDateColumn: usado para denotar uma coluna que armazena a data e hora de quando o registro foi atualizado pela última vez. O TypeORM automaticamente atualiza o valor desta coluna sempre que o registro é atualizado.
  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
  updated_at: Date;

  // Define uma relação um-para-muitos com a entidade 'Complaint'. Isso significa que um usuário pode ter várias reclamações.
  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints: Complaint[];

  // Define uma relação um-para-muitos com a entidade 'ResetToken'. Isso significa que um usuário pode ter vários tokens de redefinição.
  @OneToMany(() => ResetToken, (resetToken) => resetToken.user)
  resetTokens: ResetToken[];
}
