import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
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
    return this.appService.getStock(request.quote, request.userId).pipe(catchError((err: Error) => {
      if (err.message === 'STOCK_NOT_FOUND') {
        return of({
          error: { errorStatus: HttpStatus.NOT_FOUND, errorMessage: 'Stock quote not found' }
        })
      }

      throw err
    }))
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
