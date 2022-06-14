import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { parse as parseCSV } from 'papaparse';
import { StooqStock } from './stooq';

@Injectable()
export class StooqService {
  constructor(private httpService: HttpService) { }

  fetchStock(quote: string): Observable<any> {
    return this.httpService
      .get<string>(
        `https://stooq.com/q/l/?s=${quote}&f=sd2t2ohlcvn&e=csv`,
      )
      .pipe(
        map(({ data }) => {
          const headers = 'symbol,date,time,open,high,low,close,volume,name\n'
          const completeCSV = headers + data

          const parsedCSV = parseCSV(completeCSV, {
            header: true,
            dynamicTyping: true,
          })

          if (parsedCSV.data[0]["open"] === 'N/D') {
            throw new Error(
              'STOCK_NOT_FOUND',
            );
          }

          const { date, time, volume, ...stock } = parsedCSV.data[0] as StooqStock;

          return stock;
        }),
      )
      ;
  }
}
