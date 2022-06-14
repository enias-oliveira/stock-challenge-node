import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserJWTPayload, UserPayload } from 'src/users/users';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY', 'NOT_SAFE_DEV_SECRET_KEY'),
    });
  }

  async validate(payload: UserJWTPayload): Promise<UserPayload> {
    const { passwordHash, ...user } = await this.usersService.user({
      id: payload.sub,
    });

    return user;
  }
}
