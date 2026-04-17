"use client";

import useSWR from 'swr';
import { Terminal, ShieldCheck, GitCommit, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function MissionLogs() {
  const { data, error, isLoading } = useSWR('/api/logs', fetcher, { refreshInterval: 5000 });

  if (isLoading) return (
    <div className="flex items-center justify-center p-20">
       <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="glass rounded-[40px] p-8 h-full min-h-[500px] flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black tracking-tighter italic uppercase">Mission Logs</h3>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">Satellite Telemetry Data</p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] font-black italic uppercase text-emerald-400 tracking-tighter">Live Stream</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
        {data?.logs?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
             <Terminal className="w-12 h-12 mb-4" />
             <p className="font-mono text-xs uppercase tracking-widest">Awaiting First Protocol...</p>
          </div>
        ) : (
          data?.logs?.map((log: any, i: number) => {
            const Icon = log.type === 'COMMIT' ? GitCommit : log.type === 'FOLLOW' ? ShieldCheck : Terminal;
            const colorClass = log.status === 'ERROR' ? 'text-red-400' : 'text-emerald-400';
            const borderClass = log.status === 'ERROR' ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/10 bg-emerald-500/5';
            
            return (
              <motion.div 
                key={log.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-2xl border ${borderClass} flex items-start space-x-4`}
              >
                 <div className={`mt-0.5 ${colorClass}`}>
                    {log.status === 'ERROR' ? <AlertTriangle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                       <span className={`text-[10px] font-black italic uppercase tracking-tighter ${colorClass}`}>
                          {log.type} // {log.status}
                       </span>
                       <span className="text-[10px] font-mono text-zinc-600">
                          {new Date(log.createdAt).toLocaleTimeString()}
                       </span>
                    </div>
                    <p className="text-xs font-medium text-zinc-300 leading-tight">
                       {log.message}
                    </p>
                 </div>
              </motion.div>
            );
          })
        )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/5">
         <p className="text-[10px] font-mono text-zinc-600 text-center uppercase tracking-[0.2em]">End of Transmission</p>
      </div>
    </div>
  );
}
