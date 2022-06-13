import { UserRole } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    email: string

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole
}
