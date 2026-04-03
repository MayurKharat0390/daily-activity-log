"use client";

import { useState } from "react";
import { Sparkles, Fish, Users, Rocket, Zap, Loader2 } from "lucide-react";

export function AchievementLab() {
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const unlockBadge = async (type: "SHARK" | "PAIR" | "QUICK" | "YOLO") => {
    setLoading(type);
    try {
      const res = await fetch("/api/badges/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        setSuccess(type);
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(null);
  };

  const BadgeItem = ({ type, title, desc, icon: Icon, colorClass, btnText }: any) => (
    <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all flex flex-col items-center text-center">
       <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center mb-4 group shadow-[0_0_20px_rgba(16,185,129,0.05)]`}>
          <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
       </div>
       <h4 className="text-sm font-black tracking-tight uppercase italic">{title}</h4>
       <p className="text-[10px] text-zinc-500 mt-2 mb-6 leading-relaxed max-w-[160px] font-medium">{desc}</p>
       
       <button 
         onClick={() => unlockBadge(type)}
         disabled={loading !== null}
         className={`w-full py-4 ${type === 'YOLO' ? 'bg-white text-black' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'} font-black italic rounded-2xl text-[10px] uppercase tracking-widest transition-all disabled:opacity-50`}
       >
         {loading === type ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : success === type ? "SUCCESS" : btnText}
       </button>
    </div>
  );

  return (
    <div className="glass rounded-[40px] p-10 h-fit mt-8 relative overflow-hidden transition-all duration-700">
      <div className="absolute top-0 right-0 p-8 opacity-5">
         <Sparkles className="w-32 h-32 text-emerald-400" />
      </div>
      
      <div className="mb-10">
        <h3 className="text-2xl font-black tracking-tighter mb-2 italic uppercase">Badge Expedition</h3>
        <p className="text-zinc-500 text-sm font-medium">Programmatic fulfillment of specialized GitHub achievement vectors.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BadgeItem 
          type="SHARK" 
          title="Pull Shark" 
          desc="Automated PR lifecycle fulfillment for merged contribution stats."
          icon={Fish}
          colorClass="bg-emerald-500/10 text-emerald-400"
          btnText="Initiate"
        />
        <BadgeItem 
          type="PAIR" 
          title="Pair Programmer" 
          desc="Collaborative attribution with co-authored commit signatures."
          icon={Users}
          colorClass="bg-emerald-500/10 text-emerald-400"
          btnText="Engage"
        />
        <BadgeItem 
          type="QUICK" 
          title="Quick Draw" 
          desc="Record-speed issue resolution for high-velocity response stats."
          icon={Zap}
          colorClass="bg-emerald-500/10 text-emerald-400"
          btnText="Deploy"
        />
        <BadgeItem 
          type="YOLO" 
          title="YOLO" 
          desc="Direct branch merge protocol bypassing external review gates."
          icon={Rocket}
          colorClass="bg-emerald-500/10 text-emerald-400"
          btnText="Launch"
        />
      </div>
    </div>
  );
}
