"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from 'swr';
import { Loader2, CheckCircle2, AlertCircle, Rocket, Shuffle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function SettingsPanel({
  initialStrategy,
  initialTargetRepos
}: {
  initialStrategy: string;
  initialTargetRepos: string;
}) {
  const [strategy, setStrategy] = useState(initialStrategy || "DEDICATED");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const initialReposList = useMemo(() => {
    try {
      return initialTargetRepos ? JSON.parse(initialTargetRepos) : [];
    } catch (e) {
      return [];
    }
  }, [initialTargetRepos]);

  const [selectedRepos, setSelectedRepos] = useState<string[]>(initialReposList);
  const { data, error, isLoading } = useSWR('/api/repos', fetcher);

  const toggleRepo = (repoName: string) => {
    setSelectedRepos(prev =>
      prev.includes(repoName)
        ? prev.filter(r => r !== repoName)
        : [...prev, repoName]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategy,
          targetRepos: JSON.stringify(selectedRepos)
        }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
    setIsSaving(false);
  };

  return (
    <div className="glass rounded-[40px] p-10 h-fit transition-all duration-500 overflow-hidden relative">
      <div className="mb-10">
        <h3 className="text-2xl font-black tracking-tighter mb-2 italic">Operation Hub</h3>
        <p className="text-zinc-500 text-sm font-medium">Select your automation vector below.</p>
      </div>

      <div className="space-y-4">
        <motion.div
          whileHover={{ x: 4 }}
          onClick={() => setStrategy("DEDICATED")}
          className={`p-6 rounded-3xl border cursor-pointer transition-all ${strategy === "DEDICATED"
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${strategy === "DEDICATED" ? 'bg-emerald-500 text-emerald-950 border-emerald-400' : 'bg-white/5 text-zinc-400 border-white/10'
              }`}>
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-black tracking-tight text-white italic">DEDICATED LOGGING</span>
              <span className="text-xs text-zinc-500 font-medium text-balance block mt-1">Automatic maintenance of the `portfolio-core-engine` repository.</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ x: 4 }}
          onClick={() => setStrategy("RANDOM")}
          className={`p-6 rounded-3xl border cursor-pointer transition-all ${strategy === "RANDOM"
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
        >
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${strategy === "RANDOM" ? 'bg-emerald-400 text-emerald-950 border-emerald-300' : 'bg-white/5 text-zinc-400 border-white/10'
              }`}>
              <Shuffle className="w-6 h-6" />
            </div>
            <div>
              <span className="block font-black tracking-tight text-white italic">RANDOM INJECTION</span>
              <span className="text-xs text-zinc-500 font-medium text-balance block mt-1">Sustain activity levels across multiple open-source targets.</span>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {strategy === "RANDOM" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2 p-6 rounded-3xl bg-black/40 border border-white/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Select Vectors</span>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />}
              </div>

              {error ? (
                <div className="flex items-center space-x-2 text-red-500/50 py-4 justify-center">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Network Failure</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-3 custom-scrollbar">
                  {data?.repos?.map((repo: any) => (
                    <div
                      key={repo.id}
                      onClick={() => toggleRepo(repo.name)}
                      className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${selectedRepos.includes(repo.name)
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-white/5 bg-white/5 hover:bg-white/10'
                        }`}
                    >
                      <span className="text-[11px] font-bold text-zinc-400 truncate max-w-[200px]">{repo.name}</span>
                      {selectedRepos.includes(repo.name) && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-6 py-5 bg-white text-black hover:bg-emerald-400 hover:text-white font-black rounded-3xl transition-all duration-300 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] active:scale-[0.98] italic text-lg uppercase tracking-tight"
        >
          {isSaving ? "CONFIGURING..." : "DEPLOY PARAMETERS"}
        </button>
      </div>
    </div>
  );
}
