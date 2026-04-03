"use client";

import { motion } from "framer-motion";

export function ContributionGrid() {
  const days = Array.from({ length: 91 }, (_, i) => i); // Last 13 weeks
  
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center justify-between">
         <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Automation Coverage</span>
         <span className="text-xs font-medium text-emerald-400">98% Uptime</span>
      </div>
      
      <div className="grid grid-flow-col grid-rows-7 gap-1.5 p-1">
        {days.map((day) => {
          // Weighted random opacity to look like a real dev profile
          const isActive = day > 10 && day < 80;
          const opacity = isActive 
            ? [0.1, 0.4, 0.7, 1.0][Math.floor(Math.random() * 4)] 
            : 0.05;
          const color = opacity > 0.05 ? "bg-emerald-500" : "bg-white/10";
          
          return (
            <motion.div
              key={day}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: day * 0.005 }}
              className={`w-3 h-3 rounded-sm ${color} transition-all duration-500`}
              style={{ opacity }}
            />
          );
        })}
      </div>
      
      <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
         <span>JAN</span>
         <span>FEB</span>
         <span>MAR</span>
      </div>
    </div>
  );
}
