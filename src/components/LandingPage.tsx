import { useState } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle, 
  BarChart3, 
  Coins, 
  CheckCircle2, 
  Play, 
  Flame,
  ChevronRight,
  TrendingUp,
  FileText,
  Palette
} from 'lucide-react';
import { VentureLogo } from './VentureLogo';
import { UiDesignMode } from '../types';

interface LandingPageProps {
  onStartVenture: () => void;
  onExploreDemo: () => void;
  onOpenAuth: () => void;
  uiMode?: UiDesignMode;
  onToggleUiMode?: () => void;
}

export function LandingPage({ onStartVenture, onExploreDemo, onOpenAuth, uiMode, onToggleUiMode }: LandingPageProps) {
  const [activeCard, setActiveCard] = useState<number>(0);

  const featureCards = [
    {
      title: 'Market Opportunity',
      icon: TrendingUp,
      badge: 'Rigorous Sizing',
      headline: 'Ground assumptions in bottom-up logic.',
      description: 'Replace hand-waving trillion-dollar market claims with defensible beachhead sizing and realistic adoption velocity.',
      sampleText: 'Beachhead: 15 large residential campuses • 45-min delivery window • Verified $75/year student spend'
    },
    {
      title: 'VC Critic',
      icon: ShieldAlert,
      badge: 'Unsparing Challenge',
      headline: 'See your pitch through cynical investor eyes.',
      description: 'Find the lethal weaknesses in your unit economics, defensibility, and traction before you sit down with venture partners.',
      sampleText: 'Critical: Qualitative interviews do not establish willingness to pay. Concierge pilot required.'
    },
    {
      title: 'Investor Questions',
      icon: HelpCircle,
      badge: 'Q&A Readiness',
      headline: 'Defend every slide with grounded facts.',
      description: 'Pre-generate tough partner-level questions. Answers strictly draw from your real data, immediately flagging when evidence is missing.',
      sampleText: 'Q: Why won\'t commercial print chains copy this? A: Retail stores lack dorm access credentials.'
    },
    {
      title: 'Pitch Analysis',
      icon: BarChart3,
      badge: '9 Strategic Dimensions',
      headline: 'Holistic audit across the full startup anatomy.',
      description: 'Evaluate Problem Strength, Solution Clarity, Moats, Go-To-Market, and Financial Logic without superficial fake scores.',
      sampleText: 'Analysis: High founder empathy, asset-light operations; needs multi-campus courier retention pilot.'
    },
    {
      title: 'Funding Strategy',
      icon: Coins,
      badge: 'Disciplined Ask',
      headline: 'Transparent runway and milestone gating.',
      description: 'Craft an investor ask where every dollar connects directly to de-risking your venture for follow-on institutional rounds.',
      sampleText: 'Ask: $150,000 Pre-Seed • 45% Tech, 30% Pilot fulfillment • Target: 10,000 orders de-risks Seed'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#191716] flex flex-col selection:bg-[#E8732A]/20">
      {/* Editorial Header */}
      <header className="border-b border-[#E8DFD5] bg-[#FAF8F5]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <VentureLogo size="md" showTagline={false} />
          
          <div className="flex items-center gap-3 sm:gap-4">
            {onToggleUiMode && (
              <button
                onClick={onToggleUiMode}
                title="Switch to Executive Obsidian Design"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F0E9DF] hover:bg-[#E6DEC4] border border-[#DDD3C5] text-xs font-medium text-[#2E2824] transition-all"
              >
                <Palette className="w-3.5 h-3.5 text-[#D96B27]" />
                <span className="hidden sm:inline text-[#696159]">UI Mode:</span>
                <span className="font-semibold">Editorial</span>
                <span className="text-[10px] text-[#883607] bg-[#D96B27]/10 px-1 py-0.2 rounded border border-[#D96B27]/20 font-mono">
                  SWITCH
                </span>
              </button>
            )}

            <button
              onClick={onExploreDemo}
              className="hidden sm:inline-block text-xs font-medium text-[#6B635A] hover:text-[#191716] transition-colors px-3 py-2"
            >
              Explore Demo Venture
            </button>
            <button
              onClick={onOpenAuth}
              className="text-xs font-medium text-[#191716] hover:bg-[#EFE9E0] px-4 py-2 rounded-md border border-[#D9D1C5] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onStartVenture}
              className="text-xs font-medium text-white bg-[#D96B27] hover:bg-[#C25A19] px-4 py-2 rounded-md shadow-xs transition-all"
            >
              Start Building
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 px-6 max-w-5xl mx-auto text-center">
        {/* Subtle Concept Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3ECE1] border border-[#E4DCD0] text-xs font-medium text-[#6B6156] mb-8">
          <Flame className="w-3.5 h-3.5 text-[#D96B27]" />
          <span>A wick turns a spark into a flame. We turn an idea into a venture.</span>
        </div>

        {/* Hero Headline */}
        <h1 className="font-serif text-5xl md:text-7xl text-[#191716] font-normal tracking-tight leading-[1.1] mb-6">
          Your idea is the spark. <br />
          <span className="italic text-[#D96B27]">We help turn it into a venture.</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-[#615850] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Venture Wicks helps founders build, challenge, practice, and present investor-ready startup pitches with AI.
        </p>

        {/* Dual Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            id="btn-hero-start"
            onClick={onStartVenture}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-[#191716] text-white text-sm font-semibold hover:bg-[#2F2A26] transition-all shadow-md group"
          >
            <span>Start Your Venture</span>
            <ArrowRight className="w-4 h-4 text-[#E8732A] group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            id="btn-hero-demo"
            onClick={onExploreDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-white border border-[#DDD5C9] text-[#191716] text-sm font-medium hover:bg-[#F8F4EE] transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 text-[#D96B27] fill-current" />
            <span>Explore Demo (QuickPrint)</span>
          </button>
        </div>

        {/* The Pipeline Visual: Idea → Strategy → Pitch → Investor */}
        <div className="pt-6 border-t border-[#E8DFD5] max-w-4xl mx-auto">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-[#887E74] mb-6 text-center">
            The Venture Readiness Continuum
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-[#FAF7F2] border border-[#E7DFD5] p-4 rounded-lg text-left relative">
              <div className="w-6 h-6 rounded bg-[#F1E9DE] text-[#695F54] flex items-center justify-center text-xs font-bold mb-2">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-[#191716]">Idea</h3>
              <p className="text-xs text-[#736B63] mt-1">
                Friction, core customer pain, and qualitative hypotheses.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E7DFD5] p-4 rounded-lg text-left relative">
              <div className="w-6 h-6 rounded bg-[#F1E9DE] text-[#695F54] flex items-center justify-center text-xs font-bold mb-2">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-[#191716]">Strategy</h3>
              <p className="text-xs text-[#736B63] mt-1">
                Unit economics, moats, and beachhead customer channels.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E7DFD5] p-4 rounded-lg text-left relative">
              <div className="w-6 h-6 rounded bg-[#F1E9DE] text-[#695F54] flex items-center justify-center text-xs font-bold mb-2">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-[#191716]">Pitch</h3>
              <p className="text-xs text-[#736B63] mt-1">
                11 investor slides audited for verified facts vs assumptions.
              </p>
            </div>

            <div className="bg-[#F8F2EB] border border-[#E3D1BE] p-4 rounded-lg text-left relative">
              <div className="w-6 h-6 rounded bg-[#ECD8C5] text-[#883607] flex items-center justify-center text-xs font-bold mb-2">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-[#883607]">Investor</h3>
              <p className="text-xs text-[#736B63] mt-1">
                VC critique, simulation practice, and institutional presentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Cards Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl text-[#191716] font-normal mb-3">
            Designed for founders who reject superficial pitch decks.
          </h2>
          <p className="text-sm text-[#665D54]">
            Venture Wicks never invents facts, revenues, or partnerships. Every claim is scrutinized, categorized, and defended.
          </p>
        </div>

        {/* Feature Selector & Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 5 Subtle Cards */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {featureCards.map((card, idx) => {
              const Icon = card.icon;
              const isSelected = activeCard === idx;
              return (
                <button
                  key={card.title}
                  onClick={() => setActiveCard(idx)}
                  className={`text-left p-4 rounded-lg border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-white border-[#D96B27] shadow-sm ring-1 ring-[#D96B27]/20'
                      : 'bg-[#FBF9F6] border-[#E8E1D7] hover:bg-white hover:border-[#D6CCC0]'
                  }`}
                >
                  <div className={`p-2 rounded-md shrink-0 mt-0.5 ${isSelected ? 'bg-[#FDF1E8] text-[#D96B27]' : 'bg-[#EFE9DF] text-[#696057]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[#191716]">{card.title}</span>
                      <span className="text-[10px] uppercase font-bold text-[#883607] tracking-wider bg-[#F9EFE3] px-2 py-0.5 rounded">
                        {card.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B6258] line-clamp-2 leading-relaxed">
                      {card.headline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Live Interactive Card Detail */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#E2DAD0] p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE8DF] mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#883607] uppercase tracking-wider">
                  Venture Wicks Engine
                </span>
                <span className="text-[#CCC4BA]">•</span>
                <span className="text-xs text-[#665E56]">
                  {featureCards[activeCard].title}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#8C8379] bg-[#F5EFE8] px-2.5 py-0.5 rounded">
                Fact-Checked
              </span>
            </div>

            <h3 className="font-serif text-2xl text-[#191716] font-bold mb-3">
              {featureCards[activeCard].headline}
            </h3>

            <p className="text-sm text-[#574F47] leading-relaxed mb-6">
              {featureCards[activeCard].description}
            </p>

            <div className="bg-[#FAF7F2] border border-[#E9E1D6] rounded-lg p-4 mb-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#736A61] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D96B27]" />
                Live Demo Output Sample
              </div>
              <p className="text-xs text-[#26221E] font-mono leading-relaxed bg-white p-3 rounded border border-[#E5DDD2]">
                {featureCards[activeCard].sampleText}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EFE8DF]">
              <span className="text-xs text-[#736B63]">
                Ready to evaluate your venture?
              </span>
              <button
                onClick={onExploreDemo}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D96B27] hover:text-[#B24E12] transition-colors"
              >
                <span>Test this in QuickPrint Demo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote & Trust Section */}
      <section className="py-16 px-6 bg-[#F3ECE1] border-y border-[#E4DCD0] my-8">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-serif text-2xl md:text-3xl text-[#191716] italic leading-snug mb-4">
            “Investors do not fund ideas. They fund the discipline of founders who know their assumptions and have a plan to prove them.”
          </blockquote>
          <cite className="text-xs uppercase tracking-widest text-[#786E63] font-semibold not-italic">
            The Venture Wicks Philosophy
          </cite>
        </div>
      </section>

      {/* Minimal Editorial Footer */}
      <footer className="mt-auto border-t border-[#E8DFD5] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7D756B]">
          <div className="flex items-center gap-2">
            <VentureLogo size="sm" />
            <span className="text-[#A1988D]">|</span>
            <span>Light the way from startup idea to investor-ready pitch.</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Venture Wicks. Crafted for serious founders.
          </div>
        </div>
      </footer>
    </div>
  );
}
