import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([{ name: 'STOCK_SERVICE', transport: Transport.TCP }])
  ],
  controllers: [AppController],
})
export class AppModule { }
