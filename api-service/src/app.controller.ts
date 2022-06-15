import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException, Inject, Post,
  Put,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiHeader, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { lastValueFrom, Observable } from 'rxjs';
import { Stock, StoredStock } from './app';
import { LoginDto, LoginResponseDto, ProfileResponseDto, RegisterDto, RegisterResponseDto } from './auth/auth.dto';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { LocalAuthGuard } from './auth/passport/local-auth.guard';
import { Roles } from './auth/roles/roles.decorator';
import { RolesGuard } from './auth/roles/roles.guard';
import { UserCredentials, UserPayload } from './users/users';
import { ValidateUserPipe } from './users/validate-user.pipe';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    @Inject('STOCK_SERVICE') private stockClient: ClientProxy,
  ) { }

  @ApiResponse({ type: RegisterResponseDto, status: 201, description: 'User successfully created' })
  @Post('register')
  register(
    @Body(new ValidateUserPipe()) createUserDto: RegisterDto,
  ): Promise<UserCredentials> {
    return this.authService.register(createUserDto);
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: LoginResponseDto, status: 201, description: 'Returns access token that expires in 1 hour' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: { user: UserPayload },
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer with JWT Token'
  })
  @ApiResponse({ type: ProfileResponseDto, status: 200, description: 'Returns profile data enconded in JWT token' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: UserPayload }): UserPayload {
    return req.user;
  }

  @ApiQuery({ name: 'email', type: 'string' })
  @ApiResponse({ status: 201, description: 'User was found and new password will be sent to registered e-mail' })
  @HttpCode(201)
  @Put('password')
  async updatePassword(@Query('email') email: string) {
    return this.authService.reset_password(email)
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
