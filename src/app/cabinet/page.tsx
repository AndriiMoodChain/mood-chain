"use client";

import { useState } from "react";
import { MoodType, MoodEntry } from "@/types/mood";
import styles from "./page.module.css";

const dummyMoods: MoodEntry[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    mood: "happy" as MoodType,
    description: "Feeling light and joyful.",
    nftMinted: false,

  },
];

const initialSingleMood: MoodEntry = {
  id: "2",
  date: new Date().toISOString(),
  mood: "excited" as MoodType,
  description: "Got an NFT for my mood!",
  nftMinted: true,
};

export default function CabinetPage() {
  const [mood, setMood] = useState<MoodType>("happy");
  const [description, setDescription] = useState("");
  const [moods, setMoods] = useState<MoodEntry[]>(dummyMoods);
  const [singleMood, setSingleMood] = useState<MoodEntry>(initialSingleMood);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };



  const handleMoodSubmit = (newMood: MoodType, newDescription?: string) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: newMood,
      description: newDescription,
      nftMinted: false,
      image: imagePreview || undefined,
    };

    setMoods([...moods, newEntry]);
    setSingleMood(newEntry);
    setMood("happy");
    setDescription("");
    setImagePreview(null);
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

  const moodColorClass = moodColors[singleMood.mood] || styles.moodDefault;

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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Upload Image (optional):</label>
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

          <button className={styles.button} onClick={() => handleMoodSubmit(mood, description)}>
            Save Mood
          </button>
        </div>

        <div className={styles.card}>
          <h2 className={styles.subtitle}>Recent Mood</h2>
          <div className={`${styles.moodCard} ${moodColorClass}`}>
            <div className={styles.moodTitle}>{singleMood.mood.toUpperCase()}</div>
            <div className={styles.moodDate}>{new Date(singleMood.date).toLocaleDateString()}</div>
            {singleMood.description && <p className={styles.moodDescription}>{singleMood.description}</p>}
            {singleMood.nftMinted && <span className={styles.nftTag}>NFT Minted ✅</span>}
            {singleMood.image && (
              <img src={singleMood.image} alt="Mood" className={styles.moodCardImage} />
            )}

          </div>

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
