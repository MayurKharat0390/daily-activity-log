import { auth, signIn, signOut } from "../../auth"
import { GitBranch as Github, TrendingUp, Shuffle, Code2, Lock } from "lucide-react"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-emerald-500/30 font-sans">
      <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center">
        {!session ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-3xl">
              <div className="mb-6 inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>Keep your GitHub streak alive</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-white via-emerald-100 to-emerald-400 bg-clip-text text-transparent">
                Never lose a single green square again.
              </h1>
              
              <p className="text-xl text-zinc-400 mb-12 max-w-2xl leading-relaxed">
                Connect your account securely. Choose to automate updates to a single dedicated repository or sprinkle activity across all your open-source work. 100% automated daily.
              </p>

              <form
                action={async () => {
                  "use server"
                  await signIn("github")
                }}
              >
                <button
                  type="submit"
                  className="group relative inline-flex items-center space-x-3 px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-emerald-400 hover:text-white transition-all duration-300 ease-out shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(52,211,153,0.4)]"
                >
                  <Github className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>Authenticate with GitHub</span>
                </button>
              </form>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-16">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-emerald-400">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Secure by Design</h3>
                  <p className="text-zinc-500">No raw access tokens needed. Uses official GitHub OAuth with limited granular scopes.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-emerald-400">
                    <Shuffle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Random or Fixed</h3>
                  <p className="text-zinc-500">Target a specific `daily-streak` repo, or inject automated commits into your existing random repositories.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-emerald-400">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Set and Forget</h3>
                  <p className="text-zinc-500">Log in once, define your parameters, and let our daily automation worker maintain your continuous streak.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <header className="flex items-center justify-between mb-16 pb-6 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <img src={session?.user?.image || ""} alt="Avatar" className="w-12 h-12 rounded-full ring-2 ring-emerald-500/20" />
                  <div>
                    <h2 className="text-xl font-bold font-sans">Welcome back, {session?.user?.name}</h2>
                    <p className="text-zinc-400">GitHub: {(session?.user as any)?.githubUsername || "Connected"}</p>
                  </div>
                </div>
                <form
                  action={async () => {
                    "use server"
                    await signOut()
                  }}
                >
                  <button type="submit" className="text-sm font-medium text-zinc-400 hover:text-white px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    Disconnect
                  </button>
                </form>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                {/* Settings Panel */}
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 h-fit">
                  <h3 className="text-xl font-semibold mb-6">Automation Strategy</h3>
                  
                  <div className="space-y-6">
                     {/* Client component wrapper for the interactive form would go here, 
                         for now we show static mock up of the options */}
                     <label className="flex items-start space-x-4 p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/5 cursor-pointer hover:bg-emerald-500/10 transition-colors">
                       <input type="radio" name="strategy" className="mt-1" defaultChecked />
                       <div>
                         <span className="block font-medium text-emerald-50">Dedicated Repository</span>
                         <span className="text-sm text-zinc-400 text-balance block mt-1">We will create a specific `daily-streak-log` repo for you and push there exclusively.</span>
                       </div>
                     </label>

                     <label className="flex items-start space-x-4 p-4 rounded-xl border border-white/10 cursor-pointer hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed">
                       <input type="radio" name="strategy" className="mt-1" disabled />
                       <div>
                         <span className="block font-medium">Random Repositories (Coming Soon)</span>
                         <span className="text-sm text-zinc-400 text-balance block mt-1">Select from your existing repositories to randomly distribute commits.</span>
                       </div>
                     </label>

                     <button className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl transition-colors">
                       Save Parameters
                     </button>
                  </div>
                </div>

                {/* Status / Activity Panel */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(16,185,129,0.2)]">
                     <TrendingUp className="w-12 h-12" />
                   </div>
                   <h2 className="text-2xl font-bold mb-2">Automation Active</h2>
                   <p className="text-zinc-400 max-w-sm">We are actively monitoring your account. Next scheduled commit is in <strong className="text-white">14 hours</strong>.</p>
                </div>
              </div>

            </div>
          )}
      </main>
    </div>
  )
}
