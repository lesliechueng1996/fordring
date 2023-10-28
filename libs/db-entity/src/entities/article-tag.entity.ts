import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArticleTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  articleId: string;

  @Column()
  tagId: number;
}
