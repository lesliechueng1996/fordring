import { CreateDateColumn, UpdateDateColumn, VersionColumn } from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @VersionColumn()
  version: number;
}
