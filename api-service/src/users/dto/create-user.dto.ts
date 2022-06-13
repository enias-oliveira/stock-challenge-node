import { UserRole } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"

const roles = Object.values(UserRole).map(role => role.toLowerCase())

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    email: string

    @IsEnum(roles)
    @IsNotEmpty()
    role: string
}
