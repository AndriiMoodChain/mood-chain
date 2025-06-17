"use client";

import { useState } from 'react';
import styles from './analytics.module.css';
import { useWallet } from "@solana/wallet-adapter-react";
import { analyzeMoods } from '@/app/scripts/analyzeMoods';

interface AnalysisResult {
  moodTrend: string;
  recommendations: string[];
  insights: string[];
  weeklyStats: {
    mostFrequent: string;
    averageMood: string;
    moodDistribution: { [key: string]: number };
  };
}

export default function AnalyticsPage() {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!wallet.connected) {
      alert("Please connect your wallet to analyze your moods.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeMoods(wallet.publicKey!);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("Failed to analyze moods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Mood Analysis</h1>
      
      {!wallet.connected ? (
        <div className={styles.connectPrompt}>
          <p>Connect your wallet to view your mood analysis</p>
        </div>
      ) : (
        <>
          <div className={styles.controls}>
            <button 
              className={styles.analyzeButton}
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.spinner}></span>
                  Analyzing...
                </>
              ) : (
                'Analyze My Moods'
              )}
            </button>
          </div>

          {analysis && (
            <div className={styles.analysisGrid}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Mood Trends</h2>
                <p className={styles.trendText}>{analysis.moodTrend}</p>
              </div>

              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Weekly Statistics</h2>
                <div className={styles.stats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Most Frequent Mood:</span>
                    <span className={styles.statValue}>{analysis.weeklyStats.mostFrequent}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Average Mood:</span>
                    <span className={styles.statValue}>{analysis.weeklyStats.averageMood}</span>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <h2 className={styles.cardTitle}>AI Insights</h2>
                <ul className={styles.insightsList}>
                  {analysis.insights.map((insight, index) => (
                    <li key={index} className={styles.insightItem}>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Recommendations</h2>
                <ul className={styles.recommendationsList}>
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className={styles.recommendationItem}>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
} 