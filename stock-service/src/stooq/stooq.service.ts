import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { StooqStock, StooqResponse } from './stooq';

@Injectable()
export class StooqService {
  constructor(private httpService: HttpService) {}

  fetchStock(quote: string): Observable<StooqStock> {
    return this.httpService
      .get<StooqResponse>(
        `https://stooq.com/q/l/?s=${quote}&f=sd2t2ohlcvn&e=json`,
      )
      .pipe(map((resp) => resp.data.symbols[0]));
  }
}
