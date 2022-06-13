import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { HistoryService } from './history/history.service';
import { Stat, StatService } from './stat/stat.service';

interface GetStockRequest {
  quote: string;
  userId: number;
}

@Controller()
export class AppController {
  constructor(
    private historyService: HistoryService,
    private appService: AppService,
    private statService: StatService
  ) { }

  @MessagePattern({ cmd: 'get_stock' })
  getStock(request: GetStockRequest) {
    return this.appService.getStock(request.quote, request.userId);
  }

  @MessagePattern({ cmd: 'get_history' })
  getHistory(userId: number) {
    return this.historyService.findStockQuoteRequestFromUser(userId);
  }

  @MessagePattern({ cmd: 'get_stat' })
  getStat(): Promise<Stat[]> {
    return this.statService.getMostRequestStocks();
  }
}
