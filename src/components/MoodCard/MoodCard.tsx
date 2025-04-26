"use client";

import { MoodEntry } from "../../types/mood";

interface MoodCardProps {
  mood: MoodEntry;
}

export const MoodCard: React.FC<MoodCardProps> = ({ mood }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm mb-4">
      <div className="text-lg font-semibold">{mood.mood.toUpperCase()}</div>
      <div className="text-sm text-gray-500">{new Date(mood.date).toLocaleDateString()}</div>
      {mood.description && <p className="mt-2">{mood.description}</p>}
      {mood.nftMinted && <span className="text-green-500 text-xs mt-2 block">NFT створено ✅</span>}
    </div>
  );
};
