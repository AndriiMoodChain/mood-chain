"use client";

import { useState } from "react";
import { MoodType } from "@/types/mood";
import styles from "./MoodForm.module.css";

interface MoodFormProps {
  onSubmit: (mood: MoodType, description?: string, imageFile?: File) => Promise<void>;
  onClose: () => void;
}

export default function MoodForm({ onSubmit, onClose }: MoodFormProps) {
  const [mood, setMood] = useState<MoodType>("happy");
  const [description, setDescription] = useState("");
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

  const handleSubmit = async () => {
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(mood, description, imageFile);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.subtitle}>How are you feeling today?</h2>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="mood">
            Mood
          </label>
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
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="description">
            Description (optional)
          </label>
          <textarea
            id="description"
            className={styles.textarea}
            placeholder="Tell us more about how you're feeling..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.uploadLabel}>
            Upload Image (required)
          </label>
          <input
            type="file"
            accept="image/*"
            id="image"
            onChange={handleImageChange}
            className={styles.inputFile}
          />
          {imagePreview && (
            <div className={styles.previewContainer}>
              <img src={imagePreview} alt="Preview" className={styles.previewImage} />
            </div>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={styles.button}
            onClick={handleSubmit}
            disabled={isLoading || !imageFile}
          >
            {isLoading ? (
              <>
                <span className={styles.loadingSpinner} />
                Minting NFT...
              </>
            ) : (
              "Save Mood & Mint NFT"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}