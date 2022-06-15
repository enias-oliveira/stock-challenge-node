import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException, Inject,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { generate as generatePassword } from 'generate-password';
import * as mailgun from 'mailgun-js';
import { lastValueFrom, Observable } from 'rxjs';
import { Stock, StoredStock } from './app';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { LocalAuthGuard } from './auth/passport/local-auth.guard';
import { Roles } from './auth/roles/roles.decorator';
import { RolesGuard } from './auth/roles/roles.guard';
import { PrismaService } from './database/prisma/prisma.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UserCredentials, UserPayload } from './users/users';
import { ValidateUserPipe } from './users/validate-user.pipe';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
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

  @HttpCode(201)
  @Put('password')
  async updatePassword(@Query('email') email: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } })

    if (!user) {
      throw new NotFoundException('User not found by given email')
    }

    const newPassword = generatePassword({ length: 32 })
    const newPassswordHash = await hash(newPassword, 10)

    const mgOptions = {
      apiKey: '5c83103690dc9c7b87646c4dd06c5072-50f43e91-64c25c7f',
      domain: 'sandboxc744b2eb90e4413ba4494e03898e5ccb.mailgun.org',
    }

    const mg = mailgun(mgOptions)

    const data = {
      from: 'Jobsity - by Enias <enias.jobsity@sandboxc744b2eb90e4413ba4494e03898e5ccb.mailgun.org>',
      to: email,
      subject: 'Password Reset',
      html: `
<!doctype html>
<html lang="en-US">

<head>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <title>Reset Password Email Template</title>
    <meta name="description" content="Reset Password Email Template.">
    <style type="text/css">
        a:hover {text-decoration: underline !important;}
    </style>
</head>

<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <!--100% body table-->
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">
                                          </td>
                    </tr>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="padding:0 35px;">
                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                            requested to reset your password</h1>
                                        <span
                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Here is your new password:
                                        </p>
                                        <a href="javascript:void(0);"
                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff; font-size:14px;padding:10px 24px;display:inline-block;">${newPassword}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:40px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    <tr>
                        <td style="height:20px;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align:center;">

                        </td>
                    </tr>
                    <tr>
                        <td style="height:80px;">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>

</html>`
    };

    try {
      await mg.messages().send(data)
    } catch (err) {
      throw new InternalServerErrorException('E-mail service may be down or invalid e-mail was registered')
    }

    await this.prismaService.user.update({
      where: { email },
      data: { passwordHash: newPassswordHash }
    })
  }
}
