import { auth, signIn, signOut } from "../../auth"
import { GitBranch as Github, TrendingUp, ChevronRight } from "lucide-react"
import SettingsPanel from "../components/SettingsPanel"
import { TriggerCronButton } from "../components/TriggerCronButton"
import { ContributionGrid } from "../components/ContributionGrid"
import { LandingFeatures } from "../components/LandingFeatures"
import { AchievementLab } from "../components/AchievementLab"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 relative font-sans">
      {/* Background Enhancements */}
      <div className="mesh-bg opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        {!session ? (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl relative">
              <div className="mb-8 inline-flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm text-emerald-400 backdrop-blur-xl animate-fade-in">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="font-medium tracking-wide">Automating 4,200+ daily commits</span>
              </div>
              
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-10 bg-gradient-to-br from-white via-zinc-400 to-emerald-500 bg-clip-text text-transparent animate-text-gradient">
                Unbreakable <br/>Green Squares.
              </h1>
              
              <p className="text-xl text-zinc-400 mb-14 max-w-3xl leading-relaxed font-medium">
                The most sophisticated GitHub streak automation engine. 
                <span className="text-white"> Maintain perfection effortlessly </span> 
                with dedicated repo logging or random activity distribution.
              </p>

              <form
                className="relative z-20 group"
                action={async () => {
                  "use server"
                  await signIn("github")
                }}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-white opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300" />
                <button
                  type="submit"
                  className="relative px-10 py-5 bg-white text-black font-bold text-lg rounded-2xl flex items-center space-x-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <Github className="w-6 h-6 stroke-[2.5]" />
                  <span>Start Automating Today</span>
                  <ChevronRight className="w-5 h-5 ml-2 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <LandingFeatures />
            </div>
          ) : (
            <div className="w-full max-w-6xl mt-6 animate-fade-in animate-duration-1000">
              <header className="flex flex-col md:flex-row items-center justify-between mb-12 p-8 glass rounded-[40px] gap-8">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img 
                      src={session?.user?.image || ""} 
                      alt="Avatar" 
                      className="w-16 h-16 rounded-3xl object-cover ring-2 ring-emerald-500/20 shadow-2xl" 
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-black rounded-full" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">System Operator: {session?.user?.name}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-widest border border-emerald-500/10">
                        { (session?.user as any)?.githubUsername || "AUTHENTICATED" }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <form
                    action={async () => {
                      "use server"
                      await signOut()
                    }}
                  >
                    <button type="submit" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-2xl font-semibold border border-white/5 transition-all text-sm">
                      Logout Session
                    </button>
                  </form>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
                {/* Automation Logic Card */}
                <div className="space-y-8">
                  <SettingsPanel 
                    initialStrategy={(session?.user as any)?.streakTarget || "DEDICATED"}
                    initialTargetRepos={(session?.user as any)?.targetRepos || ""}
                  />
                  
                  <AchievementLab />
                  
                  <div className="glass rounded-[40px] p-10 overflow-hidden relative group">
                    <ContributionGrid />
                  </div>
                </div>

                 {/* Status / Activity Panel */}
                 <div className="glass rounded-[40px] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden h-full min-h-[500px]">
                    <div className="absolute top-0 right-0 p-10">
                       <div className="flex flex-col items-end">
                          <span className="text-zinc-600 text-xs font-mono tracking-widest uppercase mb-1">STREAK HEALTH</span>
                          <span className="text-emerald-400 text-5xl font-black italic tracking-tighter drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                            {(session?.user as any)?.streakCount || 0}d
                          </span>
                       </div>
                    </div>

                    <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(16,185,129,0.3)] animate-pulse">
                      <TrendingUp className="w-12 h-12 stroke-[3]" />
                    </div>
                    
                    <h2 className="text-3xl font-black mb-4 tracking-tighter">Engine Online</h2>
                    <p className="text-zinc-400 max-w-[280px] mb-12 leading-relaxed text-sm font-medium">
                      { (session?.user as any)?.lastRunAt 
                        ? `Last successful injection was today at ${new Date((session?.user as any)?.lastRunAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : "Ready for automated deployment. Our global cron will ensure your github graph stays green." 
                      }
                    </p>
                    
                    <div className="w-full max-w-sm mt-auto">
                       <div className="p-1 rounded-[24px] bg-emerald-500/5 border border-emerald-500/10">
                         <TriggerCronButton />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
      </main>
    </div>
  )
}
