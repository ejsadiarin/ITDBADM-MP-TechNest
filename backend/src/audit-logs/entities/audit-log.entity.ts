import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  log_id: number;

  @Column({ nullable: true })
  user_id: number;

  @Column()
  action_type: string;

  @Column()
  table_name: string;

  @Column()
  record_id: number;

  @Column('text', { nullable: true })
  old_value: string;

  @Column('text', { nullable: true })
  new_value: string;

  @CreateDateColumn()
  action_timestamp: Date;

  @ManyToOne(() => User, user => user.user_id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
