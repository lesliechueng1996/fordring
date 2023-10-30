import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { AbstractRepository } from './abstract.repository';
import { User } from 'src/entities';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository extends AbstractRepository<User, string> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'user');
  }

  async save(user: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: user,
    });
  }

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
