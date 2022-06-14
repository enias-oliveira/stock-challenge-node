export interface Stock {
  symbol: string;
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface StoredStock {
  date: Date;
  symbol: string;
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
}
