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
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiQuery, ApiSecurity } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { lastValueFrom, Observable } from 'rxjs';
import { Stock, StoredStock } from './app';
import { StockResponseDto, StockStatDto } from './app.dto';
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

  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description: 'User successfully created'
  })
  @Post('register')
  register(
    @Body(new ValidateUserPipe()) createUserDto: RegisterDto,
  ): Promise<UserCredentials> {
    return this.authService.register(createUserDto);
  }

  @ApiBody({ type: LoginDto })
  @ApiCreatedResponse({
    type: LoginResponseDto,
    description: 'Returns access token that expires in 1 hour'
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: { user: UserPayload },
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: ProfileResponseDto,
    description: 'Returns profile data enconded in JWT token'
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: { user: UserPayload }): UserPayload {
    return req.user;
  }

  @ApiQuery({ name: 'email', type: 'string' })
  @ApiCreatedResponse({ description: 'User was found and new password will be sent to registered e-mail' })
  @HttpCode(201)
  @Put('password')
  async updatePassword(@Query('email') email: string) {
    return this.authService.reset_password(email)
  }


  @ApiBearerAuth()
  @ApiQuery({ name: 'q', type: 'string', example: 'aapl.us' })
  @ApiOkResponse({ type: StockResponseDto, description: 'Returns data of requested stock quote' })
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

  @ApiBearerAuth()
  @ApiOkResponse({ type: [StockResponseDto], description: 'Returns all Stock request by user in JWT Token' })
  @UseGuards(JwtAuthGuard)
  @Get('history')
  getHistory(@Request() req: { user: UserPayload }): Observable<StoredStock[]> {
    return this.stockClient.send({ cmd: 'get_history' }, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: [StockStatDto],
    description: 'Returns the five most requested stocks (Requires admin role)',
  })
  @ApiForbiddenResponse({ description: 'User associated to token does not contain admin role' })
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Roles(Role.admin)
  @Get('stat')
  getStat(): Observable<any> {
    return this.stockClient.send({ cmd: 'get_stat' }, '')
  }
}
