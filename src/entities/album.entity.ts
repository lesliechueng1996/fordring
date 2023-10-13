import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class AlbumEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 16,
    unique: true,
  })
  name: string;

  @Column({
    length: 256,
    nullable: true,
  })
  description: string | null;

  @Column({ length: 256, nullable: true })
  previewUrl: string | null;
}
