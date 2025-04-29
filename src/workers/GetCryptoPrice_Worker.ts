// // src/workers/btcPriceWorker.ts
// import { fetchBybitPrice } from "../AppUI/BodyUI/CryptoPriceBar/fetchBybitPrice";
// import { fetchOkxPrice } from "../AppUI/BodyUI/CryptoPriceBar/fetchOkxPrice";
// interface CryptoPrice {
//   symbol: string;
//   price: number;
// }

// const internalTime = 10000 // ms
// self.onmessage = async (event: MessageEvent) => {
//   if (event.data && Array.isArray(event.data)) {
//     const symbols = event.data;
//     await fetchCryptoPrices(symbols);
//     setInterval(() => fetchCryptoPrices(symbols), internalTime);
//   }
// };
// let useBybit = true;
// const fetchCryptoPrices = async (symbols: string[]) => {
//   try {
//     const prices: CryptoPrice[] = await Promise.all(
//       symbols.map(async (symbol) => {
//         let price = 0;
//         if (symbol === "TONUSDT") {
//           if (useBybit) {
//             price = await fetchBybitPrice(symbol);
//             if (price === 0) useBybit = false;
//           } else {
//             price = await fetchOkxPrice(symbol);
//           }
//         } else {
//           price = await fetchBinancePrice(symbol);
//         }
//         return { symbol, price };
//       })
//     );
//     self.postMessage(prices);
//   } catch (error) {
//     console.error("Error fetching cryptocurrency prices:", error);
//   }
// };

// const fetchBinancePrice = async (symbol: string): Promise<number> => {
//   try {
//     const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
//     const data = await response.json();
//     return parseFloat(data.price);
//   } catch (error) {
//     console.error(`Error fetching ${symbol} price from Binance:`, error);
//     throw error;
//   }
// };

// export {};
