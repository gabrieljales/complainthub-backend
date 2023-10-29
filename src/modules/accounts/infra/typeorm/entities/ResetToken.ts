import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { User } from "./User";

// Entidade ResetToken
@Entity("reset_tokens") // Nome da tabela no banco: reset_tokens
export class ResetToken {
  @PrimaryGeneratedColumn() // Decorator usado para definir uma coluna primária gerada automaticamente quando novos registros são criados
  id: number;

  @Column() // Define que é uma coluna comum da tabela
  token: string;

  // ManyToOne: Define uma relação muitos-para-um com a entidade User. Isso significa que muitos registros ResetToken podem estar associados a um único registro User. A função (user) => user.resetTokens especifica o lado inverso da relação.
  @ManyToOne(() => User, (user) => user.resetTokens)
  @JoinColumn({ // Especifica que a coluna que será usada como chave estrangeira na tabela “reset_tokens”. Neste caso, é a coluna ‘user_id’
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
