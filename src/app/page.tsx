import { Calendar } from "@/components/Calendar/Calendar";
import { MoodForm } from "@/components/MoodForm/MoodForm";

export default function HomePage() {
  return (
    <main className="container mx-auto p-4">
      <Calendar />
      <MoodForm />
    </main>
  );
}
