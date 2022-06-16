import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  exports: [UsersService],
  providers: [UsersService],
})
export class UsersModule {}
