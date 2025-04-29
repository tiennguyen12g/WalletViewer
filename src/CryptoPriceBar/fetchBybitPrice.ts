// src/utils/api.ts
let lastPrice: number = 0;

// https://api.bybit.com/v5/market/tickers?category=inverse&symbol=BMTUSDT
export const fetchBybitPrice = async (symbol: string): Promise<number> => {
    try {
      const response = await fetch(`https://api.bybit.com/v2/public/tickers?symbol=${symbol}`);
      const data = await response.json();
      // console.log('data', data);
      const price = parseFloat(data.result[0].last_price);
      lastPrice = price;
      return price;
    } catch (error) {
      console.log(`Error fetching ${symbol} price from Bybit:`, error);
      // throw error;
      // console.log('lastprice', lastPrice);
      return lastPrice;
    }
  };
  