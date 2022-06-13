import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Stock, StoredStock } from './app';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { LocalAuthGuard } from './auth/passport/local-auth.guard';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UserCredentials, UserPayload } from './users/users';
import { ValidateUserPipe } from './users/validate-user.pipe';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    @Inject('STOCK_SERVICE') private stockClient: ClientProxy,
  ) { }

  @Post('register')
  register(
    @Body(new ValidateUserPipe()) createUserDto: CreateUserDto,
  ): Promise<UserCredentials> {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: { user: UserPayload },
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: UserPayload }): UserPayload {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('stock')
  getStock(
    @Query('q') quote: string,
    @Request() req: { user: UserPayload },
  ): Observable<Stock> {
    return this.stockClient.send(
      { cmd: 'get_stock' },
      { quote, userId: req.user.id },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@Request() req: { user: UserPayload }): Observable<StoredStock[]> {
    return this.stockClient.send({ cmd: 'get_history' }, req.user.id);
  }

  @Get('stat')
  getStat(): Observable<any> {
    return this.stockClient.send({ cmd: 'get_stat' }, '');
  }
}
