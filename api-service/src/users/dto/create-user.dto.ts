import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
