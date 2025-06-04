"use client";

import { useState } from "react";
import { MoodType, MoodEntry } from "@/types/mood";
import styles from "./page.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintMoodNft } from "../scripts/mintMoodNFT";
import MoodNFTGallery from "@/components/MoodNFTGallery/MoodNFTGallery";
import MoodAdvice from "@/components/MoodAdvice/MoodAdvice";
import MoodForm from "@/components/MoodForm/MoodForm";

export default function CabinetPage() {
  const wallet = useWallet();
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [singleMood, setSingleMood] = useState<MoodEntry | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showMoodForm, setShowMoodForm] = useState(false);

  const handleMoodSubmit = async (newMood: MoodType, newDescription?: string, imageFile?: File) => {
    if (!wallet.connected || !wallet.publicKey || !imageFile) {
      alert("Please connect wallet and select an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("mood", newMood);
      formData.append("description", newDescription || "");
      formData.append("createdAt", new Date().toISOString());

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const { metadataUri } = await uploadResponse.json();
      const nftAddress = await mintMoodNft(metadataUri, wallet, newMood);

      const newEntry: MoodEntry = {
        id: nftAddress.toString(),
        date: new Date().toISOString(),
        mood: newMood,
        description: newDescription,
        nftMinted: true,
        nftAddress: nftAddress.toString(),
      };

      setMoods([...moods, newEntry]);
      setSingleMood(newEntry);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error:", error);
      alert("Operation failed. See console for details.");
    }
  };

  const moodColors: { [key in MoodType]: string } = {
    happy: styles.moodHappy,
    sad: styles.moodSad,
    angry: styles.moodAngry,
    anxious: styles.moodAnxious,
    calm: styles.moodCalm,
    excited: styles.moodExcited,
    tired: styles.moodTired,
  };

  //const moodColorClass = singleMood ? moodColors[singleMood.mood] || styles.moodDefault : styles.moodDefault;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Your Mood Diary</h1>
      
      <div className={styles.grid}>
       
        <div className={styles.card}>
          <h2 className={styles.subtitle}>Track Your Mood</h2>
          
          <button
            className={styles.button}
            onClick={() => setShowMoodForm(true)}
            disabled={!wallet.connected}
          >
            Claim Mood Today
          </button>

          {showMoodForm && (
            <MoodForm
              onSubmit={(mood, description, imageFile) => handleMoodSubmit(mood, description, imageFile)}
              onClose={() => setShowMoodForm(false)}
            />
          )}
          <MoodAdvice currentMood={singleMood?.mood || "happy"} />
        </div>

       
        <div className={styles.card}>
          <h2 className={styles.subtitle}>Your Mood Collection</h2>
          <MoodNFTGallery refreshTrigger={refreshKey} />
          
          <div className={styles.divider} />
          
          
        </div>
      </div>
    </main>
  );
}