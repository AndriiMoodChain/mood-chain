"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const trends = [
  "rizz", "skibidi", "sigma grindset", "corecore", "NPC livestream",
  "based", "slay", "🧠💥", "💀", "gyatt", "silent rizz", "goofy ahh",
  "rizz", "skibidi", "sigma grindset", "corecore", "NPC livestream",
  "based", "slay", "🧠💥", "💀", "gyatt", "silent rizz", "goofy ahh",
];

export const TrendCircle = () => {
  const [scrollX, setScrollX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += 1;
        setScrollX(containerRef.current.scrollLeft);
        if (containerRef.current.scrollLeft > containerRef.current.scrollWidth - containerRef.current.clientWidth) {
          containerRef.current.scrollLeft = 0;
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden mb-4 sm:mb-6 px-2 sm:px-0"> 
      <div
        ref={containerRef}
        className="flex space-x-4 sm:space-x-6 px-4 sm:px-6 py-2 sm:py-3 overflow-x-auto rounded-full items-center" 
        style={{
          background: 'rgba(255, 255, 255, 0.25)', 
          backdropFilter: 'blur(10px)',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {trends.map((trend, index) => (
          <motion.span
            key={index}
            className="text-xs sm:text-sm md:text-md text-[#52525B] whitespace-nowrap font-medium" 
            whileHover={{ scale: 1.1 }}
          >
            {trend}
          </motion.span>
        ))}
        
        <span className="text-yellow-300 ml-1 sm:ml-2">*</span>
      </div>
    </div>
  );
};