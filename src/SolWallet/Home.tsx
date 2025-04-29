import { useState } from 'react'
import WalletViewer from './ShowingWallet';
import Withdrawal from './Withdrawal';
import WalletTracking from '../BalanceTracking/WalletTracking';
export default function Home() {
     const [page,setPage] = useState("wallet-viewer");
     const handleSwitchPage = (pageName: string) => {
          if(pageName !== page){
               setPage(pageName)
          }
     }
  return (
    <div>
      <div>
          <button onClick={() => handleSwitchPage("wallet-viewer")} style={{backgroundColor: page === "wallet-viewer" ? "orange" : ""}}>Viewer</button>
          <button onClick={() => handleSwitchPage("address-withdraw")} style={{backgroundColor: page === "address-withdraw" ? "orange" : ""}}>Address</button>
          <button onClick={() => handleSwitchPage("wallet-balance")} style={{backgroundColor: page === "wallet-balance" ? "orange" : ""}}>Balance</button>
      </div>
     {page === "wallet-viewer" && <WalletViewer />}
     {page === "address-withdraw" && <Withdrawal />}
     {page === "wallet-balance" && <WalletTracking />}
    </div>
  )
}
