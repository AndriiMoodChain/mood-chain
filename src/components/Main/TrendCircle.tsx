"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const trends = [
    "rizz", "skibidi", "sigma grindset", "corecore", "NPC livestream",
    "based", "slay", "🧠💥", "💀", "gyatt", "silent rizz", "goofy ahh"
];

export const TrendCircle = () => {
    const [rotating, setRotating] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotating((prev) => prev + 0.5);
        }, 30);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative h-[300px] w-full flex items-center justify-center overflow-hidden">
            <div className=" animate-spin-slow">
                {trends.map((trend, i) => {
                    const angle = (360 / trends.length) * i + rotating;
                    const x = 120 * Math.cos((angle * Math.PI) / 180);
                    const y = 120 * Math.sin((angle * Math.PI) / 180);

                    return (
                        <motion.div
                            key={trend}
                            className="absolute text-sm sm:text-md text-gray-500 animate-pulse"
                            style={{
                                transform: `translate(${x}px, ${y}px)`
                            }}
                        >
                            {trend}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
