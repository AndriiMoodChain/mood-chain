
import { JoyMessage } from "@/components/Main/JoyMessage";
import { TrendCircle } from "@/components/Main/TrendCircle";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center justify-start py-10">
      <div className="relative w-full max-w-lg flex flex-col items-center">      
      <TrendCircle />
      <JoyMessage />              
      </div>
    </main>
  );
}