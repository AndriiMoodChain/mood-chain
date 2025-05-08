import type { Metadata } from "next";
import "./globals.css";
import Image from 'next/image';
import backgroundImage from '../../public/background.png';
import { SolanaProvider } from "@/components/Chain/Solana/SolanaProvider";
import Navbar from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: 'MoodChain',
  description: 'Track and share your joy!'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative h-full">
        <div className="fixed inset-0 -z-10">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <SolanaProvider><Navbar/>{children}</SolanaProvider>        
      </body>
    </html>
  );
}
