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

  if (!wallet.connected) return (
    <p className="text-center text-gray-600 p-4">Please connect your wallet to see NFTs.</p>
  );
  
  if (loading) return (
    <p className="text-center text-gray-600 p-4">Loading mood NFTs...</p>
  );

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {nfts.length === 0 && (
          <p className="col-span-full text-center text-gray-600 p-4">No MOOD NFTs found.</p>
        )}
        {nfts.map(({ nft, metadata }) => (
          <div 
            key={nft.mintAddress.toString()} 
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
          >
            {metadata?.image ? (
              <img 
                src={metadata.image} 
                alt={metadata.name} 
                className="w-full h-48 sm:h-56 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-image.png';
                }}
              />
            ) : (
              <div className="w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Image not available</span>
              </div>
            )}
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                {metadata?.name || nft.name}
              </h4>
              <p className="text-sm text-gray-600">
                {metadata?.attributes?.find((a) => a.trait_type === "Mood")?.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}