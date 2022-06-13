import { Body, Controller, Get, Inject, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { ValidateUserPipe } from './users/validate-user.pipe';
import { UserCredentials, UserPayload } from './users/users';
import { LocalAuthGuard } from './auth/passport/local-auth.guard';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';


@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    @Inject('STOCK_SERVICE') private stockClient: ClientProxy
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

  @Get('stock')
  getStock(@Query('q') quote: string ): Observable<any> {
    return this.stockClient.send({ cmd: 'get_stock' }, quote)
  }
}
