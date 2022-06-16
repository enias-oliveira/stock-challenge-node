import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;


  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;
}

export class RegisterResponseDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

}

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;
}

export class ProfileResponseDto {
  @ApiProperty({ minimum: 1 })
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role, default: 'user' })
  role: Role;
}
