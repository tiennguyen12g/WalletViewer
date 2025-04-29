let lastPrice: number = 0;
export const fetchOkxPrice = async (pair: string) => {
  const pair_in_okx_format = formatSymbol(pair);
  try {
    const response = await fetch(`https://www.okx.com/api/v5/market/ticker?instId=${pair_in_okx_format}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const price = parseFloat(data.data[0].last) ;
    lastPrice = price;
    console.log(`The current price of ${pair_in_okx_format} is: ${price}`);
    return price;
  } catch (error) {
    console.error(`Error fetching ${pair_in_okx_format} the price:`, error);
    return lastPrice;
  }
};

const formatSymbol = (symbol: string): string => {
  // Add a hyphen between the base and quote currency
  const base = symbol.slice(0, 3);
  const quote = symbol.slice(3);
  return `${base}-${quote}`;
};
