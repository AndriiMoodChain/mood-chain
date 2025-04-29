"use client"
import { Calendar } from "@/components/Calendar/Calendar";
import { MoodCard } from "@/components/MoodCard/MoodCard";
import { MoodForm } from "@/components/MoodForm/MoodForm";
import { MoodType } from "@/types/mood";

const dummyMoods = [
  {
    id: "1",
    date: new Date().toISOString(),
    mood: "happy" as MoodType,
    description: "Чудовий день!",
    nftMinted: false,
  },
];

const singleMood = {
  id: "2",
  date: new Date().toISOString(),
  mood: "excited" as MoodType,
  description: "Отримав NFT за настрій!",
  nftMinted: true,
};

export default function Cabinet() {
  const handleMoodSubmit = (mood: MoodType, description?: string) => {
    console.log("Новий настрій:", mood, description);
  };

  return (
    <main className="container mx-auto p-4">
      <Calendar moods={dummyMoods} />
      <MoodForm onSubmit={handleMoodSubmit} />
      <MoodCard mood={singleMood} />
    </main>
  );
}
