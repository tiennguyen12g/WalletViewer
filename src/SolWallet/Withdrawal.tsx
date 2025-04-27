import React, { useState, useEffect } from "react";
import { ConvertToShortAddress } from "./ConvertToShortAddress";
import { IoIosCopy } from "react-icons/io";
import { wallets } from "./Wallets";
const WALLET_NUMBER_STORAGE_KEY = "wallet-id";

export default function Withdrawal() {
  const [idSelected, setIdSelected] = useState<number | string>("None");
  const [walletSelected, setWalletSelected] = useState("None");
  useEffect(() => {
    const storedId = localStorage.getItem(WALLET_NUMBER_STORAGE_KEY) || "None";
    setIdSelected(storedId);

    if (storedId !== "None") {
      const foundWallet = wallets.find((wallet: any) => wallet.walletNumber === Number(storedId));
      if (foundWallet) {
        setWalletSelected(foundWallet.address);
      } else {
        setWalletSelected("None");
      }
    } else {
      setWalletSelected("None");
    }
  }, []);

  const handleSelectWalletID = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    if (idSelected !== selectedId) {
      console.log("hi");
      localStorage.setItem(WALLET_NUMBER_STORAGE_KEY, selectedId);
      setIdSelected(selectedId);
      if (selectedId !== "None") {
          const foundWallet = wallets.find((wallet: any) => wallet.walletNumber === Number(selectedId));
          if (foundWallet) {
            setWalletSelected(foundWallet.address);
          } else {
            setWalletSelected("None");
          }
        } else {
          setWalletSelected("None");
        }
    }
  };
  const handleCopy = async (text: string) => {
    try {
      // First, try Clipboard API (works on most desktop & modern mobile browsers)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback: create a temporary <textarea> to copy the text
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed"; // prevent scrolling to bottom
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();

        const success = document.execCommand("copy");
        if (!success) throw new Error("Fallback copy failed");

        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h3>Select Address</h3>
      <select value={idSelected} onChange={handleSelectWalletID} style={{ height: 32, width: 100 }}>
        <option value="None">None</option>
        {wallets.map((wallet, i) => (
          <option key={i} value={wallet.walletNumber}>
            ID - {wallet.walletNumber}
          </option>
        ))}
      </select>
      <div>
        <span style={{ fontSize: 20 }}>Address: {walletSelected === "None" ? walletSelected : ConvertToShortAddress(walletSelected)}</span>
        <div onClick={() => handleCopy(walletSelected)} style={{ cursor: "pointer" }}>
          <IoIosCopy size={35} />
        </div>
      </div>
    </div>
  );
}
