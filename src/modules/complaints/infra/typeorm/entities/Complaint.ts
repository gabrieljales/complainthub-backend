import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../../../../accounts/infra/typeorm/entities/User";

// Enumeração com os tipos de status de uma reclamação
export enum ComplaintStatusEnum {
  SOLVED = 'solved',
  PENDING = 'pending',
  UNSOLVED = 'unsolved',
}

@Entity("complaints") // Nome da tabela é complaints
export class Complaint {
  @PrimaryGeneratedColumn() // Decorator usado para definir uma coluna primária gerada automaticamente quando novos registros são criados
  id: number;

  @Column() // Define que é uma coluna comum da tabela
  title: string;

  @Column()
  description: string;

  // Define uma coluna que usa uma enumeração, nesse caso a enum ComplaintStatusEnum

  @Column({
    type: 'enum',
    enum: ComplaintStatusEnum,
    default: ComplaintStatusEnum.UNSOLVED, /// O valor padrão é 'unsolved'
  })
  status?: ComplaintStatusEnum;

  // Define uma relação muitos-para-um com a entidade 'User'. Isso significa que muitas reclamações podem estar associadas a um único usuário. A função `(user) => user.complaints` especifica o lado inverso da relação.
  @ManyToOne(() => User, (user) => user.complaints)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  // CreateDateColumn: usado para denotar uma coluna que armazena a data e hora de quando o registro foi criado. O TypeORM automaticamente define o valor desta coluna quando um novo registro é criado.
  @CreateDateColumn()
  created_at: Date;

  // UpdateDateColumn: usado para denotar uma coluna que armazena a data e hora de quando o registro foi atualizado pela última vez. O TypeORM automaticamente atualiza o valor desta coluna sempre que o registro é atualizado.
  @UpdateDateColumn()
  updated_at: Date;
}