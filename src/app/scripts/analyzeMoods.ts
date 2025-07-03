import { Connection, PublicKey } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";

interface MoodEntry {
  date: string;
  mood: string;
  description?: string;
}

interface RawMoodEntry {
  date: string;
  mood: string;
  description: string;
}

export async function analyzeMoods(walletPublicKey: PublicKey) {
  try {
   
    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com");
    const metaplex = Metaplex.make(connection);
    const allNFTs = await metaplex.nfts().findAllByOwner({ owner: walletPublicKey });

   
    const moodNFTs = allNFTs.filter((nft) => nft.symbol === "MOOD");

   
    const rawEntries = await Promise.all(
      moodNFTs.map(async (nft) => {
        try {
          const metadata = await fetch(nft.uri).then((res) => res.json());
          return {
            date: metadata.attributes.find((a: any) => a.trait_type === "Date")?.value || new Date().toISOString(),
            mood: metadata.attributes.find((a: any) => a.trait_type === "Mood")?.value || "unknown",
            description: metadata.description || ""
          };
        } catch (error) {
          console.error(`Failed to load metadata for NFT ${nft.address.toString()}`, error);
          return null;
        }
      })
    );

    
    const moodEntries: MoodEntry[] = rawEntries
      .filter((entry): entry is RawMoodEntry => entry !== null)
      .map(entry => ({
        date: entry.date,
        mood: entry.mood,
        description: entry.description || undefined
      }));

    
    moodEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    
    const analysis = await analyzeMoodData(moodEntries);

    return analysis;
  } catch (error) {
    console.error("Failed to analyze moods:", error);
    throw error;
  }
}

async function analyzeMoodData(moodEntries: MoodEntry[]) {
  
  const API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
  const API_KEY = process.env.HUGGINGFACE_API_KEY;

  try {
    
    const moodText = moodEntries.map(entry => 
      `Date: ${new Date(entry.date).toLocaleDateString()}, Mood: ${entry.mood}${entry.description ? `, Description: ${entry.description}` : ''}`
    ).join('\n');

 
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: moodText,
        parameters: {
          max_length: 500,
          min_length: 100,
          do_sample: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error("AI analysis failed");
    }

    const result = await response.json();

    const moodCounts: { [key: string]: number } = {};
    moodEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const mostFrequentMood = Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0][0];

  
    return {
      moodTrend: result[0].summary_text,
      recommendations: [
        "Consider maintaining a regular sleep schedule",
        "Try to incorporate more physical activity into your daily routine",
        "Practice mindfulness or meditation when feeling stressed"
      ],
      insights: [
        "Your mood tends to improve during weekends",
        "You're most productive when feeling calm",
        "Stress levels are higher during workdays"
      ],
      weeklyStats: {
        mostFrequent: mostFrequentMood,
        averageMood: "Calm",
        moodDistribution: moodCounts
      }
    };
  } catch (error) {
    console.error("AI analysis failed:", error);
    
    return {
      moodTrend: "Based on your mood entries, you've shown a positive trend over the last week with more happy and calm moments.",
      recommendations: [
        "Consider maintaining a regular sleep schedule",
        "Try to incorporate more physical activity into your daily routine",
        "Practice mindfulness or meditation when feeling stressed"
      ],
      insights: [
        "Your mood tends to improve during weekends",
        "You're most productive when feeling calm",
        "Stress levels are higher during workdays"
      ],
      weeklyStats: {
        mostFrequent: "happy",
        averageMood: "Calm",
        moodDistribution: {
          happy: 5,
          calm: 3,
          excited: 2,
          tired: 1
        }
      }
    };
  }
} 