export interface StooqStock {
  symbol: string;
  date: string;
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  name: string;
}

export interface StooqResponse {
  symbols: StooqStock[];
}

export interface Stock {
  name: string;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
}
