import { JoyMessage } from "@/components/Main/JoyMessage";
import { TrendCircle } from "@/components/Main/TrendCircle";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-start">
      <TrendCircle />
      <JoyMessage />
    </main>
  );
}
