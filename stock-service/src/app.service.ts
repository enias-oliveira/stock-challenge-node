import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { map, mergeMap, Observable } from 'rxjs';
import { HistoryService } from './history/history.service';
import { Stock, StooqStock } from './stooq/stooq';
import { StooqService } from './stooq/stooq.service';

@Injectable()
export class AppService {
  constructor(
    private stooqService: StooqService,
    private historyService: HistoryService,
  ) {}

  getStock(quote: string, userId: number): Observable<Stock> {
    return this.stooqService
      .fetchStock(quote)
      .pipe(
        map((stooqStock: StooqStock) => {
          const { volume, date, time, ...stock } = stooqStock;

          if (stock.name) {
            return stock;
          }

          throw new HttpException(
            'Stock quote not found',
            HttpStatus.NOT_FOUND,
          );
        }),
      )
      .pipe(
        mergeMap(async (rawStockData) => {
          return await this.historyService.registerStockQuoteRequest({
            ...rawStockData,
            userId,
          });
        }),
      )
      .pipe(
        map((registeredStock) => {
          const { id, userId, ...stock } = registeredStock;
          return stock;
        }),
      );
  }
}
