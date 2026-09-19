import { useState } from 'react';
import { Venture, VentureAIAnalysis } from '../../types';
import { analyzeVentureApi } from '../../lib/api';
import { 
  BarChart3, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';

interface ExecutiveAnalysisProps {
  venture: Venture;
  onUpdateVenture: (updated: Venture) => void;
  onNavigateToStudio: () => void;
}

export function ExecutiveAnalysis({
  venture,
  onUpdateVenture,
  onNavigateToStudio
}: ExecutiveAnalysisProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const analysis = venture.analysis;

  const handleRerunAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await analyzeVentureApi(venture.questionnaire, venture.slides);
      onUpdateVenture({
        ...venture,
        analysis: result || undefined,
        lastUpdated: 'Just now'
      });
    } catch (err) {
      console.warn('Analysis audit failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#10131E] border border-[#1E2536] p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
              <span className="font-mono text-xs text-[#00E5FF] uppercase tracking-wider font-bold">
                STRATEGIC DIAGNOSTIC
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white">
              9-DIMENSION VENTURE AUDIT
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
              Rigorous diagnostic of venture durability, product-market fit, and capitalization logic.
            </p>
          </div>

          <button
            onClick={handleRerunAudit}
            disabled={isAuditing}
            className="px-4 py-2.5 rounded-lg bg-[#161C2A] hover:bg-[#20283C] border border-[#27344D] text-xs font-mono text-[#00E5FF] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing Dimensions...' : 'Run Strategic Diagnostic'}</span>
          </button>
        </div>

        {/* Executive Readiness Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121624] via-[#10131E] to-[#14121E] border border-[#212A3D] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
              Strategic Imperative
            </div>
            <p className="text-sm sm:text-base text-slate-200 font-sans leading-relaxed">
              {analysis?.strategicImperative ||
                'Validate recurring customer willingness to pay and establish bottom-up unit margins before expanding campus kiosk network.'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0D14] border border-[#1C2334] font-mono text-center shrink-0 min-w-[160px]">
            <div className="text-3xl font-bold text-white">78/100</div>
            <div className="text-[10px] text-emerald-400 uppercase tracking-wider mt-1">
              READINESS SCORE
            </div>
          </div>
        </div>

        {/* 9 Dimensions Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(analysis?.dimensions || []).map((dim, idx) => {
            const dimTitle = dim.name || dim.dimension;
            const dimText = dim.analysis || dim.details || dim.summary;
            const isHighConviction =
              dim.status === 'High Conviction' ||
              dim.status === 'Defensible' ||
              dim.status === 'Compelling' ||
              dim.status === 'Strong';
            const isNeedsWork =
              dim.status.toLowerCase().includes('need') ||
              dim.status.toLowerCase().includes('early') ||
              dim.status.toLowerCase().includes('challenge');

            return (
              <div
                key={dimTitle || idx}
                className="p-5 rounded-xl bg-[#10131E] border border-[#1E2536] hover:border-[#2C374D] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">
                      DIMENSION 0{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        isHighConviction
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                          : isNeedsWork
                          ? 'bg-amber-950/60 text-amber-300 border-amber-800/40'
                          : 'bg-[#182030] text-[#00E5FF] border-[#00E5FF]/30'
                      }`}
                    >
                      {dim.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-mono mb-2">
                    {dimTitle}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                    {dimText}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1C2334]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Actionable Milestone
                  </div>
                  <p className="text-xs text-slate-200 font-mono">
                    {dim.actionableStep || 'Maintain validation milestones before seed round.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
