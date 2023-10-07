import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum UserStatus {
  DISABLED = 0,
  ENABLED = 1,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 128, unique: true })
  @Index()
  email: string;

  @Column({ length: 256 })
  password: string;

  @Column({ length: 32 })
  nickName: string;

  @Column({ length: 256, nullable: true })
  avatarUrl: string | null;

  @Column({ nullable: true })
  lastLoginTime: Date | null;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ENABLED,
  })
  status: UserStatus;

  @Column({ nullable: true })
  lastErrorTime: Date | null;

  @Column()
  errorCount: number;

  @Column({ length: 128, nullable: true })
  lastLoginIp: string | null;

  @Column({ length: 128, nullable: true })
  lastErrorIp: string | null;

  @Column({ length: 512, nullable: true })
  description: string | null;
}
