import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { generate as generatePassword } from 'generate-password';
import * as mailgun from 'mailgun-js';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserPayload } from 'src/users/users';
import { UsersService } from 'src/users/users.service';
import { getResetPasswordEmailTemplate } from './helper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.usersService.user({ email });
    const isPasswordValid = await compare(password, user.passwordHash);


    if (isPasswordValid) {
      const { passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserPayload) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  async reset_password(email: string) {
    const user = await this.usersService.user({ email })

    if (!user) {
      throw new NotFoundException('User not found by given email')
    }

    const newPassword = generatePassword({ length: 32 })
    const newPassswordHash = await hash(newPassword, 10)

    const mgOptions = {
      apiKey: this.configService.get('MAILGUN_API_KEY'),
      domain: this.configService.get('MAILGUN_DOMAIN'),
    }

    const emailData = {
      from: 'Jobsity - by Enias <enias.jobsity@sandboxc744b2eb90e4413ba4494e03898e5ccb.mailgun.org>',
      to: email,
      subject: 'Password Reset',
      html: getResetPasswordEmailTemplate(newPassword)
    }

    const mg = mailgun(mgOptions)

    try {
      await mg.messages().send(emailData)
    } catch (err) {
      throw new InternalServerErrorException('E-mail service may be down or invalid e-mail was registered')
    }

    await this.usersService.updateUser({
      where: { email },
      data: { passwordHash: newPassswordHash }
    })
  }
}
