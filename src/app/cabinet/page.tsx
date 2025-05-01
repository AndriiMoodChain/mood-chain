"use client";

import { useState } from "react";
import { MoodType, MoodEntry } from "@/types/mood";


const dummyMoods: MoodEntry[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    mood: "happy" as MoodType,
    description: "Чудовий день!",
    nftMinted: false,
  },
];

const initialSingleMood: MoodEntry = {
  id: "2",
  date: new Date().toISOString(),
  mood: "excited" as MoodType,
  description: "Отримав NFT за настрій!",
  nftMinted: true,
};

export default function CabinetPage() {
  const [mood, setMood] = useState<MoodType>("happy");
  const [description, setDescription] = useState("");
  const [moods, setMoods] = useState<MoodEntry[]>(dummyMoods);
  const [singleMood, setSingleMood] = useState<MoodEntry>(initialSingleMood); 

  const handleMoodSubmit = (newMood: MoodType, newDescription?: string) => {
    console.log("Новий настрій:", newMood, newDescription);
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: newMood,
      description: newDescription,
      nftMinted: false, 
    };
    setMoods([...moods, newEntry]);
    setSingleMood(newEntry); 
    setMood("happy");
    setDescription("");
  };

  const moodColors: { [key in MoodType]: string } = {
    happy: 'bg-yellow-200 text-yellow-800',
    sad: 'bg-blue-200 text-blue-800',
    angry: 'bg-red-200 text-red-800',
    anxious: 'bg-purple-200 text-purple-800',
    calm: 'bg-green-200 text-green-800',
    excited: 'bg-orange-200 text-orange-800',
    tired: 'bg-gray-200 text-gray-800',
  };

  const moodColorClass = moodColors[singleMood.mood] || 'bg-gray-100 text-gray-700';

  return (
    <main className="container mx-auto p-6 md:p-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Mood Diary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   
          <div className="rounded-lg shadow-md p-6 bg-white mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">How are you feeling today?</h2>
            <div className="mb-4">
              <label htmlFor="mood" className="block text-gray-700 text-sm font-bold mb-2">Mood:</label>
              <select
                id="mood"
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300"
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
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (optional):</label>
              <textarea
                id="description"
                className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-300"
                placeholder="Add a comment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              onClick={() => handleMoodSubmit(mood, description)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Save Mood
            </button>
          </div>

         
          <div className="rounded-lg shadow-sm p-6 bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Mood</h2>
            <div className={`border rounded-lg shadow-sm p-4 mb-4 ${moodColorClass}`}>
              <div className="text-lg font-semibold">{singleMood.mood.toUpperCase()}</div>
              <div className="text-sm text-gray-600">{new Date(singleMood.date).toLocaleDateString()}</div>
              {singleMood.description && <p className="mt-2 text-gray-700">{singleMood.description}</p>}
              {singleMood.nftMinted && <span className="text-green-600 text-xs mt-2 block">NFT Minted ✅</span>}
            </div>
          </div>
        
      </div>
    </main>
  );
}