import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class ValidateUserPipe implements PipeTransform {
  async transform(value: CreateUserDto, { metatype }: ArgumentMetadata) {
    const userObject = plainToInstance(metatype, value)
    const errors = await validate(userObject)

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    const roles = {
      "user": UserRole.USER,
      "admin": UserRole.ADMIN
    }

    const parsedUser: Prisma.UserCreateInput = { ...value, role: roles[value.role] }

    return parsedUser;
  }
}
