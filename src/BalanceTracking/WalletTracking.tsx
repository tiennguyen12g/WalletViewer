import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import classNames from "classnames/bind";
import styles from "./WalletTracking.module.scss";
const cx = classNames.bind(styles);
import { wallets } from "../SolWallet/Wallets";
import { getRoamBalance } from "./TokenBalance";
import CryptoBar from "../CryptoPriceBar/CryptoBar";
import Worker from "../workers/GetCryptoPrice_Worker_V2?worker"
type WalletBalance = {
  walletNumber: number;
  address: string;
  balance: number | null; // balance in SOL
  roamBalance: number | null;
};
interface CryptoPrice {
  symbol: string;
  price: number;
}

export default function WalletTracking() {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [totalSol, setTotalSol] = useState(0);
  const [totalRoam, setTotalRoam] = useState(0);

  const CalSolanaBalance = (balancesData: WalletBalance[]) => {
     return balancesData.reduce((sum, wallet) => {
       return sum + (wallet.balance ?? 0);
     }, 0);
   }
   const Cal_Roam_Balance = (balancesData: WalletBalance[]) => {
    return balancesData.reduce((sum, wallet) => {
      return sum + (wallet.roamBalance ?? 0);
    }, 0);
  }

  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const cryptocurrencies = ['BTCUSDT', 'SOLUSDT','ROAMUSDT'];
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

  useEffect(() => {
    const connection = new Connection("https://quaint-tame-butterfly.solana-mainnet.quiknode.pro/0ae408df987c30197fcd12c3fe60b3e45f31e3c2/");

    const fetchBalances = async () => {
      const updatedBalances: WalletBalance[] = [];

      for (let i = 0; i < wallets.length; i++) {
        const wallet = wallets[i];

        try {
          if (i > 0 && i % 6 === 0) {
            console.log(`Sleeping after ${i} requests...`);
            await sleeper(1200); // sleep 1.5 seconds
          }

          const publicKey = new PublicKey(wallet.address);
          const lamports = await connection.getBalance(publicKey);
          const sol = lamports / 1_000_000_000; // Convert lamports to SOL

          const roamBalance = await getRoamBalance(wallet.address);
          updatedBalances.push({ ...wallet, balance: sol, roamBalance: roamBalance });
        } catch (error) {
          console.error(`Failed to fetch balance for wallet ${wallet.address}`, error);
          updatedBalances.push({ ...wallet, balance: null, roamBalance: null });
        }
      }
      const totalBalance = CalSolanaBalance(updatedBalances);
      setTotalSol(totalBalance);

      const totalRoam = Cal_Roam_Balance(updatedBalances);
      setTotalRoam(totalRoam);

      setBalances(updatedBalances);
    };

    fetchBalances();
  }, []);

  return (
    <div>
      <div>
        <CryptoBar />
      </div>
      <h2>Solana Wallet Balances</h2>
      <div className={cx("wallet-tracking")}>
        <div className={cx('table-footer')}>
          <div></div>
          <div>Total</div>
          <div>
            <span>{totalSol.toFixed(2)} ~ </span>
            <span style={{color: "green"}}>{(totalSol * (prices.find((info) => info.symbol === "SOLUSDT")?.price ?? 0)).toFixed(2)} USD</span>
          </div>

          <div>
            <span>{totalRoam.toFixed(2)} ~ </span>
            <span style={{color: "green"}}>${(totalRoam * (prices.find((info) => info.symbol === "ROAMUSDT")?.price ?? 0)).toFixed(2)}</span>
          </div>
        </div>
        <div className={cx("table-header")}>
          <div>No</div>
          <div>Address</div>
          <div>Sol</div>
          <div>Roam</div>
        </div>
        <div className={cx("table-body")}>
          {balances.map((wallet) => (
            <div className={cx("table-row")} key={wallet.walletNumber}>
              <div>{wallet.walletNumber}</div>
              <div>{wallet.address}</div>
              <div>{wallet.balance !== null ? `${wallet.balance.toFixed(3)} SOL` : "Error"}</div>
              <div>
                {wallet.roamBalance !== null ? <span>{wallet.roamBalance.toFixed(2)}</span> : 0} ~
                <span style={{color: "gray"}}> ${((wallet.roamBalance || 0) * (prices.find((info) => info.symbol === "ROAMUSDT")?.price ?? 0)).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function sleeper(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
