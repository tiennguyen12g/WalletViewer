import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";

type AccountToken = {
  address: PublicKey; // <- The token account address (same as the input `ata`)
  mint: PublicKey; // Token mint address (e.g., ROAM token)
  owner: PublicKey; // Wallet address that owns this token account
  amount: bigint; // Amount of tokens held in this token account
  // ... other metadata
};

// Get ROAM token balance for a wallet
const getRoamBalance = async (walletAddress: string): Promise<number | null> => {
  try {
    const connection = new Connection("https://quaint-tame-butterfly.solana-mainnet.quiknode.pro/0ae408df987c30197fcd12c3fe60b3e45f31e3c2/");

    const walletPublicKey = new PublicKey(walletAddress);
    const roamMint = new PublicKey("RoamA1USA8xjvpTJZ6RvvxyDRzNh6GCA1zVGKSiMVkn");

    // Get associated token address
    const ata = await getAssociatedTokenAddress(roamMint, walletPublicKey);

    // Get the token account info
    const tokenAccount = await getAccount(connection, ata);
    // console.log("Token Account:", tokenAccount.address.toBase58());
    // console.log("Owner Wallet:", tokenAccount.owner.toBase58());
    // console.log("Token Mint:", tokenAccount.mint.toBase58());

    const balance = Number(tokenAccount.amount); // in raw units
    const decimals = 6; // Fallback if unknown

    return balance / 10 ** decimals;
  } catch (err) {
    console.error("Error fetching ROAM balance:", err);
    return null;
  }
};
export { getRoamBalance };
