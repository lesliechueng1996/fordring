import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Picture extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  albumId: number;

  @Column({
    length: 64,
  })
  name: string;

  @Column({
    length: 256,
    nullable: true,
  })
  description: string | null;

  @Column({
    length: 512,
  })
  url: string;

  @Column({
    length: 128,
  })
  storageKey: string;
}
