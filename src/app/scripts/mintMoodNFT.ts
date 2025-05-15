import {
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export async function mintMoodNft(
  metadataUri: string, 
  wallet: WalletContextState,
  moodType: string
) {
  try {
    const connection = new Connection(clusterApiUrl("devnet"));
    const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name: `Mood NFT - ${moodType}`,
      symbol: "MOOD",
      sellerFeeBasisPoints: 0,
      creators: [{
        address: wallet.publicKey!,
        share: 100,
      }],
      isMutable: false,
    });

    console.log("NFT minted:", nft);
    return nft.address;
  } catch (error) {
    console.error("Minting error:", error);
    throw new Error("Failed to mint NFT");
  }
}