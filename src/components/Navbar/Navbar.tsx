'use client'
import Link from 'next/link';
import ConnectionWallet from '../Chain/Solana/ConnectionWallet';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-transparent backdrop-blur-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-black font-bold text-xl hover:opacity-80 transition-opacity">
            MoodChain
          </Link>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/trends"
              className="text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md transition"
            >
              Trends
            </Link>
            <Link
              href="/cabinet"
              className="text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md transition"
            >
              Create
            </Link>
            <ConnectionWallet/>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link
              href="/trends"
              className="block text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Trends
            </Link>
            <Link
              href="/cabinet"
              className="block text-gray-700 hover:bg-gray-200 hover:text-black px-3 py-2 rounded-md transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Create
            </Link>
            <div className="px-3 py-2">
              <ConnectionWallet/>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}