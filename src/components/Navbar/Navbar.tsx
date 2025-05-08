import Link from 'next/link';
import ConnectionWallet from '../Chain/Solana/ConnectionWallet';

export default function Navbar() {
  return (
    <nav className="bg-transparent backdrop-blur-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-black font-bold text-xl">MoodChain</div>
        <div className="space-x-4">
          <Link
            href="/"
            className="text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md transition"
          >
            Головна
          </Link>
          <Link
            href="/cabinet"
            className="text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md transition"
          >
            Створити
          </Link>
          <ConnectionWallet/>
        </div>
      </div>
    </nav>
  );
}