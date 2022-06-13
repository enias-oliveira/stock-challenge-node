import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(email: string, password: string): Promise<Omit<User, "passwordHash"> | null> {
        const user = await this.usersService.user({ email })
        const isPasswordValid = compare(password, user.passwordHash)

        if (isPasswordValid) {
            const { passwordHash, ...result } = user
            return result
        }

        return null
    }
}
