import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { StooqService } from './stooq/stooq.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [AppController],
  providers: [StooqService],
})
export class AppModule { }
