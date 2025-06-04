"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import styles from "@/components/MoodNFTGallery/MoodNFTGallery.module.css";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

const getMoodClass = (mood: string) => {
  switch (mood.toLowerCase()) {
    case 'happy':
      return styles.moodHappy;
    case 'sad':
      return styles.moodSad;
    case 'angry':
      return styles.moodAngry;
    case 'anxious':
      return styles.moodAnxious;
    case 'calm':
      return styles.moodCalm;
    case 'excited':
      return styles.moodExcited;
    case 'tired':
      return styles.moodTired;
    default:
      return '';
  }
};

export default function MoodNFTGallery({ refreshTrigger }: { refreshTrigger: number }) {
  const wallet = useWallet();
  const [nfts, setNfts] = useState<Array<{ nft: any; metadata: NFTMetadata | null }>>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

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
        setCurrentIndex(0);
      } catch (err) {
        console.error("Failed to load NFTs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [wallet.publicKey, refreshTrigger]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 2 >= nfts.length ? prevIndex : prevIndex + 2
    );
  }, [nfts.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? 0 : prevIndex - 2
    );
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
  };

  if (!wallet.connected) return (
    <p className="text-center text-gray-600 p-4">Please connect your wallet to see NFTs.</p>
  );

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <p className="text-gray-600">Loading mood NFTs...</p>
    </div>
  );

  const visibleNFTs = nfts.slice(currentIndex, currentIndex + 2);

  return (
    <div className={styles.galleryContainer}>
      <div
        className={styles.nftSlider}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {nfts.length === 0 && (
          <p className="col-span-full text-center text-gray-600 p-4">No MOOD NFTs found.</p>
        )}

        <div className={styles.sliderControls}>
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={styles.arrowButton}
            aria-label="Previous NFTs"
          >
            &lt;
          </button>

          <div className={styles.slideContainer}>
            {visibleNFTs.map(({ nft, metadata }) => (
              <div key={nft.mintAddress.toString()} className={styles.nftCard}>
                {metadata?.image ? (
                  <img
                    src={metadata.image}
                    alt={metadata.name}
                    className={styles.nftImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.png';
                    }}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <span className={styles.placeholderText}>Image not available</span>
                  </div>
                )}
                <div className={styles.nftInfo}>
                  <h4 className={styles.nftName}>
                    {metadata?.name || nft.name}
                  </h4>
                  <div className={styles.nftMood}>
                    <span>Mood:</span>
                    <span className={`${styles.moodValue} ${getMoodClass(metadata?.attributes?.find((a) => a.trait_type === "Mood")?.value || "")}`}>
                      {metadata?.attributes?.find((a) => a.trait_type === "Mood")?.value || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentIndex + 2 >= nfts.length}
            className={styles.arrowButton}
            aria-label="Next NFTs"
          >
            &gt;
          </button>
        </div>

        <div className={styles.dotsContainer}>
          {Array.from({ length: Math.ceil(nfts.length / 2) }).map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${currentIndex / 2 === index ? styles.activeDot : ''}`}
              onClick={() => setCurrentIndex(index * 2)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}