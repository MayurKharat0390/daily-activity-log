"use client";

import { motion } from "framer-motion";
import { Lock, Shuffle, Code2, LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  delay: number;
}

const features: Feature[] = [
  {
    title: "Secure by Design",
    description: "No raw access tokens needed. Uses official GitHub OAuth with limited granular scopes.",
    icon: Lock,
    delay: 0.1
  },
  {
    title: "Random or Fixed",
    description: "Target a specific `daily-streak` repo, or inject automated commits into your existing random repositories.",
    icon: Shuffle,
    delay: 0.2
  },
  {
    title: "Set and Forget",
    description: "Log in once, define your parameters, and let our daily automation worker maintain your continuous streak.",
    icon: Code2,
    delay: 0.3
  }
];

export function LandingFeatures() {
  return (
    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-20">
      {features.map((f) => (
        <motion.div 
          key={f.title}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: f.delay, duration: 0.8, ease: "easeOut" }}
          className="group space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/20 transition-all duration-300"
        >
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-transform duration-300">
            <f.icon className="w-7 h-7" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-tight">{f.title}</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">{f.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
