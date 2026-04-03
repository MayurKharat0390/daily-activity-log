"use client";

import { useState } from "react";
import { Loader2, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TriggerCronButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleTrigger = async () => {
    setIsLoading(true);
    setStatus("idle");
    try {
      const res = await fetch("/api/cron");
      if (res.ok) {
        setStatus("success");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full relative group">
      <AnimatePresence>
        {status === "success" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-emerald-500 text-emerald-950 font-black italic px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase shadow-[0_0_40px_rgba(16,185,129,0.5)] z-20"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Deployment Successful</span>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleTrigger}
        disabled={isLoading}
        className={`w-full py-5 rounded-3xl font-black italic uppercase tracking-tighter text-lg transition-all duration-500 flex items-center justify-center space-x-3 border-2 ${
          status === "success" 
            ? "bg-emerald-500 border-emerald-400 text-emerald-950 scale-[1.02]" 
            : status === "error"
            ? "bg-red-500/20 border-red-500/50 text-red-500"
            : "bg-white/5 border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-zinc-300 hover:text-emerald-400"
        } disabled:opacity-50`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Initiating Protocol...</span>
          </>
        ) : (
          <>
            <Play className={`w-5 h-5 fill-current transition-transform duration-300 ${status === 'idle' ? 'group-hover:scale-125' : ''}`} />
            <span>{status === "success" ? "System Verified" : status === "error" ? "Failure Detected" : "Trigger Manual Injection"}</span>
          </>
        )}
      </button>
    </div>
  );
}
