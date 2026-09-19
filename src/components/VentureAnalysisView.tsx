import { useState } from 'react';
import { Venture, VentureAnalysis } from '../types';
import { analyzeVentureApi } from '../lib/api';
import { 
  BarChart3, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Compass,
  TrendingUp,
  Flame
} from 'lucide-react';

interface VentureAnalysisViewProps {
  venture: Venture;
  onUpdateVenture: (updated: Venture) => void;
  onNavigateToStudio: () => void;
}

export function VentureAnalysisView({
  venture,
  onUpdateVenture,
  onNavigateToStudio
}: VentureAnalysisViewProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysis: VentureAnalysis | undefined = venture.analysis;

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeVentureApi(venture.questionnaire, venture.slides);
      onUpdateVenture({
        ...venture,
        analysis: result || undefined,
        lastUpdated: 'Just now'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E7DFD5]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF0E4] border border-[#E9D5C0] text-xs font-semibold text-[#883607] mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-[#D96B27]" />
            <span>9 Strategic Dimensions</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#191716] font-bold">
            Venture Analysis for {venture.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E665E] mt-1">
            Holistic strategic audit of startup anatomy without superficial numerical gimmicks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="px-5 py-2.5 rounded-md text-xs font-semibold text-white bg-[#D96B27] hover:bg-[#C25A19] transition-all flex items-center gap-2 shadow-xs"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Strategy...</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Re-Analyze Strategy</span>
              </>
            )}
          </button>

          <button
            onClick={onNavigateToStudio}
            className="px-4 py-2.5 rounded-md text-xs font-medium text-[#3D3731] bg-white border border-[#DDD5C9] hover:bg-[#F8F4EE] transition-colors"
          >
            Studio
          </button>
        </div>
      </div>

      {/* Holistic Executive Verdict */}
      {analysis && (
        <div className="bg-white border border-[#E2DAD0] rounded-xl p-6 mb-8 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EFE8DF] mb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#883607] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#D96B27]" />
              Executive Strategic Verdict
            </div>
            <span className="text-[11px] font-mono text-[#8C8379]">Venture Wicks Audit</span>
          </div>
          <p className="text-sm sm:text-base text-[#191716] font-serif leading-relaxed mb-4">
            {analysis.executiveSummary}
          </p>
          <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EADFCF] text-xs text-[#524B43]">
            <strong>Strategic Imperative:</strong> {analysis.strategicImperative}
          </div>
        </div>
      )}

      {/* The 9 Strategic Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analysis?.dimensions.map((dim, idx: number) => {
          const dimTitle = dim.name || dim.dimension;
          const dimText = dim.analysis || dim.details || dim.summary;
          const isHighConviction = dim.status === 'High Conviction' || dim.status === 'Defensible' || dim.status === 'Compelling' || dim.status === 'Strong';
          const isNeedsWork = dim.status.toLowerCase().includes('need') || dim.status.toLowerCase().includes('early') || dim.status.toLowerCase().includes('challenge');

          return (
            <div
              key={dimTitle || idx}
              className="bg-white border border-[#E5DFD7] rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-[#D6CCC0] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#8C8379]">
                    0{idx + 1}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      isHighConviction
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : isNeedsWork
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-[#F2ECE3] text-[#5C544C]'
                    }`}
                  >
                    {dim.status}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#191716] mb-2">
                  {dimTitle}
                </h3>

                <p className="text-xs text-[#4F4741] leading-relaxed mb-4">
                  {dimText}
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0EAE1]">
                <div className="text-[10px] uppercase font-bold text-[#7D7369] tracking-wider mb-1">
                  Strategic Note
                </div>
                <p className="text-[11px] text-[#26221E] font-medium leading-relaxed">
                  {dim.actionableStep || dim.summary || 'Maintain validation milestones before seed round.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
