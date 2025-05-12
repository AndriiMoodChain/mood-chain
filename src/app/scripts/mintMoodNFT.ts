import {
  Metaplex,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import { Connection } from "@solana/web3.js";
import { WalletContextState } from "@solana/wallet-adapter-react";

export async function mintMoodNft(metadataUri: string, wallet: WalletContextState) {
  const connection = new Connection("https://api.devnet.solana.com");
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

  const { nft } = await metaplex.nfts().create({
    uri: metadataUri,
    name: "Mood NFT",
    symbol: "MOOD",
    sellerFeeBasisPoints: 0,
  });

  return nft.address;
}
