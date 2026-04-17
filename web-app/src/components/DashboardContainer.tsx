"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import SettingsPanel from "./SettingsPanel";
import { AchievementLab } from "./AchievementLab";
import { ContributionGrid } from "./ContributionGrid";
import { TriggerCronButton } from "./TriggerCronButton";
import { MissionLogs } from "./MissionLogs";
import { 
    BarChart3, 
    Settings2, 
    Sparkles, 
    Terminal,
    LogOut, 
    Menu, 
    X, 
    User,
    Activity,
    GitBranch as GithubIcon
} from "lucide-react";

export default function DashboardContainer({ session }: { session: any }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const tabs = [
        { id: "overview", label: "System Overview", icon: BarChart3 },
        { id: "logs", label: "Mission Logs", icon: Terminal },
        { id: "configure", label: "Automation Hub", icon: Settings2 },
        { id: "badges", label: "Achievement Lab", icon: Sparkles },
    ];

    const variants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
    };

    return (
        <div className="flex min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <aside
                className={`${isSidebarOpen ? "w-80" : "w-24"
                    } transition-all duration-500 border-r border-white/5 glass flex flex-col z-50`}
            >
                <div className="p-8 flex items-center space-x-4 border-b border-white/5">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <Activity className="w-6 h-6 text-black stroke-[3]" />
                    </div>
                    {isSidebarOpen && <span className="text-xl font-black tracking-tighter italic uppercase">Streak Engine</span>}
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? "animate-pulse" : ""}`} />
                            {isSidebarOpen && <span className="font-black italic uppercase tracking-tight text-sm">{tab.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={() => signOut()}
                        className="w-full flex items-center space-x-4 p-4 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all group"
                    >
                        <LogOut className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        {isSidebarOpen && <span className="font-black italic uppercase tracking-tight text-sm">Terminate Session</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-y-auto custom-scrollbar">
                <div className="mesh-bg opacity-30 fixed inset-0 pointer-events-none" />

                {/* Header */}
                <header className="sticky top-0 z-40 p-8 flex items-center justify-between backdrop-blur-xl border-b border-white/5 glass-top">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <Menu className="w-5 h-5 text-zinc-400" />
                        </button>
                        <div className="hidden md:block">
                            <h2 className="text-sm font-black italic uppercase tracking-widest text-zinc-500">
                                Current Protocol: <span className="text-white">Active Deployment</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 bg-white/5 px-6 py-2 rounded-2xl border border-white/10">
                        <div className="text-right">
                            <p className="text-xs font-black italic uppercase text-zinc-500">Identity</p>
                            <p className="text-sm font-bold tracking-tight">{session?.user?.name}</p>
                        </div>
                        <img src={session?.user?.image} alt="" className="w-10 h-10 rounded-xl ring-2 ring-emerald-500/20" />
                    </div>
                </header>

                {/* Tab Content */}
                <div className="p-12 relative">
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div key="overview" {...variants} className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                                <div className="space-y-8">
                                    <div className="glass rounded-[40px] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden h-[300px]">
                                        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                                            <Activity className="w-10 h-10 stroke-[3]" />
                                        </div>
                                        <h3 className="text-3xl font-black italic uppercase italic tracking-tighter mb-4">Core Engine Status</h3>
                                        <p className="text-zinc-500 max-w-sm font-medium">Monitoring GitHub activity vectors for persistent green square synchronization.</p>
                                    </div>

                                    <div className="glass rounded-[40px] p-10 overflow-hidden">
                                        <ContributionGrid />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="glass rounded-[40px] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
                                        <div className="absolute top-0 right-0 p-10">
                                            <div className="flex flex-col items-end">
                                                <span className="text-zinc-600 text-[10px] font-mono tracking-widest uppercase mb-1">STREAK HEALTH</span>
                                                <span className="text-emerald-400 text-6xl font-black italic tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                                                    {(session?.user as any)?.streakCount || 0}d
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-8 w-full">
                                            <TriggerCronButton />
                                        </div>
                                        <div className="mt-6 text-[11px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-center space-x-2">
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                            <span>System synchronized</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "logs" && (
                            <motion.div key="logs" {...variants} className="max-w-4xl h-full">
                                <MissionLogs />
                            </motion.div>
                        )}

                        {activeTab === "configure" && (
                            <motion.div key="configure" {...variants} className="max-w-3xl">
                                <SettingsPanel
                                    initialStrategy={(session?.user as any)?.streakTarget || "DEDICATED"}
                                    initialTargetRepos={(session?.user as any)?.targetRepos || ""}
                                />
                            </motion.div>
                        )}

                        {activeTab === "badges" && (
                            <motion.div key="badges" {...variants} className="max-w-6xl">
                                <AchievementLab />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
