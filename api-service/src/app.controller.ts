import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { CreateUserDto } from './users/dto/create-user.dto';
import { ValidateUserPipe } from './users/parse-user.pipe';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService
  ) { }

  @Post('register')
  register(@Body(new ValidateUserPipe()) createUserDto: CreateUserDto): any {
    return this.authService.register(createUserDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: any; }): Promise<any> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: any; }): any {
    return req.user;
  }
}
