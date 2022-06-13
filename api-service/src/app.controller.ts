import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { ValidateUserPipe } from './users/validate-user.pipe';
import { UserCredentials, UserPayload } from './users/users';
import { LocalAuthGuard } from './auth/passport/local-auth.guard';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';


@Controller()
export class AppController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('register')
  register(@Body(new ValidateUserPipe()) createUserDto: CreateUserDto): Promise<UserCredentials> {
    return this.authService.register(createUserDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: UserPayload }): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: UserPayload }): UserPayload {
    return req.user;
  }
}
