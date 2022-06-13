import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() { }

  @MessagePattern({ cmd: 'get_stock' })
  getStock(_quote: string): any {
    return {
      "name": "APPLE",
      "symbol": "AAPL.US",
      "open": 123.66,
      "high": 123.66,
      "low": 122.49,
      "close": 123
    }
  }
}
