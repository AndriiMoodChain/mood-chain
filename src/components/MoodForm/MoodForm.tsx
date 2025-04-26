"use client";

import { useState } from "react";
import { MoodType } from "../../types/mood";

interface MoodFormProps {
  onSubmit: (mood: MoodType, description?: string) => void;
}

export const MoodForm: React.FC<MoodFormProps> = ({ onSubmit }) => {
  const [mood, setMood] = useState<MoodType>("happy");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    onSubmit(mood, description);
    setMood("happy");
    setDescription("");
  };

  return (
    <div className="rounded-lg shadow-md p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Додати настрій</h2>

    
      <select
        className="w-full p-2 border rounded mb-4"
        value={mood}
        onChange={(e) => setMood(e.target.value as MoodType)}
      >
        <option value="happy">😊 Радість</option>
        <option value="sad">😢 Смуток</option>
        <option value="angry">😡 Злість</option>
        <option value="anxious">😰 Тривога</option>
        <option value="calm">😌 Спокій</option>
        <option value="excited">🤩 Захоплення</option>
        <option value="tired">😴 Втома</option>
      </select>

    
      <textarea
        className="w-full p-2 border rounded mb-4"
        placeholder="Коментар (опціонально)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

     
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Зберегти
      </button>
    </div>
  );
};
