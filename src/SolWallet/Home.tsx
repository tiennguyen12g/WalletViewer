import React, { useState } from 'react'
import WalletViewer from './ShowingWallet';
import Withdrawal from './Withdrawal';
import Test from './Test';
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
      </div>
     {page === "wallet-viewer" && <WalletViewer />}
     {page === "address-withdraw" && <Withdrawal />}
    </div>
  )
}
