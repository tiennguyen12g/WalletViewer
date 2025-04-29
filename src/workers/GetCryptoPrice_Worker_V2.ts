// src/workers/btcPriceWorker.ts
import { fetchBybitPrice_V2 } from "../CryptoPriceBar/fetchBybitPrice_V2";

interface CryptoPriceType {
  symbol: string;
  price: number;
  percent?: string
}

const internalTime = 10000 // ms
self.onmessage = async (event: MessageEvent) => {
  if (event.data && Array.isArray(event.data)) {
    const symbols = event.data;
    await fetchCryptoPrices(symbols);
    setInterval(() => fetchCryptoPrices(symbols), internalTime);
  }
};

const fetchCryptoPrices = async (symbols: string[]) => {
  try {
    const prices: CryptoPriceType[] = await Promise.all(
      symbols.map(async (symbol) => {
        let objData: CryptoPriceType= await fetchBybitPrice_V2(symbol);
        // if( objData.price === 0){
        //   objData = await fetchBinancePrice(symbol);
        // }
        if(objData.price === 0) {
          objData = {
            symbol: symbol,
            price: 0
          }
        }
        return objData;
      })
    );
    self.postMessage(prices);
  } catch (error) {
    console.error("Error fetching cryptocurrency prices:", error);
  }
};


export {};
export type { CryptoPriceType}
