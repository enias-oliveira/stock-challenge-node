import {
  Body,
  Controller,
  Get,
  HttpException, Inject,
  Post,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Role } from '@prisma/client';
import { lastValueFrom, Observable } from 'rxjs';
import { Stock, StoredStock } from './app';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { LocalAuthGuard } from './auth/passport/local-auth.guard';
import { Roles } from './auth/roles/roles.decorator';
import { RolesGuard } from './auth/roles/roles.guard';
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
  async getStock(
    @Query('q') quote: string,
    @Request() req: { user: UserPayload },
  ): Promise<Stock> {
    const response = await lastValueFrom(this.stockClient.send(
      { cmd: 'get_stock' },
      { quote, userId: req.user.id },
    ))

    if (response.error) {
      throw new HttpException(response.error.errorMessage, response.error.errorStatus)
    }

    return response
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@Request() req: { user: UserPayload }): Observable<StoredStock[]> {
    return this.stockClient.send({ cmd: 'get_history' }, req.user.id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin)
  @Get('stat')
  getStat(): Observable<any> {
    return this.stockClient.send({ cmd: 'get_stat' }, '')
  }
}
