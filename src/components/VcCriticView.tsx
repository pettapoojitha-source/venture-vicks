import { useState } from 'react';
import { Venture, VcCritiqueIssue } from '../types';
import { runVcCriticApi } from '../lib/api';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Flame,
  Plus
} from 'lucide-react';

interface VcCriticViewProps {
  venture: Venture;
  onUpdateVenture: (updated: Venture) => void;
  onNavigateToStudio: () => void;
}

export function VcCriticView({ venture, onUpdateVenture, onNavigateToStudio }: VcCriticViewProps) {
  const [isRunningCritic, setIsRunningCritic] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'All' | 'Critical' | 'Warning' | 'Suggestion'>('All');
  const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);
  const [evidenceNote, setEvidenceNote] = useState('');

  const critiques = venture.critique || [];

  const filteredCritiques = critiques.filter((c) => {
    if (filterSeverity === 'All') return true;
    return c.severity === filterSeverity;
  });

  const criticalCount = critiques.filter((c) => c.severity === 'Critical').length;
  const warningCount = critiques.filter((c) => c.severity === 'Warning').length;
  const suggestionCount = critiques.filter((c) => c.severity === 'Suggestion').length;

  const handleRunCritic = async () => {
    setIsRunningCritic(true);
    try {
      const results = await runVcCriticApi(venture.questionnaire, venture.slides);
      onUpdateVenture({
        ...venture,
        critique: results,
        criticStatus: results.length > 0 ? 'issues_found' : 'investor_ready',
        lastUpdated: 'Just now'
      });
    } catch (err) {
      console.error('VC critic failed:', err);
    } finally {
      setIsRunningCritic(false);
    }
  };

  const handleResolveIssue = (issueId: string) => {
    const updatedCritiques = critiques.filter((c) => c.id !== issueId);
    onUpdateVenture({
      ...venture,
      critique: updatedCritiques,
      criticStatus: updatedCritiques.length === 0 ? 'investor_ready' : 'issues_found',
      lastUpdated: 'Just now'
    });
    setResolvingIssueId(null);
    setEvidenceNote('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E7DFD5]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF0E4] border border-[#E9D5C0] text-xs font-semibold text-[#883607] mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#D96B27]" />
            <span>Unsparing Institutional Due Diligence</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#191716] font-bold">
            VC Critic for {venture.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E665E] mt-1">
            Challenge weak assumptions, defensibility gaps, and missing evidence before entering the boardroom.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-run-vc-critic"
            onClick={handleRunCritic}
            disabled={isRunningCritic}
            className="px-5 py-2.5 rounded-md text-xs font-semibold text-white bg-[#D96B27] hover:bg-[#C25A19] transition-all flex items-center gap-2 shadow-xs"
          >
            {isRunningCritic ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Pitch Rigor...</span>
              </>
            ) : (
              <>
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Challenge My Pitch</span>
              </>
            )}
          </button>

          <button
            onClick={onNavigateToStudio}
            className="px-4 py-2.5 rounded-md text-xs font-medium text-[#3D3731] bg-white border border-[#DDD5C9] hover:bg-[#F8F4EE] transition-colors"
          >
            Return to Studio
          </button>
        </div>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setFilterSeverity('All')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterSeverity === 'All'
              ? 'bg-white border-[#191716] ring-1 ring-[#191716]'
              : 'bg-[#FAF8F5] border-[#E8DFD5] hover:bg-white'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-[#7A7167]">Total Issues</div>
          <div className="font-serif text-2xl font-bold text-[#191716] mt-1">{critiques.length}</div>
        </button>

        <button
          onClick={() => setFilterSeverity('Critical')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterSeverity === 'Critical'
              ? 'bg-white border-red-600 ring-1 ring-red-600'
              : 'bg-[#FEF2F2] border-[#FCDADA] hover:bg-white'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-red-700 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Critical
          </div>
          <div className="font-serif text-2xl font-bold text-red-800 mt-1">{criticalCount}</div>
        </button>

        <button
          onClick={() => setFilterSeverity('Warning')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterSeverity === 'Warning'
              ? 'bg-white border-amber-600 ring-1 ring-amber-600'
              : 'bg-[#FFFBEB] border-[#FDE68A] hover:bg-white'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-amber-700 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> Warning
          </div>
          <div className="font-serif text-2xl font-bold text-amber-800 mt-1">{warningCount}</div>
        </button>

        <button
          onClick={() => setFilterSeverity('Suggestion')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filterSeverity === 'Suggestion'
              ? 'bg-white border-blue-600 ring-1 ring-blue-600'
              : 'bg-[#F0F9FF] border-[#BAE6FD] hover:bg-white'
          }`}
        >
          <div className="text-[10px] uppercase font-bold text-blue-700 flex items-center gap-1">
            <Info className="w-3 h-3" /> Suggestions
          </div>
          <div className="font-serif text-2xl font-bold text-blue-800 mt-1">{suggestionCount}</div>
        </button>
      </div>

      {/* Critiques List */}
      <div className="space-y-4">
        {filteredCritiques.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#E7DFD5] shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-serif text-2xl text-[#191716] font-bold">No active issues found</h3>
            <p className="text-xs text-[#6B635A] max-w-md mx-auto mt-1 mb-6">
              {critiques.length === 0
                ? 'Click "Challenge My Pitch" above to run an unsparing institutional audit on your pitch claims and unit economics.'
                : 'All issues for this severity category have been resolved or mitigated.'}
            </p>
            {critiques.length === 0 && (
              <button
                onClick={handleRunCritic}
                className="px-5 py-2.5 rounded-md text-xs font-semibold text-white bg-[#D96B27] hover:bg-[#C25A19]"
              >
                Run VC Critic Audit
              </button>
            )}
          </div>
        ) : (
          filteredCritiques.map((issue) => {
            const isCritical = issue.severity === 'Critical';
            const isWarning = issue.severity === 'Warning';
            const isResolving = resolvingIssueId === issue.id;

            return (
              <div
                key={issue.id}
                className={`bg-white rounded-xl border p-6 shadow-xs transition-all ${
                  isCritical
                    ? 'border-red-200 hover:border-red-300'
                    : isWarning
                    ? 'border-amber-200 hover:border-amber-300'
                    : 'border-[#E2DAD0] hover:border-[#D0C4B6]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                        isCritical
                          ? 'bg-red-100 text-red-800'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {issue.severity}
                    </span>
                    <span className="text-xs font-medium text-[#7A7167] bg-[#F4EFE7] px-2 py-0.5 rounded">
                      {issue.category}
                    </span>
                  </div>

                  <span className="text-[11px] text-[#91877C] font-mono">
                    Slide {issue.slideNumber ? `0${issue.slideNumber}` : 'General'}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#191716] mb-2">{issue.title || issue.problem}</h3>

                {issue.whyItMatters && (
                  <p className="text-xs font-medium text-[#736A61] italic mb-2">
                    Why it matters: {issue.whyItMatters}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[#473F38] leading-relaxed mb-4">
                  {issue.critique || issue.problem}
                </p>

                <div className="bg-[#FAF7F2] border border-[#ECE3D7] rounded-lg p-3.5 mb-4 text-xs">
                  <div className="text-[10px] uppercase font-bold text-[#883607] tracking-wide mb-1">
                    VC Partner Recommendation
                  </div>
                  <p className="text-[#3D3631] leading-relaxed font-sans">
                    {issue.recommendation || issue.suggestedImprovement}
                  </p>
                </div>

                {/* Inline Resolve / Add Evidence Drawer */}
                {isResolving ? (
                  <div className="pt-3 border-t border-[#EFE7DC] animate-in fade-in">
                    <label className="block text-xs font-semibold text-[#191716] mb-1.5">
                      Add Evidence or Mitigation Note
                    </label>
                    <textarea
                      rows={2}
                      value={evidenceNote}
                      onChange={(e) => setEvidenceNote(e.target.value)}
                      placeholder="e.g. Completed 14-day concierge pilot at Dorm A with 88 orders and zero late deliveries..."
                      className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#D9D1C5] rounded-md focus:outline-hidden focus:border-[#D96B27] mb-2.5"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveIssue(issue.id)}
                        className="px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-[#191716] hover:bg-[#332E2A] transition-colors"
                      >
                        Mark as Addressed
                      </button>
                      <button
                        onClick={() => setResolvingIssueId(null)}
                        className="px-3 py-1.5 rounded text-xs text-[#7A7167] hover:bg-[#EFE9DF]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-3 border-t border-[#EFE7DC]">
                    <span className="text-[11px] text-[#8C8277]">
                      Impact: Affects investor conviction during seed due diligence.
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setResolvingIssueId(issue.id);
                          setEvidenceNote('');
                        }}
                        className="text-xs font-semibold text-[#D96B27] hover:text-[#B24E12] transition-colors px-2 py-1"
                      >
                        Add Evidence & Resolve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
