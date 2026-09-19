import { useState } from 'react';
import { Venture, VCCriticItem, CriticSeverity } from '../../types';
import { runVcCriticApi } from '../../lib/api';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RotateCw, 
  Filter, 
  FileText,
  Flame,
  Check,
  Cpu
} from 'lucide-react';

interface ExecutiveCriticProps {
  venture: Venture;
  onUpdateVenture: (updated: Venture) => void;
  onNavigateToSlide: (slideNumber: number) => void;
}

export function ExecutiveCritic({
  venture,
  onUpdateVenture,
  onNavigateToSlide
}: ExecutiveCriticProps) {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [isAuditing, setIsAuditing] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [mitigationText, setMitigationText] = useState('');

  const critiques = venture.critique || [];

  const criticalCount = critiques.filter((c) => c.severity === 'Critical' && !c.resolved).length;
  const warningCount = critiques.filter((c) => c.severity === 'Warning' && !c.resolved).length;
  const suggestionCount = critiques.filter((c) => c.severity === 'Suggestion' && !c.resolved).length;
  const resolvedCount = critiques.filter((c) => c.resolved).length;

  const filtered = critiques.filter((c) => {
    if (filterSeverity === 'all') return true;
    if (filterSeverity === 'resolved') return c.resolved;
    return c.severity.toLowerCase() === filterSeverity.toLowerCase() && !c.resolved;
  });

  const handleRerunAudit = async () => {
    setIsAuditing(true);
    try {
      const freshCritique = await runVcCriticApi(venture.questionnaire, venture.slides);
      onUpdateVenture({
        ...venture,
        critique: freshCritique,
        criticStatus: freshCritique.some((c) => c.severity === 'Critical')
          ? 'issues_found'
          : 'investor_ready',
        lastUpdated: 'Just now'
      });
    } catch (err) {
      console.warn('VC Critic run failed:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleToggleResolve = (issueId: string) => {
    const updated = critiques.map((c) => {
      if (c.id === issueId) {
        return { ...c, resolved: !c.resolved };
      }
      return c;
    });
    onUpdateVenture({
      ...venture,
      critique: updated,
      lastUpdated: 'Just now'
    });
  };

  const handleSaveMitigation = (issueId: string) => {
    if (!mitigationText.trim()) return;
    const updated = critiques.map((c) => {
      if (c.id === issueId) {
        return {
          ...c,
          resolved: true,
          problem: `${c.problem} [Mitigated: ${mitigationText.trim()}]`
        };
      }
      return c;
    });
    onUpdateVenture({
      ...venture,
      critique: updated,
      lastUpdated: 'Just now'
    });
    setResolvingId(null);
    setMitigationText('');
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Radar Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#10131E] border border-[#1E2536] p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#FF5722] animate-ping"></span>
              <span className="font-mono text-xs text-[#FF5722] uppercase tracking-wider font-bold">
                VC THREAT RADAR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white">
              INSTITUTIONAL CRITIQUE MATRIX
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
              Simulating a skeptical seed and Series A investment committee audit.
            </p>
          </div>

          <button
            onClick={handleRerunAudit}
            disabled={isAuditing}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:brightness-110 text-xs font-mono font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF5722]/20 disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing Deck...' : 'Run Fresh VC Threat Audit'}</span>
          </button>
        </div>

        {/* Telemetry Threat Metric Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <button
            onClick={() => setFilterSeverity('critical')}
            className={`p-4 rounded-xl border transition-all text-left ${
              filterSeverity === 'critical'
                ? 'bg-red-950/40 border-red-500/60 shadow-lg shadow-red-500/10'
                : 'bg-[#10131E] border-[#1E2536] hover:border-[#2B354C]'
            }`}
          >
            <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1 flex items-center justify-between">
              <span>Critical Flags</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
          </button>

          <button
            onClick={() => setFilterSeverity('warning')}
            className={`p-4 rounded-xl border transition-all text-left ${
              filterSeverity === 'warning'
                ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
                : 'bg-[#10131E] border-[#1E2536] hover:border-[#2B354C]'
            }`}
          >
            <div className="text-2xl font-bold text-amber-400">{warningCount}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1 flex items-center justify-between">
              <span>Defensibility</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
          </button>

          <button
            onClick={() => setFilterSeverity('suggestion')}
            className={`p-4 rounded-xl border transition-all text-left ${
              filterSeverity === 'suggestion'
                ? 'bg-[#182032] border-[#00E5FF]/60 shadow-lg shadow-[#00E5FF]/10'
                : 'bg-[#10131E] border-[#1E2536] hover:border-[#2B354C]'
            }`}
          >
            <div className="text-2xl font-bold text-[#00E5FF]">{suggestionCount}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1 flex items-center justify-between">
              <span>Suggestions</span>
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
            </div>
          </button>

          <button
            onClick={() => setFilterSeverity('resolved')}
            className={`p-4 rounded-xl border transition-all text-left ${
              filterSeverity === 'resolved'
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                : 'bg-[#10131E] border-[#1E2536] hover:border-[#2B354C]'
            }`}
          >
            <div className="text-2xl font-bold text-emerald-400">{resolvedCount}</div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1 flex items-center justify-between">
              <span>Mitigated</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between font-mono text-xs text-slate-400 border-b border-[#1E2536] pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter by:</span>
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2 py-0.5 rounded transition-colors ${
                filterSeverity === 'all' ? 'bg-[#1E2536] text-white font-bold' : 'hover:text-slate-200'
              }`}
            >
              All ({critiques.length})
            </button>
          </div>

          <span className="text-[11px] text-slate-500">
            Showing {filtered.length} threat records
          </span>
        </div>

        {/* Threat Cards Matrix */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-[#10131E] rounded-xl border border-[#1E2536] text-slate-400 font-mono text-xs">
              No vulnerabilities found matching this filter.
            </div>
          ) : (
            filtered.map((item) => {
              const isCritical = item.severity === 'Critical';
              const isWarning = item.severity === 'Warning';
              const isResolved = Boolean(item.resolved);

              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isResolved
                      ? 'bg-[#0E121B]/60 border-[#1B2232] opacity-75'
                      : isCritical
                      ? 'bg-[#14121A] border-red-900/40 hover:border-red-600/50'
                      : isWarning
                      ? 'bg-[#14151B] border-amber-900/40 hover:border-amber-600/50'
                      : 'bg-[#10131E] border-[#222A3C] hover:border-[#303B54]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                          isResolved
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                            : isCritical
                            ? 'bg-red-950/70 text-red-300 border-red-800/50'
                            : isWarning
                            ? 'bg-amber-950/70 text-amber-300 border-amber-800/50'
                            : 'bg-[#182030] text-[#00E5FF] border-[#00E5FF]/30'
                        }`}
                      >
                        {isResolved ? 'RESOLVED' : item.severity}
                      </span>

                      <span className="text-xs font-mono text-slate-400">
                        {item.category} • SLIDE {item.slideNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateToSlide(item.slideNumber)}
                        className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3 h-3 text-[#00E5FF]" />
                        <span>Inspect Slide {item.slideNumber}</span>
                      </button>

                      <button
                        onClick={() => handleToggleResolve(item.id)}
                        className={`text-xs font-mono px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
                          isResolved
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900/40'
                            : 'bg-[#161C2A] text-slate-300 border-[#253046] hover:bg-[#1E2638]'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{isResolved ? 'Mitigated' : 'Mark Resolved'}</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {item.title || item.problem}
                  </h3>

                  {item.whyItMatters && (
                    <div className="text-xs text-amber-400/90 font-mono mb-2">
                      Why partner scrutinizes this: {item.whyItMatters}
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-4">
                    {item.critique || item.problem}
                  </p>

                  <div className="p-3.5 rounded-lg bg-[#0C0F17] border border-[#1E2536] text-xs font-sans space-y-1">
                    <div className="font-mono text-[10px] uppercase font-bold text-[#00E5FF] tracking-wider">
                      Partner Recommendation
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {item.recommendation || item.suggestedImprovement}
                    </p>
                  </div>

                  {/* Inline Mitigation Editor */}
                  {resolvingId === item.id ? (
                    <div className="mt-4 pt-4 border-t border-[#1C2334] space-y-2">
                      <div className="text-xs font-mono text-slate-400">
                        Record counter-evidence or mitigation:
                      </div>
                      <textarea
                        value={mitigationText}
                        onChange={(e) => setMitigationText(e.target.value)}
                        placeholder="e.g., We signed 3 pilot MOUs locking in 500 orders..."
                        rows={2}
                        className="w-full bg-[#151926] border border-[#252F44] rounded p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#00E5FF]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveMitigation(item.id)}
                          className="px-3 py-1 rounded bg-[#00E5FF] text-[#090A0F] font-mono text-xs font-bold hover:brightness-110"
                        >
                          Save Mitigation
                        </button>
                        <button
                          onClick={() => setResolvingId(null)}
                          className="px-3 py-1 rounded bg-[#1C2232] text-slate-300 font-mono text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    !isResolved && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => {
                            setResolvingId(item.id);
                            setMitigationText('');
                          }}
                          className="text-xs font-mono text-[#00E5FF] hover:underline flex items-center gap-1"
                        >
                          <span>Log Counter-Evidence</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
