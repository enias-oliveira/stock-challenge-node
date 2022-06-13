export interface Stock {
  symbol: string
  date: string
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  name: string
}

export interface StooqResponse {
  symbols: Stock[]
}
