"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

export default function MoodNFTGallery({ refreshTrigger }: { refreshTrigger: number }) {
  const wallet = useWallet();
  const [nfts, setNfts] = useState<Array<{ nft: any; metadata: NFTMetadata | null }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!wallet.publicKey) return;
      setLoading(true);

      try {
        const connection = new Connection(clusterApiUrl("devnet"));
        const metaplex = Metaplex.make(connection);
        const allNFTs = await metaplex.nfts().findAllByOwner({ owner: wallet.publicKey });

        const moodNFTs = allNFTs.filter((nft) => nft.symbol === "MOOD");
        
        
        const nftsWithMetadata = await Promise.all(
          moodNFTs.map(async (nft) => {
            try {
              const metadata = await fetch(nft.uri).then((res) => res.json());
              return { nft, metadata };
            } catch (error) {
              console.error(`Failed to load metadata for NFT ${nft.address.toString()}`, error);
              return { nft, metadata: null };
            }
          })
        );

        setNfts(nftsWithMetadata);
      } catch (err) {
        console.error("Failed to load NFTs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [wallet.publicKey, refreshTrigger]);

  if (!wallet.connected) return <p>Please connect your wallet to see NFTs.</p>;
  if (loading) return <p>Loading mood NFTs...</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 200px)", gap: "1rem" }}>
      {nfts.length === 0 && <p>No MOOD NFTs found.</p>}
      {nfts.map(({ nft, metadata }) => (
        <div key={nft.mintAddress.toString()} style={{ border: "1px solid #ccc", padding: "1rem" }}>
          {metadata?.image ? (
            <img 
              src={metadata.image} 
              alt={metadata.name} 
              style={{ width: "100%", borderRadius: "10px" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.png';
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "200px", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
              Image not available
            </div>
          )}
          <h4>{metadata?.name || nft.name}</h4>
          <p>{metadata?.attributes?.find((a) => a.trait_type === "Mood")?.value}</p>
        </div>
      ))}
    </div>
  );
}