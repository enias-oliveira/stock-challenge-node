import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StooqService } from './stooq/stooq.service';


@Controller()
export class AppController {
  constructor(private stooqService: StooqService) { }

  @MessagePattern({ cmd: 'get_stock' })
  getStock(quote: string) {
    return this.stooqService.fetchStock(quote)
  }
}
