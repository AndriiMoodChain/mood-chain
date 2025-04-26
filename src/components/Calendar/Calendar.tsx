"use client";

import { MoodEntry } from "../../types/mood";

interface CalendarProps {
  moods: MoodEntry[];
}

export const Calendar: React.FC<CalendarProps> = ({ moods }) => {
  return (
    <div className="rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Календар настроїв</h2>
     
      <div className="text-gray-500">[Календар тут]</div>
    </div>
  );
};
