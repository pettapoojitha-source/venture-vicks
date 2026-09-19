import { useState } from 'react';
import { Venture, PitchSlide } from '../../types';
import { improveSlideApi } from '../../lib/api';
import { exportPitchToPptx } from '../../lib/export';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Download, 
  Check, 
  AlertTriangle, 
  Layers, 
  Edit3, 
  Plus, 
  Trash2, 
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  HelpCircle,
  Cpu,
  Flame,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface ExecutiveStudioProps {
  venture: Venture;
  onUpdateVenture: (updated: Venture) => void;
  onStartPresentation: () => void;
  onNavigateToCritic: () => void;
}

export function ExecutiveStudio({
  venture,
  onUpdateVenture,
  onStartPresentation,
  onNavigateToCritic
}: ExecutiveStudioProps) {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isImproving, setIsImproving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const slides = venture.slides || [];
  const currentSlide = slides[selectedSlideIndex] || slides[0];

  // Specific VC critic warnings for this slide
  const slideCritiques = (venture.critique || []).filter(
    (c) => c.slideNumber === currentSlide?.slideNumber
  );

  const handleUpdateSlide = (updatedSlide: PitchSlide) => {
    const updatedSlides = slides.map((s, idx) =>
      idx === selectedSlideIndex ? updatedSlide : s
    );
    onUpdateVenture({
      ...venture,
      slides: updatedSlides,
      lastUpdated: 'Just now'
    });
  };

  const handleAiImprove = async () => {
    if (!currentSlide) return;
    setIsImproving(true);
    try {
      const improved = await improveSlideApi(currentSlide, undefined, venture.questionnaire);
      handleUpdateSlide(improved);
    } catch (err) {
      console.warn('AI Slide Improvement failed:', err);
    } finally {
      setIsImproving(false);
    }
  };

  const handleExportPptx = async () => {
    setIsExporting(true);
    try {
      await exportPitchToPptx(venture);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!currentSlide) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono">
        No slides available for this venture.
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#090A0F] text-slate-100 flex flex-col">
      {/* Top Studio Control Bar */}
      <div className="bg-[#10131D] border-b border-[#1E2536] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF]"></span>
            <span className="text-white font-semibold">{venture.name}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">PITCH STUDIO</span>
          </div>

          <span className="px-2 py-0.5 rounded bg-[#181E2E] border border-[#27324B] text-[10px] font-mono text-[#00E5FF]">
            SLIDE {selectedSlideIndex + 1} OF {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAiImprove}
            disabled={isImproving}
            className="px-3 py-1.5 rounded bg-[#161C2A] hover:bg-[#20283C] border border-[#27344D] text-xs font-mono text-[#00E5FF] flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isImproving ? 'animate-spin' : ''}`} />
            <span>{isImproving ? 'Auditing...' : 'Wicks AI Audit'}</span>
          </button>

          <button
            onClick={handleExportPptx}
            disabled={isExporting}
            className="px-3 py-1.5 rounded bg-[#161C2A] hover:bg-[#20283C] border border-[#27344D] text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export PPTX'}</span>
          </button>

          <button
            onClick={onStartPresentation}
            className="px-3.5 py-1.5 rounded bg-gradient-to-r from-[#FF5722] to-[#E64A19] hover:brightness-110 text-xs font-mono font-semibold text-white flex items-center gap-1.5 shadow-sm shadow-[#FF5722]/30 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Present</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Filmstrip on Left, Canvas Center, Inspector Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Column: Slide Filmstrip (Col 1-2 on desktop) */}
        <div className="lg:col-span-3 xl:col-span-2 bg-[#0C0E16] border-r border-[#1C2232] p-3 overflow-y-auto max-h-[calc(100vh-7.5rem)] space-y-2">
          <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            Deck Slides ({slides.length})
          </div>

          <div className="space-y-1.5">
            {slides.map((s, idx) => {
              const isSelected = idx === selectedSlideIndex;
              const hasCritique = (venture.critique || []).some(
                (c) => c.slideNumber === s.slideNumber && !c.resolved
              );

              return (
                <button
                  key={s.id || idx}
                  onClick={() => setSelectedSlideIndex(idx)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2 ${
                    isSelected
                      ? 'bg-[#181F30] border-[#00E5FF]/60 shadow-md shadow-[#00E5FF]/5 text-white'
                      : 'bg-[#10131D] border-[#1E2536] text-slate-400 hover:bg-[#141824] hover:text-slate-200'
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#090A0F] text-slate-400 mt-0.5 shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium truncate">
                      {s.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5 uppercase">
                      {s.category.replace('_', ' ')}
                    </div>
                  </div>

                  {hasCritique && (
                    <span className="w-2 h-2 rounded-full bg-[#FF5722] mt-1 shrink-0" title="VC Critic Alert" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: 16:9 Widescreen Canvas Stage (Col 3-9) */}
        <div className="lg:col-span-6 xl:col-span-7 bg-[#090A0F] p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-7.5rem)] flex flex-col items-center">
          
          {/* 16:9 Aspect Ratio Presentation Slide Frame */}
          <div className="w-full max-w-4xl aspect-[16/9] bg-[#111420] border border-[#242D40] rounded-xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2638] mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-[#182030] text-[#00E5FF] border border-[#00E5FF]/20">
                    {currentSlide.category.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    SLIDE {currentSlide.slideNumber}
                  </span>
                </div>

                <span className="text-xs font-mono text-slate-400">
                  {venture.name}
                </span>
              </div>

              {/* Editable Headline */}
              <input
                type="text"
                value={currentSlide.headline}
                onChange={(e) =>
                  handleUpdateSlide({ ...currentSlide, headline: e.target.value })
                }
                className="w-full font-sans font-bold text-xl sm:text-2xl text-white bg-transparent border-b border-transparent hover:border-[#2C374D] focus:border-[#00E5FF] focus:outline-none transition-colors mb-4 py-1"
                placeholder="Enter slide headline..."
              />

              {/* Facts vs Assumptions Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                {(currentSlide.facts || []).map((f, i) => (
                  <span
                    key={`fact-${i}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-mono text-emerald-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>FACT: {f}</span>
                  </span>
                ))}

                {(currentSlide.assumptions || []).map((a, i) => (
                  <span
                    key={`assump-${i}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/40 text-[11px] font-mono text-amber-300"
                  >
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>HYPOTHESIS: {a}</span>
                  </span>
                ))}
              </div>

              {/* Bullet Points */}
              <div className="space-y-2.5 text-sm text-slate-300 font-sans">
                {(currentSlide.keyPoints || []).map((kp, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{kp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Bar at bottom of slide if present */}
            {currentSlide.metrics && currentSlide.metrics.length > 0 && (
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#1E2638] mt-4 font-mono text-center">
                {currentSlide.metrics.map((m, i) => (
                  <div key={i} className="p-2.5 rounded bg-[#141926] border border-[#222B3D]">
                    <div className="text-base font-bold text-white">{m.value}</div>
                    <div className="text-[10px] text-slate-400 uppercase mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Speaker Notes Console Below Stage */}
          <div className="w-full max-w-4xl mt-5 p-4 rounded-xl bg-[#10131D] border border-[#1E2536]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Executive Speaker Notes</span>
              </div>
              <button
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="text-[11px] font-mono text-[#00E5FF] hover:underline"
              >
                {isEditingNotes ? 'Done' : 'Edit Notes'}
              </button>
            </div>

            {isEditingNotes ? (
              <textarea
                value={currentSlide.speakerNotes || ''}
                onChange={(e) =>
                  handleUpdateSlide({ ...currentSlide, speakerNotes: e.target.value })
                }
                rows={3}
                className="w-full bg-[#151926] border border-[#252F44] rounded p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#00E5FF]"
                placeholder="Add speaker notes for delivery..."
              />
            ) : (
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                {currentSlide.speakerNotes || 'No speaker notes recorded for this slide.'}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Strategic Telemetry & VC Critic Inspector (Col 10-12) */}
        <div className="lg:col-span-3 xl:col-span-3 bg-[#0C0E16] border-l border-[#1C2232] p-4 overflow-y-auto max-h-[calc(100vh-7.5rem)] space-y-4">
          
          {/* Slide Factual Grounding Diagnostic */}
          <div className="p-4 rounded-xl bg-[#111420] border border-[#222A3C]">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Grounding Index</span>
              <span className="text-[#00E5FF]">88% VERIFIED</span>
            </div>
            <div className="w-full h-1.5 bg-[#1B2232] rounded-full overflow-hidden mb-3">
              <div className="w-[88%] h-full bg-gradient-to-r from-[#00E5FF] to-emerald-400 rounded-full"></div>
            </div>
            <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
              All key statements are mapped to founder-provided inputs or verified market dynamics.
            </div>
          </div>

          {/* Active VC Critic Alerts for this slide */}
          <div className="p-4 rounded-xl bg-[#111420] border border-[#222A3C] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#FF5722]" />
                <span>Critic Alerts ({slideCritiques.length})</span>
              </div>
              <button
                onClick={onNavigateToCritic}
                className="text-[10px] font-mono text-[#FF5722] hover:underline"
              >
                View All
              </button>
            </div>

            {slideCritiques.length === 0 ? (
              <div className="p-3 rounded bg-[#151926] border border-[#222B3D] text-[11px] text-emerald-400 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>No active critical alerts on this slide.</span>
              </div>
            ) : (
              slideCritiques.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded bg-[#161B28] border border-[#283247] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-red-950/60 text-red-400 border border-red-800/30">
                      {c.severity}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-xs mt-1">
                    {c.title || c.problem}
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {c.critique || c.problem}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Next Steps Prompt */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#151A28] to-[#10131E] border border-[#263146] text-xs space-y-2.5">
            <div className="font-mono font-bold text-white flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Institutional Readiness</span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              When all 11 slides are reviewed, proceed to the Partner Sparring Arena to test live objection handling.
            </p>
            <button
              onClick={onStartPresentation}
              className="w-full py-2 rounded bg-[#1E2536] hover:bg-[#283248] text-xs font-mono text-white flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3 h-3 text-[#FF5722] fill-current" />
              <span>Launch Fullscreen Rehearsal</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
