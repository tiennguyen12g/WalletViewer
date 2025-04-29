// src/utils/api.ts

interface CryptoPriceType {
  symbol: string;
  price: number;
  percent?: string
}
// https://api.bybit.com/v5/market/tickers?category=inverse&symbol=BMTUSDT
export const fetchBybitPrice_V2 = async (symbol: string): Promise<CryptoPriceType> => {

    try {
      const response = await fetch(`https://api.bybit.com/v5/market/tickers?category=inverse&symbol=${symbol}`);
      const data = await response.json();
      // console.log('data', data);
      const objPrice: any = data.result.list[0];
      const price = objPrice.lastPrice;
      const percent = objPrice.price24hPcnt;

      return {
        symbol: symbol,
        price: price,
        percent: percent
      }
    } catch (error) {
      console.log(`Error fetching ${symbol} price from Bybit:`, error);
      // throw error;
      // console.log('lastprice', lastPrice);
      return {
        symbol: symbol,
        price: 0,
        percent: "0",
      }
    }
  };
  