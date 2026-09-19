import { useState } from 'react';
import { 
  Terminal, 
  ShieldAlert, 
  BarChart3, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Layers, 
  CheckCircle2, 
  ChevronRight,
  Cpu,
  Flame,
  FileText,
  Palette
} from 'lucide-react';
import { UiDesignMode } from '../../types';

interface ExecutiveLandingProps {
  onStartNew: () => void;
  onExploreDemo: () => void;
  uiMode: UiDesignMode;
  onToggleUiMode: () => void;
}

export function ExecutiveLanding({
  onStartNew,
  onExploreDemo,
  uiMode,
  onToggleUiMode
}: ExecutiveLandingProps) {
  const [activeTab, setActiveTab] = useState<'critic' | 'studio' | 'sparring'>('critic');

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 selection:bg-[#FF5722]/30 selection:text-[#FF8A65] relative overflow-hidden">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-radial from-[#FF5722]/10 via-[#00E5FF]/5 to-transparent blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-[600px] right-10 w-[500px] h-[500px] bg-radial from-[#00E5FF]/5 to-transparent blur-3xl pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        
        {/* Top Badge: Design Mode Notification */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141824] border border-[#263044] text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
            <span className="text-slate-400">DESIGN ARCHETYPE:</span>
            <span className="font-bold text-white uppercase tracking-wider">EXECUTIVE OBSIDIAN</span>
          </div>

          <button
            onClick={onToggleUiMode}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1F2E] hover:bg-[#252C40] border border-[#313C54] text-xs font-mono text-[#00E5FF] transition-all hover:scale-105"
          >
            <Palette className="w-3 h-3 text-[#FF5722]" />
            <span>Switch to Editorial Paper Design</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white font-mono uppercase mb-6 leading-none">
            LIGHT THE WAY <br />
            <span className="bg-gradient-to-r from-[#FF5722] via-[#FF8A65] to-[#00E5FF] bg-clip-text text-transparent">
              TO INVESTOR CONVICTION
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 font-sans max-w-2xl mx-auto leading-relaxed">
            A venture intelligence terminal for founders. Separate validated facts from speculative assumptions, audit vulnerability blindspots with an AI VC critic, and generate defensible decks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white font-mono font-semibold text-sm tracking-wide hover:brightness-110 shadow-lg shadow-[#FF5722]/20 flex items-center justify-center gap-2.5 transition-all group"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            <span>Launch QuickPrint Demo Workspace</span>
          </button>

          <button
            onClick={onStartNew}
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#141824] text-slate-200 font-mono font-medium text-sm tracking-wide hover:bg-[#1D2335] border border-[#273248] flex items-center justify-center gap-2 transition-all"
          >
            <Terminal className="w-4 h-4 text-[#00E5FF]" />
            <span>Create New Venture From Scratch</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Telemetry Matrix Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-xl bg-[#10131D]/80 border border-[#1E2536] backdrop-blur-sm font-mono text-center mb-20">
          <div className="p-3 border-r border-[#1E2536] last:border-r-0">
            <div className="text-2xl font-bold text-white">11</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Institutional Slides</div>
          </div>
          <div className="p-3 border-r border-[#1E2536] last:border-r-0">
            <div className="text-2xl font-bold text-[#00E5FF]">9</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Strategic Dimensions</div>
          </div>
          <div className="p-3 border-r border-[#1E2536] last:border-r-0">
            <div className="text-2xl font-bold text-[#FF5722]">0%</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Hallucinated Data</div>
          </div>
          <div className="p-3">
            <div className="text-2xl font-bold text-emerald-400">100%</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Audit Trail</div>
          </div>
        </div>

        {/* Interactive Terminal Showcase Preview */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-[#0F121C] border border-[#242D40] shadow-2xl overflow-hidden">
          {/* Terminal Window Header */}
          <div className="px-4 py-3 bg-[#161B28] border-b border-[#242D40] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5722]/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#FFB300]/80"></span>
              <span className="w-3 h-3 rounded-full bg-[#00E5FF]/80"></span>
              <span className="ml-2 text-xs font-mono text-slate-400">terminal://venture-wicks/demo/quickprint</span>
            </div>

            <div className="flex items-center gap-1 bg-[#0E1119] p-1 rounded-md border border-[#222A3C]">
              <button
                onClick={() => setActiveTab('critic')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  activeTab === 'critic' ? 'bg-[#1E2536] text-[#FF5722] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                VC Critic Threat Radar
              </button>
              <button
                onClick={() => setActiveTab('studio')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  activeTab === 'studio' ? 'bg-[#1E2536] text-[#00E5FF] font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                11-Slide Deck Preview
              </button>
              <button
                onClick={() => setActiveTab('sparring')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  activeTab === 'sparring' ? 'bg-[#1E2536] text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Partner Sparring
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-8">
            {activeTab === 'critic' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2538]">
                  <div>
                    <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#FF5722]" />
                      ACTIVE THREAT AUDIT: QUICKPRINT CAMPUS LOGISTICS
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      3 institutional vulnerabilities identified across 11 slides
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-red-950/40 text-red-400 border border-red-800/40 text-xs font-mono font-semibold">
                    HIGH SCRUTINY
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[#141824] border border-[#242D40]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40">
                        CRITICAL • SLIDE 4
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">Market Sizing</span>
                    </div>
                    <div className="font-semibold text-white text-sm mb-1">
                      Top-Down National College TAM Needs Bottom-Up Verification
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Investors will discount the $1.2B headline number unless grounded by verified print spend per student at initial beachhead campuses.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-[#141824] border border-[#242D40]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                        WARNING • SLIDE 7
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">Defensibility</span>
                    </div>
                    <div className="font-semibold text-white text-sm mb-1">
                      Incumbent Copycat Risk From Campus Print Shops
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Campus bookshops can install lockers. Prove student ambassador lock-in and direct LMS integration as durable moats.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onExploreDemo}
                    className="px-4 py-2 rounded bg-[#1D2436] hover:bg-[#273048] text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect Full Threat Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF5722]" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'studio' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2538]">
                  <div className="text-base font-mono font-bold text-white">
                    SLIDE 03: THE PRODUCTIZED SOLUTION
                  </div>
                  <span className="text-xs font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded border border-[#00E5FF]/20">
                    FACT-GROUNDED
                  </span>
                </div>

                <div className="p-5 rounded-lg bg-[#141824] border border-[#242D40] space-y-4">
                  <div className="text-lg font-bold text-white">
                    Distributed Smart Kiosks + Cloud Print Queue with Guaranteed 3-Minute Pickup
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      FACT: 4 kiosks active at University of Illinois
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/50 text-amber-300 border border-amber-800/30 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      ASSUMPTION: 82% daily utilization sustains during winter breaks
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-center">
                    <div className="p-2.5 rounded bg-[#10131E] border border-[#20283A]">
                      <div className="text-sm font-bold text-[#00E5FF]">3.2 Min</div>
                      <div className="text-[10px] text-slate-400 uppercase">Avg Turnaround</div>
                    </div>
                    <div className="p-2.5 rounded bg-[#10131E] border border-[#20283A]">
                      <div className="text-sm font-bold text-white">$0.09</div>
                      <div className="text-[10px] text-slate-400 uppercase">Cost Per Page</div>
                    </div>
                    <div className="p-2.5 rounded bg-[#10131E] border border-[#20283A]">
                      <div className="text-sm font-bold text-emerald-400">98.4%</div>
                      <div className="text-[10px] text-slate-400 uppercase">First-Run Uptime</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onExploreDemo}
                    className="px-4 py-2 rounded bg-[#1D2436] hover:bg-[#273048] text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Launch 11-Slide Deck Editor</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#00E5FF]" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'sparring' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2538]">
                  <div className="text-base font-mono font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    SIMULATOR: GENERAL PARTNER QUESTION
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                    UNIT ECONOMICS
                  </span>
                </div>

                <div className="p-4 rounded-lg bg-[#141824] border border-[#242D40] space-y-3">
                  <div className="text-sm font-semibold text-slate-200">
                    "Paper and toner prices are surging 14% annually. How do unit contribution margins stay above 60% as hardware depreciates?"
                  </div>
                  <div className="p-3 rounded bg-[#0E121B] border border-[#1F273A] text-xs text-slate-300 font-mono leading-relaxed">
                    <span className="text-slate-400 block mb-1 font-sans font-semibold">Grounded Defense:</span>
                    "Wholesale paper supply agreements lock in bulk paper at $0.018/sheet through year two, with 40% margin sustained by high-value bound thesis printups."
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onExploreDemo}
                    className="px-4 py-2 rounded bg-[#1D2436] hover:bg-[#273048] text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Enter Sparring Arena</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-[#1C2232]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold font-mono text-white uppercase tracking-tight mb-3">
            Core Operating Capabilities
          </h2>
          <p className="text-sm text-slate-400 font-sans">
            Built specifically for early-stage founders seeking pre-seed, seed, or Series A capital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#111420] border border-[#21283B] hover:border-[#323D57] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#1B2234] border border-[#2E3A54] flex items-center justify-center mb-5 text-[#FF5722]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-mono font-bold text-white mb-2 uppercase">
              11-Slide Institutional Deck
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
              Synthesizes Problem, Solution, Market Sizing, Business Model, Defensibility, and Capital Ask without generic AI fluff.
            </p>
            <div className="text-[11px] font-mono text-[#00E5FF] flex items-center gap-1">
              <span>Instant .pptx Download</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#111420] border border-[#21283B] hover:border-[#323D57] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#1B2234] border border-[#2E3A54] flex items-center justify-center mb-5 text-[#00E5FF]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-mono font-bold text-white mb-2 uppercase">
              VC Critic Threat Radar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
              Simulates a skeptical VC partner reviewing your deck slide by slide. Flags ungrounded assumptions before investors do.
            </p>
            <div className="text-[11px] font-mono text-[#00E5FF] flex items-center gap-1">
              <span>Threat Severity Matrix</span>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-[#111420] border border-[#21283B] hover:border-[#323D57] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#1B2234] border border-[#2E3A54] flex items-center justify-center mb-5 text-emerald-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-mono font-bold text-white mb-2 uppercase">
              Partner Sparring Arena
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
              Practice answering tough investor questions about defensibility, margins, and moats with real-time credibility scoring.
            </p>
            <div className="text-[11px] font-mono text-[#00E5FF] flex items-center gap-1">
              <span>Credibility Scoring Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#191E2C] py-8 text-center text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">VENTURE.WICKS</span>
            <span>•</span>
            <span>EXECUTIVE TERMINAL</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleUiMode}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Switch to Editorial Paper View
            </button>
            <span>•</span>
            <button
              onClick={onExploreDemo}
              className="text-[#FF5722] hover:underline"
            >
              Explore QuickPrint
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
