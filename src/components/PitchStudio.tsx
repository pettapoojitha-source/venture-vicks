import { useState } from 'react';
import { Venture, PitchSlide } from '../types';
import { improveSlideApi } from '../lib/api';
import { exportPitchToPdf, exportPitchToPptx } from '../lib/export';
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
  FileSpreadsheet,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';

interface PitchStudioProps {
  venture: Venture;
  onUpdateVenture: (updated: Venture) => void;
  onStartPresentation: () => void;
  onNavigateToCritic: () => void;
}

export function PitchStudio({
  venture,
  onUpdateVenture,
  onStartPresentation,
  onNavigateToCritic
}: PitchStudioProps) {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isImproving, setIsImproving] = useState(false);
  const [aiInstructions, setAiInstructions] = useState('');
  const [isExportingPptx, setIsExportingPptx] = useState(false);

  const slides = venture.slides || [];
  const currentSlide: PitchSlide | undefined = slides[selectedSlideIndex];

  const updateCurrentSlide = (updatedFields: Partial<PitchSlide>) => {
    if (!currentSlide) return;
    const newSlides = [...slides];
    newSlides[selectedSlideIndex] = {
      ...currentSlide,
      ...updatedFields
    };
    onUpdateVenture({
      ...venture,
      slides: newSlides,
      lastUpdated: 'Just now'
    });
  };

  const handleImproveWithAi = async () => {
    if (!currentSlide) return;
    setIsImproving(true);
    try {
      const improved = await improveSlideApi(currentSlide, aiInstructions, venture.questionnaire);
      updateCurrentSlide(improved);
      setAiInstructions('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsImproving(false);
    }
  };

  const handleAddKeyPoint = () => {
    if (!currentSlide) return;
    updateCurrentSlide({
      keyPoints: [...currentSlide.keyPoints, 'New strategic thesis point']
    });
  };

  const handleUpdateKeyPoint = (index: number, val: string) => {
    if (!currentSlide) return;
    const updated = [...currentSlide.keyPoints];
    updated[index] = val;
    updateCurrentSlide({ keyPoints: updated });
  };

  const handleRemoveKeyPoint = (index: number) => {
    if (!currentSlide) return;
    const updated = currentSlide.keyPoints.filter((_, i) => i !== index);
    updateCurrentSlide({ keyPoints: updated });
  };

  const handleExportPdf = () => {
    exportPitchToPdf(venture);
  };

  const handleExportPptx = async () => {
    setIsExportingPptx(true);
    try {
      await exportPitchToPptx(venture);
    } catch (err) {
      console.error('PPTX export error:', err);
    } finally {
      setIsExportingPptx(false);
    }
  };

  if (!currentSlide) {
    return (
      <div className="p-12 text-center text-xs text-[#7A7167]">
        No slides generated yet. Please generate your pitch deck via the Questionnaire.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#F5F2EB] select-none">
      {/* Top Studio Toolbar */}
      <div className="h-14 px-6 bg-[#FAF8F5] border-b border-[#E5DFD7] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif font-bold text-lg text-[#191716]">{venture.name}</span>
          <span className="text-xs text-[#8A8177]">Pitch Studio</span>
          <span className="text-xs text-[#524B43] bg-[#EFE9DF] px-2 py-0.5 rounded font-mono">
            Slide {currentSlide.slideNumber} of {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-critic-jump"
            onClick={onNavigateToCritic}
            className="text-xs text-[#D96B27] hover:text-[#B24E12] font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-[#FDF4EB]"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Challenge Pitch (VC Critic)</span>
          </button>

          <button
            id="btn-present-top"
            onClick={onStartPresentation}
            className="text-xs font-semibold text-white bg-[#191716] hover:bg-[#332F2A] px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Present Mode</span>
          </button>
        </div>
      </div>

      {/* Workspace: LEFT Thumbnails | CENTER Canvas | RIGHT Editing */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Slide Thumbnails */}
        <aside className="w-56 bg-[#FAF8F5] border-r border-[#E5DFD7] overflow-y-auto p-3 flex flex-col gap-2 shrink-0">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#8A8177] px-2 py-1">
            Slide Deck (11)
          </div>
          {slides.map((slide, idx) => {
            const isSelected = idx === selectedSlideIndex;
            return (
              <button
                key={slide.id || idx}
                onClick={() => setSelectedSlideIndex(idx)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all relative ${
                  isSelected
                    ? 'bg-white border-[#D96B27] shadow-sm ring-1 ring-[#D96B27]/20'
                    : 'bg-[#F7F4EE] border-[#E8DFD4] hover:bg-white hover:border-[#D6CCC0]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#786F66] mb-1">
                  <span className="font-mono font-bold">0{slide.slideNumber}</span>
                  <span className="uppercase text-[9px] tracking-wide truncate max-w-[90px]">
                    {slide.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs font-serif font-bold text-[#191716] line-clamp-1">
                  {slide.title}
                </div>
                <div className="text-[10px] text-[#8C8379] line-clamp-1 mt-0.5">
                  {slide.headline || slide.subtitle}
                </div>
                {/* Assumption indicator dot */}
                {slide.assumptions && slide.assumptions.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D96B27] absolute bottom-2 right-2" title="Contains assumption"></span>
                )}
              </button>
            );
          })}
        </aside>

        {/* CENTER: Large Slide Canvas */}
        <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center bg-[#F3EFE8]">
          <div className="w-full max-w-4xl aspect-video bg-[#FAF8F5] border border-[#DDD5C9] rounded-xl shadow-lg p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold tracking-widest uppercase text-[#883607]">
                    Venture Wicks
                  </span>
                  <span className="text-[#CCC4BA]">•</span>
                  <span className="text-[11px] text-[#736B63] uppercase tracking-wide">
                    {currentSlide.category.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#8C8379]">
                  0{currentSlide.slideNumber} / 11
                </span>
              </div>

              {/* Title & Headline */}
              <h1 className="font-serif text-3xl md:text-4xl text-[#191716] font-bold tracking-tight mb-2">
                {currentSlide.title}
              </h1>
              <p className="text-sm md:text-base text-[#D96B27] italic font-serif mb-6 leading-relaxed">
                {currentSlide.headline || currentSlide.subtitle}
              </p>

              {/* Center Content & Dynamic Visual Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 items-start">
                {/* Bullets Thesis */}
                <div className="md:col-span-7 space-y-3">
                  <ul className="space-y-2.5">
                    {currentSlide.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs md:text-sm text-[#2D2824] leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D96B27] shrink-0 mt-2"></span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Visual Representation (Flow / Matrix / Allocation / Timeline) */}
                <div className="md:col-span-5 bg-[#F4EFE7] border border-[#E2DCD4] rounded-lg p-4">
                  {currentSlide.category === 'market_opportunity' && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[#70675E] tracking-wider mb-2">
                        Market Grounding
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="bg-white p-2.5 rounded border border-[#E2DCD4]">
                          <div className="text-[10px] text-[#8C8379]">National Macro Target</div>
                          <div className="font-serif text-lg font-bold text-[#191716]">~20M Students</div>
                        </div>
                        <div className="bg-white p-2.5 rounded border border-[#E2DCD4]">
                          <div className="text-[10px] text-[#8C8379]">Initial Beachhead Density</div>
                          <div className="font-serif text-lg font-bold text-[#D96B27]">15 Campuses</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSlide.category === 'business_model' && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[#70675E] tracking-wider mb-2">
                        Unit Economics Flow
                      </div>
                      <div className="space-y-1.5 text-[11px] font-mono">
                        <div className="bg-white p-2 rounded border border-[#E5DDD2] flex justify-between">
                          <span>Gross Customer Price</span>
                          <span className="font-bold text-[#166534]">$4.90</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-[#E5DDD2] flex justify-between">
                          <span>COGS + Fulfillment</span>
                          <span className="text-[#9A3412]">-$2.47</span>
                        </div>
                        <div className="bg-[#FAF3EA] p-2 rounded border border-[#E9D5C0] flex justify-between font-bold text-[#883607]">
                          <span>Net Contribution</span>
                          <span>$2.43 (49.6%)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSlide.category === 'funding' && (
                    <div>
                      <div className="text-[10px] font-bold uppercase text-[#70675E] tracking-wider mb-2">
                        Capital Allocation
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <span>Software Core</span>
                          <span className="font-bold font-mono">45%</span>
                        </div>
                        <div className="w-full bg-[#E5DDD2] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#D96B27] h-full w-[45%]"></div>
                        </div>
                        <div className="flex justify-between items-center text-[11px] pt-1">
                          <span>Pilot Operations</span>
                          <span className="font-bold font-mono">30%</span>
                        </div>
                        <div className="w-full bg-[#E5DDD2] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#191716] h-full w-[30%]"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fallback Fact & Assumption Audit Box */}
                  {currentSlide.category !== 'market_opportunity' &&
                    currentSlide.category !== 'business_model' &&
                    currentSlide.category !== 'funding' && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase text-[#70675E] tracking-wider border-b border-[#DDD5C9] pb-1">
                          Slide Validation Audit
                        </div>
                        {currentSlide.facts && currentSlide.facts.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                              Verified Facts
                            </div>
                            <p className="text-[11px] text-[#423C37]">{currentSlide.facts.join('; ')}</p>
                          </div>
                        )}
                        {currentSlide.assumptions && currentSlide.assumptions.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-[#9A3412] uppercase tracking-wide">
                              Assumptions
                            </div>
                            <p className="text-[11px] text-[#423C37]">{currentSlide.assumptions.join('; ')}</p>
                          </div>
                        )}
                        {currentSlide.evidenceNeeded && currentSlide.evidenceNeeded.length > 0 && (
                          <div>
                            <div className="text-[10px] font-bold text-red-700 uppercase tracking-wide">
                              Evidence Needed
                            </div>
                            <p className="text-[11px] text-[#423C37]">{currentSlide.evidenceNeeded.join('; ')}</p>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="border-t border-[#E8DFD5] pt-3 flex items-center justify-between text-[11px] text-[#8C8379]">
              <span>{venture.name} • Confidential Investor Presentation</span>
              <span className="italic">Audited with Venture Wicks</span>
            </div>
          </div>
        </main>

        {/* RIGHT: Editing & AI Panel */}
        <aside className="w-80 bg-[#FAF8F5] border-l border-[#E5DFD7] overflow-y-auto p-4 flex flex-col gap-5 shrink-0">
          <div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-[#8A8177] mb-2 flex items-center justify-between">
              <span>Slide Editor</span>
              <Edit3 className="w-3.5 h-3.5 text-[#A1988D]" />
            </div>

            {/* Title edit */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#544C44] mb-1">Slide Title</label>
                <input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => updateCurrentSlide({ title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD5C9] rounded focus:border-[#D96B27] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#544C44] mb-1">Headline Thesis</label>
                <textarea
                  rows={2}
                  value={currentSlide.headline || currentSlide.subtitle}
                  onChange={(e) => updateCurrentSlide({ headline: e.target.value, subtitle: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD5C9] rounded focus:border-[#D96B27] focus:outline-hidden"
                />
              </div>

              {/* Bullet Points */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-semibold text-[#544C44]">Key Points ({currentSlide.keyPoints.length})</label>
                  <button
                    onClick={handleAddKeyPoint}
                    className="text-[10px] text-[#D96B27] hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add Point
                  </button>
                </div>
                <div className="space-y-1.5">
                  {currentSlide.keyPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <textarea
                        rows={2}
                        value={pt}
                        onChange={(e) => handleUpdateKeyPoint(i, e.target.value)}
                        className="flex-1 p-2 text-xs bg-white border border-[#DDD5C9] rounded focus:border-[#D96B27] focus:outline-hidden"
                      />
                      <button
                        onClick={() => handleRemoveKeyPoint(i)}
                        className="p-1 text-[#A1988D] hover:text-red-600 mt-1"
                        title="Delete point"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speaker notes */}
              <div>
                <label className="block text-[11px] font-semibold text-[#544C44] mb-1">Speaker Notes</label>
                <textarea
                  rows={3}
                  value={currentSlide.speakerNotes || ''}
                  onChange={(e) => updateCurrentSlide({ speakerNotes: e.target.value })}
                  placeholder="What you should say to investors during this slide..."
                  className="w-full p-2 text-xs bg-white border border-[#DDD5C9] rounded focus:border-[#D96B27] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Improve with AI Section */}
          <div className="bg-[#FAF0E4] border border-[#E8D4C0] rounded-lg p-3.5 text-xs space-y-2.5">
            <div className="font-semibold text-[#883607] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>Improve With AI</span>
            </div>
            <p className="text-[11px] text-[#6B5749] leading-relaxed">
              Refines headline punch and bullet clarity while strictly preserving factual accuracy.
            </p>
            <input
              type="text"
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              placeholder="e.g. Make it more concise for VCs"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#DFCBB6] rounded focus:outline-hidden focus:border-[#D96B27]"
            />
            <button
              onClick={handleImproveWithAi}
              disabled={isImproving}
              className="w-full py-2 px-3 rounded-md text-xs font-semibold text-white bg-[#D96B27] hover:bg-[#C25A19] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              {isImproving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Refining Slide...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Polish Slide Copy</span>
                </>
              )}
            </button>
          </div>
        </aside>
      </div>

      {/* BOTTOM BAR: Previous | Next | Present | Export */}
      <footer className="h-16 px-6 bg-[#FAF8F5] border-t border-[#E5DFD7] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            id="btn-prev-slide"
            disabled={selectedSlideIndex === 0}
            onClick={() => setSelectedSlideIndex((prev) => Math.max(0, prev - 1))}
            className="px-3.5 py-2 rounded-md text-xs font-semibold text-[#3D3731] bg-[#EFE9DF] hover:bg-[#E5DDD0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button
            id="btn-next-slide"
            disabled={selectedSlideIndex === slides.length - 1}
            onClick={() => setSelectedSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
            className="px-3.5 py-2 rounded-md text-xs font-semibold text-[#3D3731] bg-[#EFE9DF] hover:bg-[#E5DDD0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-export-pdf"
            onClick={handleExportPdf}
            className="px-3.5 py-2 rounded-md text-xs font-medium text-[#3D3731] bg-white border border-[#DDD5C9] hover:bg-[#F7F3EB] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#D96B27]" />
            <span>Export PDF</span>
          </button>

          <button
            id="btn-export-pptx"
            onClick={handleExportPptx}
            disabled={isExportingPptx}
            className="px-3.5 py-2 rounded-md text-xs font-medium text-[#3D3731] bg-white border border-[#DDD5C9] hover:bg-[#F7F3EB] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            {isExportingPptx ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#D96B27]" />
            )}
            <span>Export PPTX</span>
          </button>

          <button
            id="btn-present-bottom"
            onClick={onStartPresentation}
            className="px-5 py-2 rounded-md text-xs font-semibold text-white bg-[#191716] hover:bg-[#332F2A] transition-colors flex items-center gap-2 shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#D96B27]" />
            <span>Present Online</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
