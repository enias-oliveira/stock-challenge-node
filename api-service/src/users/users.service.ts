import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { generate as generatePassword }  from 'generate-password';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(
    data: Omit<Prisma.UserCreateInput, 'passwordHash'>,
  ): Promise<{ email: string; password: string }> {
    const password = generatePassword({ length: 32 });
    const passwordHash = await hash(password, 10);

    try {
      const { email } = await this.prisma.user.create({
        data: { ...data, passwordHash },
      });

      return { email, password };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(
          'This email is already in use. Please use another one',
          HttpStatus.BAD_REQUEST,
        );
      }

      throw err;
    }
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}
