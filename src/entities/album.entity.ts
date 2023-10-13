import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Album extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 16,
    unique: true,
  })
  displayName: string;

  @Column({
    length: 32,
    unique: true,
  })
  folderName: string;

  @Column({
    length: 256,
    nullable: true,
  })
  description: string | null;

  @Column({ length: 256, nullable: true })
  previewUrl: string | null;
}
