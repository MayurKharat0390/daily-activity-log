"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPanel({ 
  initialStrategy,
  initialTargetRepos 
}: { 
  initialStrategy: string;
  initialTargetRepos: string;
}) {
  const [strategy, setStrategy] = useState(initialStrategy || "DEDICATED");
  const [targetRepos, setTargetRepos] = useState(initialTargetRepos || "");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy, targetRepos }),
      });
      if (res.ok) {
        // Handle success (maybe toast)
        router.refresh();
      } else {
        console.error("Failed to save settings");
      }
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  return (
    <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 h-fit">
      <h3 className="text-xl font-semibold mb-6">Automation Strategy</h3>
      
      <div className="space-y-6">
          <label className={`flex items-start space-x-4 p-4 rounded-xl border cursor-pointer transition-colors ${strategy === "DEDICATED" ? 'border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10' : 'border-white/10 hover:bg-white/5'}`}>
            <input 
              type="radio" 
              name="strategy" 
              value="DEDICATED"
              checked={strategy === "DEDICATED"}
              onChange={() => setStrategy("DEDICATED")}
              className="mt-1" 
            />
            <div>
              <span className="block font-medium text-emerald-50">Dedicated Repository</span>
              <span className="text-sm text-zinc-400 text-balance block mt-1">We will create a specific `portfolio-core-engine` repo for you and push there exclusively.</span>
            </div>
          </label>

          <label className={`flex items-start space-x-4 p-4 rounded-xl border cursor-pointer transition-colors ${strategy === "RANDOM" ? 'border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10' : 'border-white/10 hover:bg-white/5'}`}>
            <input 
              type="radio" 
              name="strategy" 
              value="RANDOM"
              checked={strategy === "RANDOM"}
              onChange={() => setStrategy("RANDOM")}
              className="mt-1" 
            />
            <div>
              <span className="block font-medium">Random Repositories</span>
              <span className="text-sm text-zinc-400 text-balance block mt-1">Select from your existing repositories to randomly distribute commits.</span>
            </div>
          </label>
          
          {strategy === "RANDOM" && (
            <div className="mt-4 p-4 rounded-xl border border-white/10">
              <label className="block text-sm font-medium text-emerald-50 mb-2">Target Repositories (comma separated)</label>
              <input 
                type="text" 
                value={targetRepos}
                onChange={(e) => setTargetRepos(e.target.value)}
                placeholder="repo1, repo2, repo3"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          )}

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Parameters"}
          </button>
      </div>
    </div>
  );
}
