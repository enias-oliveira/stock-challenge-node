import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { StooqService } from './stooq/stooq.service';
import { HistoryService } from './history/history.service';
import { AppService } from './app.service';
import { StatService } from './stat/stat.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [AppController],
  providers: [AppService, StooqService, HistoryService, StatService],
})
export class AppModule {}