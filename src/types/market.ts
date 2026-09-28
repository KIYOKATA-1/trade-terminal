export type MarketAsset = {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
};

export type BinanceTicker = {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
};