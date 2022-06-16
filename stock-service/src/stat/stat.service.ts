import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

export interface Stat {
    stock: string
    times_requested: number
}

@Injectable()
export class StatService {
    constructor(private prisma: PrismaService) { }

    async getMostRequestStocks(): Promise<Stat[]> {
        const rawStats = await this.prisma.stockQuoteRequest.groupBy({
            by: ['symbol'],
            _count: {
                symbol: true,
            },
            orderBy: {
                _count: {
                    symbol: "desc"
                }
            },
            take: 5,
        })

        return rawStats.map(rawStat => ({ stock: rawStat.symbol.toLowerCase(), times_requested: rawStat._count.symbol }))
    }
}
