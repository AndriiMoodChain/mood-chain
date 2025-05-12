"use client";
import styles from "./JoyMessage.module.css";
import { motion } from "framer-motion";

export const JoyMessage = () => {
  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h2 className={styles.heading}>MoodChain — Your Emotions on the Blockchain</h2>

      <p className={styles.paragraph}>
        <strong>What if your feelings had a memory?</strong><br />
        MoodChain is a personal emotional diary powered by blockchain — where each mood you log becomes a unique NFT.
      </p>

      <p className={styles.paragraph}>
        <strong>Why it matters:</strong><br />
        Most mental health apps feel cold and clinical. MoodChain is different — it's built for self-reflection, connection, and celebration.
      </p>

      <p className={styles.paragraph}>
        <strong>How it works:</strong><br />
        Track your emotions daily. Earn NFT badges for emotional milestones. Visualize your mental wellness through mood calendars, analytics, and smart AI suggestions.
      </p>

      <p className={styles.paragraph}>
        <strong>Powered by Web3:</strong><br />
        Your mood entries live on-chain — private, tamper-proof, and ready for a future where your emotional journey matters.
      </p>

      <p className={styles.finalNote}>
        MoodChain helps you understand yourself, grow emotionally, and share your story — one feeling at a time. ❤️
      </p>
    </motion.section>
  );
};
