"use client";

import { useState, useEffect } from "react";
import styles from "@/components/MoodAdvice/MoodAdvice.module.css";

const moodAdvice: Record<string, string[]> = {
  happy: [
    "Keep doing what makes you happy! Share your joy with others.",
    "Practice gratitude to maintain your positive mood.",
    "Celebrate small wins to keep the happiness flowing."
  ],
  sad: [
    "Reach out to a friend or loved one for support.",
    "Try journaling to process your feelings.",
    "Engage in gentle physical activity like walking."
  ],
  angry: [
    "Take deep breaths and count to 10 before reacting.",
    "Try physical activity to release tension.",
    "Express your feelings in a constructive way."
  ],
  anxious: [
    "Practice deep breathing or meditation.",
    "Focus on the present moment rather than worrying about the future.",
    "Create a to-do list to organize your thoughts."
  ],
  calm: [
    "Enjoy this peaceful state with mindfulness.",
    "Use this time for reflection or creative activities.",
    "Practice gratitude to enhance your calm."
  ],
  excited: [
    "Channel your energy into creative projects.",
    "Share your excitement with others.",
    "Set goals to make the most of this motivated state."
  ],
  tired: [
    "Prioritize rest and quality sleep.",
    "Stay hydrated and eat nourishing foods.",
    "Take short breaks throughout the day."
  ],
  default: [
    "Check in with yourself - how are you really feeling?",
    "Drink some water and take a few deep breaths.",
    "Go for a short walk to clear your mind."
  ]
};

export default function MoodAdvice({ currentMood }: { currentMood: string }) {
  const [advice, setAdvice] = useState("");

  const getRandomAdvice = () => {
    const moodKey = currentMood in moodAdvice ? currentMood : "default";
    const possibleAdvice = moodAdvice[moodKey];
    const randomIndex = Math.floor(Math.random() * possibleAdvice.length);
    setAdvice(possibleAdvice[randomIndex]);
  };

  useEffect(() => {
    getRandomAdvice();
  }, [currentMood]);

  return (
    <div className={styles.adviceCard}>
      <h3 className={styles.adviceTitle}>Mood Advice</h3>
      <p className={styles.adviceText}>{advice}</p>
      <button 
        className={styles.adviceButton} 
        onClick={getRandomAdvice}
      >
        Get Another Advice
      </button>
    </div>
  );
}