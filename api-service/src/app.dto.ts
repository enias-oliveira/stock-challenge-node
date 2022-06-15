import { ApiProperty } from "@nestjs/swagger";

export class StockResponseDto {
    @ApiProperty({
        description: "Date of Quote request formatted in ISO timestamp",
        example: "2022-06-14T10:32:10.201Z"
    })
    date: string;

    @ApiProperty({ example: "ALLIANCEBERNSTEIN HOLDING\r" })
    name: string;

    @ApiProperty({ example: "AB.US" })
    symbol: string;

    @ApiProperty({ example: 41.36 })
    open: number;

    @ApiProperty({ example: 41.94 })
    high: number;

    @ApiProperty({ example: 40.05 })
    low: number;

    @ApiProperty({ example: 40.55 })
    close: number;
}

export class StockStatDto {
    @ApiProperty({ example: "aaa.us" })
    stock: string

    @ApiProperty({ example: 3 })
    times_requested: number
}
