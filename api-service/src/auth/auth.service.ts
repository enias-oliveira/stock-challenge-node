import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<Omit<User, "passwordHash"> | null> {
        const user = await this.usersService.user({ email })
        const isPasswordValid = compare(password, user.passwordHash)

        if (isPasswordValid) {
            const { passwordHash, ...result } = user
            return result
        }

        return null
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(createUserDto: CreateUserDto) {
        return this.usersService.createUser(createUserDto);
    }
}
