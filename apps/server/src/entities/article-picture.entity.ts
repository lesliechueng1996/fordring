import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ArticlePicture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  articleId: string;

  @Column()
  pictureId: number;
}
