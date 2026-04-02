"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useSWR from 'swr';
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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

  // Parse initial selected repos
  const initialReposList = useMemo(() => {
    try {
      return initialTargetRepos ? JSON.parse(initialTargetRepos) : [];
    } catch (e) {
      return [];
    }
  }, [initialTargetRepos]);

  const [selectedRepos, setSelectedRepos] = useState<string[]>(initialReposList);

  // Fetch repositories from our API
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
          targetRepos: selectedRepos.join(',') 
        }),
      });
      if (res.ok) {
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
      <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
        <span>Automation Strategy</span>
      </h3>
      
      <div className="space-y-6">
          {/* Dedicated Strategy */}
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
              <span className="block font-medium text-emerald-50 text-base">Professional Dedicated Project</span>
              <span className="text-sm text-zinc-400 text-balance block mt-1">We'll create and maintain `portfolio-core-engine` with developer-level commit history.</span>
            </div>
          </label>

          {/* Random Strategy */}
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
              <span className="block font-medium text-base">Dynamic Random Injection</span>
              <span className="text-sm text-zinc-400 text-balance block mt-1">Distribute daily activity across your existing repositories. </span>
            </div>
          </label>
          
          {/* Repo Picker (only if RANDOM selected) */}
          {strategy === "RANDOM" && (
            <div className="mt-4 p-4 rounded-xl border border-white/10 bg-black/20">
              <label className="block text-sm font-medium text-emerald-50 mb-4">Select Target Repositories</label>
              
              {isLoading && (
                <div className="flex items-center space-x-2 text-zinc-500 py-4 justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Fetching your repositories...</span>
                </div>
              )}

              {error && (
                <div className="flex items-center space-x-2 text-red-400 py-4 justify-center">
                   <AlertCircle className="w-5 h-5" />
                   <span className="text-sm font-medium">Failed to load repositories.</span>
                </div>
              )}

              {data && data.repos && (
                <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                  {data.repos.map((repo: any) => (
                    <div 
                      key={repo.id}
                      onClick={() => toggleRepo(repo.name)}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedRepos.includes(repo.name) 
                        ? 'border-emerald-500/50 bg-emerald-500/10' 
                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-medium truncate max-w-[200px]">{repo.name}</span>
                      {selectedRepos.includes(repo.name) && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  ))}
                  {data.repos.length === 0 && (
                     <p className="text-sm text-zinc-500 text-center py-4">No public repositories found.</p>
                  )}
                </div>
              )}

              <p className="mt-4 text-xs text-zinc-500">
                Selected: <span className="text-emerald-400 font-medium">{selectedRepos.length}</span>
              </p>
            </div>
          )}

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-4 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] disabled:opacity-50"
          >
            {isSaving ? "Applying Configuration..." : "Save Automation Parameters"}
          </button>
      </div>
    </div>
  );
}
