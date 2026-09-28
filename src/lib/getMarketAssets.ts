import type { BinanceTicker, MarketAsset } from "@/types/market";

const coins = [
  { symbol: "BTCUSDT", name: "Bitcoin" },
  { symbol: "ETHUSDT", name: "Ethereum" },
  { symbol: "SOLUSDT", name: "Solana" },
];

export async function getMarketAssets(): Promise<MarketAsset[]> {
  return Promise.all(
    coins.map(async (coin) => {
      const url = new URL(
        "https://data-api.binance.vision/api/v3/ticker/24hr"
      );

      url.searchParams.set("symbol", coin.symbol);

      const response = await fetch(url, {
        next: { revalidate: 30 },
      });

      if (!response.ok) {
        throw new Error(`Не удалось загрузить ${coin.symbol}`);
      }

      const data: BinanceTicker = await response.json();

      return {
        symbol: coin.symbol,
        name: coin.name,
        price: Number(data.lastPrice),
        changePercent: Number(data.priceChangePercent),
      };
    })
  );
}