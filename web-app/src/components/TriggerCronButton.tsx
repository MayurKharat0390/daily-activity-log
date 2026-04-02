"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function TriggerCronButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleTrigger() {
    setLoading(true);
    setResult(null);
    setError("");
    
    try {
      // Calling our CRON endpoint manually
      const res = await fetch("/api/cron");
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to trigger cron");
      
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 pt-8 border-t border-white/5">
      <button 
        onClick={handleTrigger}
        disabled={loading}
        className="flex items-center space-x-2 text-sm text-zinc-500 hover:text-emerald-400 transition-colors disabled:opacity-50"
      >
        <Play className="w-4 h-4" />
        <span>{loading ? "Processing Automation..." : "Test Automation (Trigger Daily Push)"}</span>
      </button>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      
      {result && result.success && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs font-mono overflow-auto max-h-40">
           <p className="text-emerald-400 mb-2">✓ Success: Processed {result.processed} accounts</p>
           {result.results.map((r: any, i: number) => (
             <div key={i} className="mb-1 text-zinc-400">
               {r.user}: {r.status} {r.strategy} {r.target ? `-> ${r.target}` : ""}
               {r.error && <span className="text-red-500"> ({r.error})</span>}
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
