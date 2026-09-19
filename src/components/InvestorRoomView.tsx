import { useState } from 'react';
import { Venture, InvestorQuestion } from '../types';
import { evaluatePracticeAnswerApi } from '../lib/api';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  RefreshCw, 
  ArrowRight,
  ShieldAlert,
  Mic,
  FileQuestion,
  Flame
} from 'lucide-react';

interface InvestorRoomViewProps {
  venture: Venture;
  onUpdateVenture: (updated: Venture) => void;
  onNavigateToStudio: () => void;
}

const CATEGORIES = [
  'All',
  'Business Model',
  'Competition',
  'Traction',
  'Market Size',
  'Defensibility',
  'Unit Economics',
  'Financials',
  'Team',
  'Exit'
];

export function InvestorRoomView({
  venture,
  onUpdateVenture,
  onNavigateToStudio
}: InvestorRoomViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [practiceAnswerInput, setPracticeAnswerInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);

  const questions: InvestorQuestion[] = venture.investorQuestions || [];

  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory === 'All') return true;
    return q.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleStartPractice = (q: InvestorQuestion) => {
    setActiveQuestionId(q.id);
    setPracticeAnswerInput(q.founderAnswer || q.userAnswer || q.suggestedAnswer || '');
    setEvaluationResult(q.evaluation || null);
  };

  const handleEvaluateAnswer = async (q: InvestorQuestion) => {
    if (!practiceAnswerInput.trim()) return;
    setIsEvaluating(true);

    try {
      const evalRes = await evaluatePracticeAnswerApi(
        q.question,
        practiceAnswerInput,
        venture.questionnaire
      );
      setEvaluationResult(evalRes);

      // Save into question state
      const updatedQuestions = questions.map((item) => {
        if (item.id === q.id) {
          return {
            ...item,
            founderAnswer: practiceAnswerInput,
            userAnswer: practiceAnswerInput,
            evaluation: evalRes,
            evidenceCheck: (evalRes.credibility === 'High Credibility' || !evalRes.missingEvidence) ? 'Verified Fact' : 'Grounded Assumption'
          };
        }
        return item;
      });

      onUpdateVenture({
        ...venture,
        investorQuestions: updatedQuestions,
        lastUpdated: 'Just now'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E7DFD5]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FAF0E4] border border-[#E9D5C0] text-xs font-semibold text-[#883607] mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#D96B27]" />
            <span>Boardroom Q&A Simulator</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#191716] font-bold">
            Investor Room for {venture.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E665E] mt-1">
            Rehearse partner-level scrutiny. Answers are strictly verified against user data, never fabricated.
          </p>
        </div>

        <button
          onClick={onNavigateToStudio}
          className="px-4 py-2.5 rounded-md text-xs font-medium text-[#3D3731] bg-white border border-[#DDD5C9] hover:bg-[#F8F4EE] transition-colors"
        >
          Return to Studio
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#191716] text-white'
                : 'bg-[#FAF8F5] text-[#696158] border border-[#E5DFD7] hover:bg-[#F0EAE1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Questions + Practice Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Main Question Cards */}
        <div className={`${activeQuestionId ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          {filteredQuestions.map((q) => {
            const isActive = activeQuestionId === q.id;
            const isMissing = q.isEvidenceNeeded || q.evidenceCheck === 'Evidence Missing';

            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border p-6 transition-all ${
                  isActive
                    ? 'border-[#D96B27] ring-1 ring-[#D96B27]/20 shadow-sm'
                    : 'border-[#E5DFD7] hover:border-[#D4C8B8]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#883607] bg-[#FAF0E4] px-2 py-0.5 rounded">
                    {q.category}
                  </span>

                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      isMissing
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {q.evidenceCheck || (q.isEvidenceNeeded ? 'Evidence Needed' : 'Verified Fact')}
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#191716] mb-3">
                  “{q.question}”
                </h3>

                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#EAE2D7] text-xs text-[#423A34] mb-4 leading-relaxed">
                  <span className="font-semibold text-[#191716] block mb-1">
                    Grounded Founder Defense:
                  </span>
                  {q.founderAnswer || q.userAnswer || q.suggestedAnswer || 'No defense recorded yet. Rehearse below.'}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F2ECE3]">
                  <span className="text-[11px] text-[#8C8379]">
                    {q.evaluation ? 'Evaluated with AI' : 'Not yet practiced'}
                  </span>

                  <button
                    id={`btn-practice-${q.id}`}
                    onClick={() => handleStartPractice(q)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D96B27] hover:text-[#B24E12] transition-colors"
                  >
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{isActive ? 'Practicing Now' : 'Practice Response'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: AI Practice Evaluation Side Panel */}
        {activeQuestionId && (
          <div className="lg:col-span-5 bg-white border border-[#E2DAD0] rounded-xl p-6 shadow-sm sticky top-24 animate-in slide-in-from-right-4">
            {(() => {
              const activeQ = questions.find((q) => q.id === activeQuestionId);
              if (!activeQ) return null;

              return (
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#ECE4DA] mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#883607] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" />
                      AI Response Evaluation
                    </span>
                    <button
                      onClick={() => setActiveQuestionId(null)}
                      className="text-xs text-[#8C8379] hover:text-[#191716]"
                    >
                      Close
                    </button>
                  </div>

                  <p className="font-serif text-sm font-bold text-[#191716] mb-3 leading-snug">
                    {activeQ.question}
                  </p>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-[#524B43] mb-1">
                      Your Answer (Draft or rehearse out loud)
                    </label>
                    <textarea
                      rows={4}
                      value={practiceAnswerInput}
                      onChange={(e) => setPracticeAnswerInput(e.target.value)}
                      placeholder="Enter how you would explain this to a VC partner..."
                      className="w-full p-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded focus:outline-hidden focus:border-[#D96B27] leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={() => handleEvaluateAnswer(activeQ)}
                    disabled={isEvaluating || !practiceAnswerInput.trim()}
                    className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-[#191716] hover:bg-[#332E2A] disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xs mb-4"
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Credibility...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#E8732A]" />
                        <span>Audit My Answer</span>
                      </>
                    )}
                  </button>

                  {/* Evaluation Output */}
                  {evaluationResult && (
                    <div className="bg-[#FAF7F2] border border-[#E9E1D6] rounded-lg p-4 text-xs space-y-3 animate-in fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-[#EBE3D7]">
                        <span className="font-semibold text-[#191716]">Investor Impression</span>
                        <span className="font-mono font-bold text-[#883607] bg-[#FCECDD] px-2 py-0.5 rounded">
                          {evaluationResult.credibility}
                        </span>
                      </div>

                      <div>
                        <span className="font-semibold text-emerald-800 block mb-0.5">Strengths:</span>
                        <p className="text-[#3D3731] leading-relaxed">{evaluationResult.strengths}</p>
                      </div>

                      {evaluationResult.missingEvidence && (
                        <div>
                          <span className="font-semibold text-red-700 block mb-0.5">Missing Evidence:</span>
                          <p className="text-[#3D3731] leading-relaxed">{evaluationResult.missingEvidence}</p>
                        </div>
                      )}

                      <div>
                        <span className="font-semibold text-[#D96B27] block mb-0.5">Partner Polish:</span>
                        <p className="text-[#3D3731] italic font-serif leading-relaxed">
                          “{evaluationResult.suggestedAnswer}”
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
