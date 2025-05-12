"use client";

import { useState } from "react";
import { MoodType, MoodEntry } from "@/types/mood";
import styles from "./page.module.css";
import { useWallet } from "@solana/wallet-adapter-react";
import { mintMoodNft } from "../scripts/mintMoodNFT";

export default function CabinetPage() {
  const wallet = useWallet();
  const [mood, setMood] = useState<MoodType>("happy");
  const [description, setDescription] = useState("");
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [singleMood, setSingleMood] = useState<MoodEntry | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const handleMoodSubmit = async (newMood: MoodType, newDescription?: string) => {
    if (!wallet.connected || !wallet.publicKey || !imageFile) {
      alert("Please connect wallet and select an image.");
      return;
    }

    setIsLoading(true);

    try {
      const buffer = await imageFile.arrayBuffer();
      const imageBuffer = Buffer.from(buffer);
      const createdAt = new Date().toISOString();

      
      const formData = new FormData();
      formData.append("file", new Blob([imageBuffer], { type: imageFile.type }), imageFile.name);
      formData.append("mood", newMood);
      formData.append("description", newDescription || "");
      formData.append("createdAt", createdAt);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Metadata upload failed");
      console.log(res)
      const { metadataUri } = await res.json();

      
      const nftAddress = await mintMoodNft(metadataUri,wallet);

      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: createdAt,
        mood: newMood,
        description: newDescription,
        nftMinted: true,
        image: imagePreview || undefined,
        nftAddress: nftAddress.toBase58(),
      };

      setMoods([...moods, newEntry]);
      setSingleMood(newEntry);
      setMood("happy");
      setDescription("");
      setImagePreview(null);
      setImageFile(null);
    } catch (e) {
      console.error("Mint failed:", e);
      alert("Minting failed. See console for details.");
    } finally {
      setIsLoading(false);
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

  const moodColorClass = singleMood ? moodColors[singleMood.mood] || styles.moodDefault : styles.moodDefault;

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Your Mood Diary</h1>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.subtitle}>How are you feeling today?</h2>
          <label className={styles.label} htmlFor="mood">Mood:</label>
          <select
            id="mood"
            className={styles.select}
            value={mood}
            onChange={(e) => setMood(e.target.value as MoodType)}
          >
            <option value="happy">😊 Happy</option>
            <option value="sad">😢 Sad</option>
            <option value="angry">😡 Angry</option>
            <option value="anxious">😰 Anxious</option>
            <option value="calm">😌 Calm</option>
            <option value="excited">🤩 Excited</option>
            <option value="tired">😴 Tired</option>
          </select>

          <label className={styles.label} htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            className={styles.textarea}
            placeholder="Add a comment"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className={styles.uploadBlock}>
            <label htmlFor="image" className={styles.uploadLabel}>Upload Image (optional):</label>
            <input
              type="file"
              accept="image/*"
              id="image"
              onChange={handleImageChange}
              className={styles.inputFile}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className={styles.previewImage} />
            )}
          </div>

          <button
            className={styles.button}
            onClick={() => handleMoodSubmit(mood, description)}
            disabled={isLoading}
          >
            {isLoading ? "Minting..." : "Save Mood & Mint"}
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.subtitle}>Recent Mood</h2>
          {singleMood ? (
            <div className={`${styles.moodCard} ${moodColorClass}`}>
              <div className={styles.moodTitle}>{singleMood.mood.toUpperCase()}</div>
              <div className={styles.moodDate}>{new Date(singleMood.date).toLocaleDateString()}</div>
              {singleMood.description && <p className={styles.moodDescription}>{singleMood.description}</p>}
              {singleMood.nftMinted && <span className={styles.nftTag}>NFT Minted ✅</span>}
              {singleMood.image && (
                <img src={singleMood.image} alt="Mood" className={styles.moodCardImage} />
              )}
            </div>
          ) : <p>No mood recorded yet.</p>}

          <div className={styles.analysisSection}>
            <h3 className={styles.analysisTitle}>Mood Analysis</h3>
            <p className={styles.analysisText}>You seem to be feeling mostly positive this week. Keep up the good vibes! 🎉</p>
            <p className={styles.analysisText}>Tip: Try journaling before bed to reflect and unwind.</p>
          </div>
        </div>
      </div>
    </main>
  );
}