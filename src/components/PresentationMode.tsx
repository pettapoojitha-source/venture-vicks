import { useState, useEffect } from 'react';
import { Venture, PitchSlide } from '../types';
import { ChevronLeft, ChevronRight, X, Maximize, Flame, ArrowRight } from 'lucide-react';

interface PresentationModeProps {
  venture: Venture;
  onExit: () => void;
}

export function PresentationMode({ venture, onExit }: PresentationModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slides: PitchSlide[] = venture.slides || [];
  const currentSlide: PitchSlide | undefined = slides[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onExit]);

  if (!currentSlide) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#161412] text-[#FAF8F5] flex flex-col justify-between p-6 md:p-12 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2 text-xs text-[#C7BFB5]">
          <Flame className="w-4 h-4 text-[#D96B27]" />
          <span className="font-serif font-bold text-sm tracking-wide text-white">{venture.name}</span>
          <span>•</span>
          <span className="uppercase text-[11px] tracking-wider text-[#A89F93]">
            {currentSlide.category.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#A89F93]">
            {currentIndex + 1} / {slides.length}
          </span>
          <button
            onClick={onExit}
            className="p-1.5 rounded-md text-[#C7BFB5] hover:text-white hover:bg-white/10 transition-colors"
            title="Exit Fullscreen (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center my-6">
        <div className="bg-[#FAF8F5] text-[#191716] rounded-2xl p-8 md:p-16 shadow-2xl border border-[#3E3832] relative overflow-hidden">
          {/* Slide Header */}
          <div className="flex items-center justify-between border-b border-[#E8DFD5] pb-4 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#883607]">
              {currentSlide.category.replace('_', ' ')}
            </span>
            <span className="text-xs font-mono text-[#8C8379]">
              0{currentSlide.slideNumber} of {slides.length}
            </span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#191716] mb-3">
            {currentSlide.title}
          </h1>

          <p className="font-serif italic text-base sm:text-xl text-[#D96B27] mb-8 leading-relaxed">
            {currentSlide.headline || currentSlide.subtitle}
          </p>

          {/* Content & Thesis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 space-y-4">
              <ul className="space-y-3.5">
                {currentSlide.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#2E2824] leading-relaxed">
                    <span className="w-2 h-2 rounded-full bg-[#D96B27] shrink-0 mt-2"></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Box */}
            <div className="md:col-span-5 bg-[#F4EFE7] border border-[#E0D7CC] rounded-xl p-6">
              {currentSlide.category === 'market_opportunity' ? (
                <div className="space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#736B62]">
                    Verified Beachhead Sizing
                  </div>
                  <div className="bg-white p-3 rounded-md border border-[#DDD5C9]">
                    <div className="text-[10px] text-[#8C8379]">Addressable Campuses</div>
                    <div className="font-serif text-xl font-bold text-[#191716]">15 Launch Campuses</div>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-[#DDD5C9]">
                    <div className="text-[10px] text-[#8C8379]">Average Annual Need</div>
                    <div className="font-serif text-xl font-bold text-[#D96B27]">$75 / Year</div>
                  </div>
                </div>
              ) : currentSlide.category === 'business_model' ? (
                <div className="space-y-2 text-xs font-mono">
                  <div className="text-[10px] font-bold uppercase tracking-wider font-sans text-[#736B62] mb-1">
                    Unit Margin Structure
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#DDD5C9] flex justify-between">
                    <span>Average Student Ticket</span>
                    <span className="font-bold text-[#166534]">$4.90</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-[#DDD5C9] flex justify-between">
                    <span>Variable Production</span>
                    <span className="text-[#9A3412]">-$2.47</span>
                  </div>
                  <div className="bg-[#FAF0E4] p-2.5 rounded border border-[#E9D5C0] flex justify-between font-bold text-[#883607]">
                    <span>Contribution Margin</span>
                    <span>49.6%</span>
                  </div>
                </div>
              ) : currentSlide.category === 'funding' ? (
                <div className="space-y-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#736B62]">
                    Capital Deployment
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-mono">
                      <span>Product Development</span>
                      <strong>45%</strong>
                    </div>
                    <div className="w-full bg-[#E5DDD2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#D96B27] h-full w-[45%]"></div>
                    </div>
                    <div className="flex justify-between font-mono pt-1">
                      <span>Operations & Delivery</span>
                      <strong>30%</strong>
                    </div>
                    <div className="w-full bg-[#E5DDD2] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#191716] h-full w-[30%]"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#736B62]">
                    Investor Review Standard
                  </div>
                  <p className="text-xs text-[#524B43] leading-relaxed">
                    All assumptions presented here are tracked in the Venture Wicks diligence room.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Slide Footer */}
          <div className="border-t border-[#E8DFD5] pt-4 mt-8 flex items-center justify-between text-xs text-[#8C8379]">
            <span>{venture.name} Confidential</span>
            <span>Use Left / Right Arrows to navigate</span>
          </div>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="flex items-center justify-center gap-6 opacity-70 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors text-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex ? 'w-6 bg-[#D96B27]' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1))}
          disabled={currentIndex === slides.length - 1}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-colors text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
