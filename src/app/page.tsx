import { JoyMessage } from "@/components/Main/JoyMessage";
import { TrendCircle } from "@/components/Main/TrendCircle";

export default function HomePage() {
  return (
    <main className="w-full">         
        <JoyMessage />    
        <TrendCircle />                
    </main>
  );
}
