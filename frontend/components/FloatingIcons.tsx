"use client";

import { motion } from "framer-motion";
import { Mail, Shield, Zap, Search, Code, Globe, Cpu, Database, Layers, MousePointer2, Sparkles } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const icons = [
  { Icon: Mail, x: "-42vw", y: "-35vh", color: "text-blue-500/30", scale: 1.2, delay: 0 },
  { Icon: Shield, x: "40vw", y: "-25vh", color: "text-indigo-500/30", scale: 1, delay: 2 },
  { Icon: Zap, x: "-35vw", y: "40vh", color: "text-purple-500/30", scale: 0.8, delay: 4 },
  { Icon: Search, x: "42vw", y: "30vh", color: "text-slate-400/30", scale: 1.1, delay: 1 },
  { Icon: Code, x: "32vw", y: "60vh", color: "text-primary/20", scale: 0.9, delay: 3 },
  { Icon: Globe, x: "-45vw", y: "-5vh", color: "text-accent/20", scale: 1.3, delay: 5 },
  { Icon: Cpu, x: "-38vw", y: "-20vh", color: "text-sky-500/20", scale: 1.1, delay: 3 },
  { Icon: Database, x: "35vw", y: "10vh", color: "text-indigo-400/20", scale: 0.9, delay: 6 },
  { Icon: Layers, x: "-40vw", y: "20vh", color: "text-violet-400/20", scale: 1.2, delay: 2 },
  { Icon: MousePointer2, x: "45vw", y: "-40vh", color: "text-blue-400/20", scale: 1, delay: 7 },
  { Icon: Sparkles, x: "-30vw", y: "65vh", color: "text-amber-400/20", scale: 1.1, delay: 4 },
  { Icon: Code, x: "28vw", y: "-45vh", color: "text-emerald-400/20", scale: 0.8, delay: 8 },
];

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.4, 0.2, 0],
            scale: [0.8, item.scale, 0.8],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: item.delay,
          }}
          className={cn("absolute", item.color)}
          style={{ 
            left: `calc(50% + ${item.x})`,
            top: `calc(50% + ${item.y})`
          }}
        >
          <item.Icon size={56} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}
