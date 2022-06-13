import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class ValidateUserPipe implements PipeTransform {
  async transform(value: CreateUserDto, { metatype }: ArgumentMetadata) {
    const roles = {
      "user": UserRole.USER,
      "admin": UserRole.ADMIN
    }

    const parsedUser: CreateUserDto = { ...value, role: roles[value.role] }

    const userObject = plainToInstance(metatype, parsedUser)
    const errors = await validate(userObject)

    if (errors.length > 0) {
      throw new BadRequestException('The request could not be understood by the server due to malformed syntax');
    }

    return parsedUser;
  }
}
