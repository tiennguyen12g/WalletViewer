import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import classNames from "classnames/bind";
import styles from "./ShowingWallet.module.scss";
const cx = classNames.bind(styles);
import { ConvertToShortAddress } from "./ConvertToShortAddress";
import { IoIosCopy } from "react-icons/io";
type WalletEntry = {
  no: number;
  publicKey: string;
  mnemonic: string;
};

type CheckboxState = {
  [publicKey: string]: { done: boolean; ban: boolean };
};

type DateState = {
  [publicKey: string]: string; // format: "YYYY-MM-DD"
};

const DATE_STORAGE_KEY = "wallet_mnemonic_dates";
const CHECKBOX_STORAGE_KEY = "wallet_checkbox_status";
const STORAGE_KEY = "solana_wallet_excel_base64";
const FILENAME_KEY = "file-name";
const WALLET_INDEX = "current-wallet-index";
localStorage.setItem("isUseAlert", "true");
const WalletViewer: React.FC = () => {
  const [wallets, setWallets] = useState<WalletEntry[]>([]);
  const isUseAlert = localStorage.getItem("isUseAlert");
  const [isAlert, setIsAlert] = useState(isUseAlert);
  const [dates, setDates] = useState<DateState>({});
  const [fileName, setFileName] = useState<string>("None");
  const [walletIndex, setWalletIndex] = useState<null | number>(0);
  const [isViewAll, setIsViewFull] = useState<null | "all">(null)
  const [checkboxes, setCheckboxes] = useState<CheckboxState>({});
  // Load from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const binary = atob(stored);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      parseExcelFile(bytes.buffer);
    }

    const checkboxData = localStorage.getItem(CHECKBOX_STORAGE_KEY);
    if (checkboxData) {
      setCheckboxes(JSON.parse(checkboxData));
    }

    const dateData = localStorage.getItem(DATE_STORAGE_KEY);
    if (dateData) {
      setDates(JSON.parse(dateData));
    }

    const fileName = localStorage.getItem(FILENAME_KEY);
    if(fileName){
      setFileName(fileName)
    }

    const walletIndex = localStorage.getItem(WALLET_INDEX);
    if(typeof Number(walletIndex)){
      setWalletIndex(Number(walletIndex))
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;

      // Save base64 string to localStorage
      const binary = new Uint8Array(arrayBuffer);
      const base64 = btoa(String.fromCharCode(...binary));
      localStorage.setItem(STORAGE_KEY, base64);

      parseExcelFile(arrayBuffer);
    };
    reader.readAsArrayBuffer(file);

    const fileName = file.name;
    localStorage.setItem(FILENAME_KEY,fileName)
    setFileName(fileName);
  };

  const parseExcelFile = (arrayBuffer: ArrayBuffer) => {
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 }) as any[][];

    const parsed = data.slice(1).map((row) => ({
      no: row[0],
      publicKey: row[1],
      mnemonic: row[2],
    }));

    setWallets(parsed);
  };

  const handleDateChange = (publicKey: string, value: string) => {
    const updated = {
      ...dates,
      [publicKey]: value,
    };
    setDates(updated);
    localStorage.setItem(DATE_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleCheckboxChange = (publicKey: string, field: "done" | "ban", value: boolean) => {
    const updated = {
      ...checkboxes,
      [publicKey]: {
        ...checkboxes[publicKey],
        [field]: value,
      },
    };
    setCheckboxes(updated);
    localStorage.setItem(CHECKBOX_STORAGE_KEY, JSON.stringify(updated));
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

      if (isUseAlert === "true") alert("Copied to clipboard!");
    } catch (err) {
      if (isUseAlert === "true") alert("Failed to copy to clipboard 😢");
      console.error(err);
    }
  };
  const handleChangeAlertMode = (mode: string) => {
    if (isAlert !== mode) {
      localStorage.setItem("isUseAlert", mode);
      setIsAlert(mode);
    }
  };

  const handleWalletIndex = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if(Number(value) !== walletIndex){
      setWalletIndex(+value);
      localStorage.setItem(WALLET_INDEX, value)
    }
  }
  const handleViewFullWallet = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const value = e.target.checked;
    if (value){
      setIsViewFull("all");
      setWalletIndex(null)
    } else {
      setIsViewFull(null);
      const walletIndex = localStorage.getItem(WALLET_INDEX);
      setWalletIndex(Number(walletIndex));
    }
  }
  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">📄 Solana Wallet Viewer</h3>

      <input type="file" accept=".xlsx" onChange={handleFileUpload} className="mb-4" />
      <h4>File-name: {fileName}</h4>
      <div
        onClick={() => {
          const value = isAlert === "true" ? "false" : "true";
          handleChangeAlertMode(value);
        }}
        style={{ cursor: "pointer", fontSize: 20 }}
      >
        <span>Alert mode: </span>
        <span>{isUseAlert}</span>
      </div>
      <div >
        <span>View All: </span>
        <input type="checkbox" placeholder="View-all" onChange={handleViewFullWallet} value={"all"} style={{width:20, height:20}}/>
        {/* <input type="number" onChange={handleWalletIndex} /> */}
        <span> Select Specific:</span>
        <select style={{marginLeft: 15, height: 26}} onChange={handleWalletIndex} >
          {Array.from({length: 100}, (_, index: number) => {
             return (
              <option key={index} value={index} >
                wallet {index + 1}
              </option>
            );
          })}
        </select>
      </div>
      <div>
        <div className={cx("table-header")}>
          <div>No</div>
          <div>Address</div>
          <div>Mnemonic</div>
        </div>
        <div className={cx("table-body")}>
          {isViewAll === null && wallets.map((wallet, index) => {
            const bgColor = (index + 1) % 2 === 0 ? "rgb(158, 214, 247)" : "none";
            return (
              <React.Fragment key={index}>
                {walletIndex === index && <div className={cx("table-row")} style={{ backgroundColor: bgColor }}>
                  <div style={{ fontSize: 24 }}>{wallet.no}</div>
                  <div>
                    <div>{ConvertToShortAddress(wallet.publicKey)}</div>
                    <div onClick={() => handleCopy(wallet.mnemonic)} style={{ cursor: "pointer" }}>
                      <IoIosCopy size={35} />
                    </div>
                    <div>
                      <span>
                        Ban:
                        <input
                          type="checkbox"
                          checked={checkboxes[wallet.publicKey]?.ban || false}
                          onChange={(e) => handleCheckboxChange(wallet.publicKey, "ban", e.target.checked)}
                        />
                      </span>
                    </div>
                  </div>
                  <div>
                    <div>{wallet.mnemonic}</div>
                    <div>
                      <input style={{height: 28, fontSize: 17}} type="date" value={dates[wallet.publicKey] || ""} onChange={(e) => handleDateChange(wallet.publicKey, e.target.value)} />
                    </div>
                    <span>
                      Roam:
                      <input
                        type="checkbox"
                        checked={checkboxes[wallet.publicKey]?.done || false}
                        onChange={(e) => handleCheckboxChange(wallet.publicKey, "done", e.target.checked)}
                      />
                    </span>
                  </div>
                </div>}
              </React.Fragment>
            );
          })}
          {isViewAll === "all" && wallets.map((wallet, index) => {
            const bgColor = (index + 1) % 2 === 0 ? "rgb(158, 214, 247)" : "none";
            return (
              <div className={cx("table-row")} key={index} style={{ backgroundColor: bgColor }}>
                <div style={{ fontSize: 24 }}>{wallet.no}</div>
                <div>
                  <div>{ConvertToShortAddress(wallet.publicKey)}</div>
                  <div onClick={() => handleCopy(wallet.mnemonic)} style={{ cursor: "pointer" }}>
                    <IoIosCopy size={35} />
                  </div>
                  <div>
                    <span>
                      Ban:
                      <input
                        type="checkbox"
                        checked={checkboxes[wallet.publicKey]?.ban || false}
                        onChange={(e) => handleCheckboxChange(wallet.publicKey, "ban", e.target.checked)}
                      />
                    </span>
                  </div>
                </div>
                <div>
                  <div>{wallet.mnemonic}</div>
                  <div>
                    <input style={{height: 28, fontSize: 17}} type="date" value={dates[wallet.publicKey] || ""} onChange={(e) => handleDateChange(wallet.publicKey, e.target.value)} />
                  </div>
                  <span>
                    Roam:
                    <input
                      type="checkbox"
                      checked={checkboxes[wallet.publicKey]?.done || false}
                      onChange={(e) => handleCheckboxChange(wallet.publicKey, "done", e.target.checked)}
                    />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WalletViewer;
