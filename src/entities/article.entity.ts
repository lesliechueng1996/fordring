import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export enum ArticleStatus {
  HIDDEN = 0,
  SHOW = 1,
}

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 128 })
  title: string;

  @Column({ length: 32 })
  author: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.SHOW,
  })
  status: ArticleStatus;

  @Column({ nullable: true })
  categoryId: number | null;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ nullable: true, length: 256 })
  previewUrl: string | null;

  @Column({ default: false })
  isTop: boolean;

  @Column({ default: false })
  isFire: boolean;

  @Column({ default: false })
  isDraft: boolean;
}
