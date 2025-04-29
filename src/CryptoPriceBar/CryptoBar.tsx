import {useState, useEffect} from 'react'
import { arrayLogo, LogoInfos_Type} from './CryptoLogo/CryptoLogo';
import classNames from 'classnames/bind'
import styles from './CryptoBar.module.scss'
const cx = classNames.bind(styles);

// import Worker from "../workers/GetCryptoPrice_Worker?worker";
import Worker from "../workers/GetCryptoPrice_Worker_V2?worker"

interface CryptoPrice {
    symbol: string;
    price: number;
  }

  
const cryptocurrencies = ['BTCUSDT', 'SOLUSDT','ROAMUSDT'];
// const testArray: CryptoPrice[] = [
//     {
//         symbol: "BTCUSDT",
//         price: 1000,
//     },
//     {
//         symbol: "ETHUSDT",
//         price: 1000,
//     },
//     {
//         symbol: "SOLUSDT",
//         price: 1000,
//     },
//     {
//         symbol: "TONUSDT",
//         price: 1000,
//     },

// ]
export default function CryptoBar() {
    const logoSize = 25;
    const [prices, setPrices] = useState<CryptoPrice[]>([]);

    useEffect(() => {
      const worker = new Worker();
      worker.postMessage(cryptocurrencies);
  
      worker.onmessage = (event: MessageEvent) => {
        setPrices(event.data);
      };
  
      return () => {
        worker.terminate();
      };
    }, []);
  return (
    <div className={cx('wrap-crypto-bar')}>
        <div className={cx('token-container')}>
            {prices.length > 0 && arrayLogo.map((logoInfo: LogoInfos_Type, i: number) => {
                const objPrice = prices[i];
                return(
                    <div className={cx('token-price-box')} key={i}>
                        <div className={cx('token-name-logo')}>
                            <img src={logoInfo.logo} alt={logoInfo.symbol} width={logoSize} height={logoSize} />
                            <span>{logoInfo.name}</span>
                        </div>
                        <div className={cx('token-price')}>
                            {objPrice ? <div>$ {(objPrice.price) }</div> : 0}
                        </div>
                    </div>
                )
            })}
        </div>
        <div className={cx('line-decor')}>
            <div className={cx('line-left')}>

            </div>
            <div className={cx('square')}>

            </div>
            <div className={cx('line-right')}>

            </div>

        </div>
    </div>
  )
}
