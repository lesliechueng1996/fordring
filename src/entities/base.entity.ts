import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export class BaseEntity {
  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @VersionColumn()
  version: number;
}
