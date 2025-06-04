"use client";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./PopularMoods.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const moodTypes = ["Happy", "Sad", "Excited", "Calm", "Angry", "Anxious", "Tired"];
const colors = [
  "#FDE68A", "#93C5FD", "#FBCFE8", "#A7F3D0", 
  "#FECACA", "#DDD6FE", "#E5E7EB"
];

export default function PopularMoodsPage() {
  const [moodData, setMoodData] = useState<{mood: string; count: number}[]>([]);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const generateData = () => {
      return moodTypes.map(mood => ({
        mood,
        count: Math.floor(Math.random() * 1000) + 500,
      }));
    };

    setTimeout(() => {
      setMoodData(generateData());
      setIsLoading(false);
    }, 500);
  }, [timeRange]);

  const chartData = {
    labels: moodData.map(item => item.mood),
    datasets: [{
      label: "Mood Count",
      data: moodData.map(item => item.count),
      backgroundColor: colors,
      borderColor: colors.map(color => `${color}80`),
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: `Most Popular Moods (${timeRange})` },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Number of Moods" } },
      x: { title: { display: true, text: "Mood Type" } },
    },
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  const sortedMoods = [...moodData].sort((a, b) => b.count - a.count);
  const topMoods = sortedMoods.slice(0, 3);
  const mostCommonMood = sortedMoods[0]?.mood || "None";
  const totalRecords = moodData.reduce((sum, item) => sum + item.count, 0);
  const peakTime = ["morning", "afternoon", "evening", "night"][Math.floor(Math.random() * 4)];

  return (
    <div className={styles.container}>
      <div className="max-w-6xl mx-auto">
        <h1 className={styles.header}>Community Mood Trends</h1>
        
        <div className={styles.chartContainer}>
          <div className={styles.timeFilters}>
            {(["week", "month", "year"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`${styles.timeButton} ${
                  timeRange === range ? styles.timeButtonActive : styles.timeButtonInactive
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          
          <div className={styles.chartWrapper}>
            <Bar data={chartData} options={options} />
          </div>
        </div>

        <div className={styles.gridContainer}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Top Moods</h2>
            <div>
              {topMoods.map((item) => (
                <div key={item.mood} className={styles.moodItem}>
                  <div 
                    className={styles.moodColor}
                    style={{ backgroundColor: colors[moodTypes.indexOf(item.mood)] }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.mood}</span>
                      <span className="text-gray-600">{item.count.toLocaleString()}</span>
                    </div>
                    <div className={styles.moodBar}>
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${sortedMoods.length > 0 ? (item.count / sortedMoods[0].count) * 100 : 0}%`,
                          backgroundColor: colors[moodTypes.indexOf(item.mood)]
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Mood Insights</h2>
            <div>
              <div className={styles.insightItem}>
                <h3 className={styles.insightTitle}>Most Common</h3>
                <p className={styles.insightValue}>
                  {mostCommonMood} mood is trending this {timeRange}
                </p>
              </div>
              <div className={styles.insightItem}>
                <h3 className={styles.insightTitle}>Total Records</h3>
                <p className={styles.insightValue}>
                  {totalRecords.toLocaleString()} moods recorded
                </p>
              </div>
              <div className={styles.insightItem}>
                <h3 className={styles.insightTitle}>Peak Time</h3>
                <p className={styles.insightValue}>
                  {peakTime} is when most moods are recorded
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}