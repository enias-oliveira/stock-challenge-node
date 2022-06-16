import { Injectable } from '@nestjs/common';
import { Prisma, StockQuoteRequest } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async registerStockQuoteRequest(
    data: Prisma.StockQuoteRequestCreateInput,
  ): Promise<StockQuoteRequest> {
    return this.prisma.stockQuoteRequest.create({ data });
  }

  async findStockQuoteRequestFromUser(
    userId: number,
  ): Promise<Omit<StockQuoteRequest, 'id' | 'userId'>[]> {
    return this.prisma.stockQuoteRequest.findMany({
      where: { userId },
      select: {
        date: true,
        name: true,
        symbol: true,
        open: true,
        high: true,
        low: true,
        close: true,
      },
    });
  }
}
