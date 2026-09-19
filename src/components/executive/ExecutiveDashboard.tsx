import { Venture } from '../../types';
import { 
  Plus, 
  ArrowRight, 
  Layers, 
  Play, 
  ShieldAlert, 
  BarChart3, 
  CheckCircle2, 
  Cpu,
  HelpCircle,
  FileText
} from 'lucide-react';

interface ExecutiveDashboardProps {
  ventures: Venture[];
  activeVenture: Venture | null;
  onSelectVenture: (venture: Venture) => void;
  onCreateNewVenture: () => void;
  onNavigateToStudio: () => void;
  onNavigateToCritic: () => void;
  onStartPresentation: () => void;
}

export function ExecutiveDashboard({
  ventures,
  activeVenture,
  onSelectVenture,
  onCreateNewVenture,
  onNavigateToStudio,
  onNavigateToCritic,
  onStartPresentation
}: ExecutiveDashboardProps) {
  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#10131E] border border-[#1E2536] p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF5722]"></span>
              <span className="font-mono text-xs text-[#FF5722] uppercase tracking-wider font-bold">
                PORTFOLIO TERMINAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white">
              VENTURE WORKSPACES
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
              Manage your startup pitch decks, critical threat audits, and capital readiness.
            </p>
          </div>

          <button
            onClick={onCreateNewVenture}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:brightness-110 text-xs font-mono font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF5722]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Venture</span>
          </button>
        </div>

        {/* Ventures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ventures.map((v) => {
            const isActive = v.id === activeVenture?.id;
            const criticalThreats = (v.critique || []).filter(
              (c) => c.severity === 'Critical' && !c.resolved
            ).length;

            return (
              <div
                key={v.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#121624] border-[#00E5FF]/60 shadow-xl shadow-[#00E5FF]/5'
                    : 'bg-[#10131E] border-[#1E2536] hover:border-[#2C374D]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#00E5FF] px-2 py-0.5 rounded bg-[#090A0F] border border-[#1E273A]">
                      {v.stage}
                    </span>
                    {v.isDemo && (
                      <span className="font-mono text-[9px] uppercase font-bold text-[#FF9E80] bg-[#3E1B10] px-1.5 py-0.5 rounded border border-[#FF5722]/30">
                        DEMO
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white font-mono mb-2">
                    {v.name}
                  </h3>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2 mb-4">
                    {v.tagline || v.questionnaire?.solution || 'No venture summary recorded.'}
                  </p>

                  <div className="p-3 rounded-lg bg-[#0C0F17] border border-[#1A2130] font-mono text-xs space-y-2 mb-5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Completion:</span>
                      <span className="text-white font-bold">{v.pitchCompletion}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#182030] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00E5FF] rounded-full"
                        style={{ width: `${v.pitchCompletion}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">Critical Flags:</span>
                      <span className={criticalThreats > 0 ? 'text-[#FF5722] font-bold' : 'text-emerald-400'}>
                        {criticalThreats} Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1C2334] flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onSelectVenture(v);
                      onNavigateToStudio();
                    }}
                    className="flex-1 py-2 rounded bg-[#161C2A] hover:bg-[#20283C] text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors border border-[#27344D]"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Open Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectVenture(v);
                      onStartPresentation();
                    }}
                    className="p-2 rounded bg-[#161C2A] hover:bg-[#20283C] text-slate-300 hover:text-white border border-[#27344D] transition-colors"
                    title="Fullscreen Presentation"
                  >
                    <Play className="w-3.5 h-3.5 text-[#FF5722] fill-current" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Quick Create Card */}
          <button
            onClick={onCreateNewVenture}
            className="p-6 rounded-2xl border border-dashed border-[#242D40] hover:border-[#00E5FF]/60 hover:bg-[#10131E]/50 transition-all flex flex-col items-center justify-center text-center group min-h-[260px]"
          >
            <div className="w-12 h-12 rounded-xl bg-[#141824] border border-[#273248] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-[#FF5722]" />
            </div>
            <div className="font-mono text-sm font-bold text-white mb-1">
              Add New Venture
            </div>
            <p className="text-xs text-slate-400 font-sans max-w-[200px]">
              Complete the 4-step wizard to generate a fact-grounded pitch deck.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
