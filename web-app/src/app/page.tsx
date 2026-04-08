import { auth, signIn } from "../../auth"
import { GitBranch as Github, ChevronRight } from "lucide-react"
import { LandingFeatures } from "../components/LandingFeatures"
import DashboardContainer from "../components/DashboardContainer"

export default async function Home() {
  const session = await auth()

  if (session) {
    return <DashboardContainer session={session} />
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 relative font-sans overflow-hidden">
      {/* Background Enhancements */}
      <div className="mesh-bg opacity-40 fixed inset-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl relative">
          <div className="mb-8 inline-flex items-center space-x-3 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-sm text-emerald-400 backdrop-blur-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="font-medium tracking-wide">Automating 4,200+ daily commits</span>
          </div>

          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-10 bg-gradient-to-br from-white via-zinc-400 to-emerald-500 bg-clip-text text-transparent animate-text-gradient">
            Unbreakable <br />Green Squares.
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
      </main>
    </div>
  )
}
