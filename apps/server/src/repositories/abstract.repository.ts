import { Optional } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/providers/prisma.service';
import hasOwnProperty from 'src/utils/has-own-property.util';

type PrimaryKeyPair<V> = {
  id: V;
};

type BaseSchema<V> = PrimaryKeyPair<V> & {
  createTime: Date;
  updateTime: Date;
  version: number;
};

type IncrementDecrement = {
  increment?: number;
  decrement?: number;
};

type UpdateableKey<T> = Exclude<string & keyof T, 'id'>;

export class AbstractRepository<T extends BaseSchema<PV>, PV> {
  constructor(
    protected prisma: PrismaService,
    protected schemaName: string,
  ) {}

  async findById(id: PV): Promise<T> {
    return this.prisma[this.schemaName].findUnique({
      where: {
        id,
      },
    });
  }

  async updateById(
    where: Optional<T> & PrimaryKeyPair<PV>,
    data: Optional<{
      [key in UpdateableKey<T>]: T[key] extends number
        ? T[key] | IncrementDecrement
        : T[key];
    }>,
  ) {
    const setData: Optional<{
      [key in UpdateableKey<T>]: T[key] | IncrementDecrement;
    }> = {
      ...data,
    };
    if (!hasOwnProperty.call(data, 'updateTime')) {
      setData.updateTime = new Date();
    }

    if (!hasOwnProperty.call(data, 'version')) {
      setData.version = {
        increment: 1,
      };
    }

    return this.prisma[this.schemaName].update({
      where,
      data: setData,
    });
  }

  async findAll(): Promise<T[]> {
    return this.prisma[this.schemaName].findMany();
  }

  async deleteById(id: PV) {
    return this.prisma[this.schemaName].delete({
      where: {
        id,
      },
    });
  }
}
