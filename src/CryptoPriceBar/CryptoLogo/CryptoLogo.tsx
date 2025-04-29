import btc_logo from "./bitcoin-btc-svg.svg";
// import eth_logo from "./ethereum-eth-logo.svg";
import sol_logo from "./solana-sol-logo.svg";
// import ton_logo from "./toncoin-ton-logo.svg";
// import etherfi_logo from "./etherfi-logo.png";
import roam_logo from "./roam.jpg";
// export {
//     btc_logo,
//     eth_logo,
//     sol_logo,
//     ton_logo
// }
interface LogoInfos_Type{
    name: string,
    symbol: string,
    logo: string,
}
const arrayLogo: LogoInfos_Type[] = [
    {name: "Bitcoin" , symbol: 'BTC', logo: btc_logo},
    // {name: "Ethereum" , symbol: 'ETH', logo: eth_logo},
    {name: "Solana" , symbol: 'SOL', logo: sol_logo},
    // {name: "Toncoin" , symbol: 'TON', logo: ton_logo},
    // {name: "EtherFi", symbol: "ETHFI", logo: etherfi_logo},
    {name: "Roam", symbol: "ROAM", logo: roam_logo},
]

export {arrayLogo, }
export type {LogoInfos_Type}
