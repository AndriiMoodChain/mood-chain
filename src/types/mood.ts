export type MoodType = "happy" | "sad" | "angry" | "anxious" | "calm" | "excited" | "tired";

export interface MoodEntry {
  id: string;            
  date: string;          
  mood: MoodType;        
  description?: string;  
  nftMinted?: boolean;   
  image?: string;
}
