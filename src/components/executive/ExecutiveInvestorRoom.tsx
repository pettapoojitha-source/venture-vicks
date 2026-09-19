import { useState } from 'react';
import { Venture, InvestorQuestion, PracticeEvaluation } from '../../types';
import { evaluatePracticeAnswerApi } from '../../lib/api';
import { 
  HelpCircle, 
  Terminal, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Check,
  Cpu
} from 'lucide-react';

interface ExecutiveInvestorRoomProps {
  venture: Venture;
  onUpdateVenture: (updated: Venture) => void;
}

export function ExecutiveInvestorRoom({
  venture,
  onUpdateVenture
}: ExecutiveInvestorRoomProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    venture.investorQuestions?.[0]?.id || '1'
  );
  const [answerInput, setAnswerInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<PracticeEvaluation | null>(null);

  const questions = venture.investorQuestions || [];
  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) || questions[0];

  const categories = ['all', ...new Set(questions.map((q) => q.category))];

  const filteredQuestions = questions.filter((q) => {
    if (activeCategory === 'all') return true;
    return q.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const handleSelectQuestion = (q: InvestorQuestion) => {
    setSelectedQuestionId(q.id);
    setAnswerInput(q.founderAnswer || q.userAnswer || q.suggestedAnswer || '');
    setEvaluation(q.evaluation || null);
  };

  const handleEvaluateAnswer = async () => {
    if (!selectedQuestion || !answerInput.trim()) return;
    setIsEvaluating(true);
    try {
      const evalResult = await evaluatePracticeAnswerApi(
        selectedQuestion.question,
        answerInput,
        venture.questionnaire
      );
      setEvaluation(evalResult);

      // Save into question
      const updatedQuestions = questions.map((q) => {
        if (q.id === selectedQuestion.id) {
          return {
            ...q,
            founderAnswer: answerInput,
            userAnswer: answerInput,
            evaluation: evalResult,
            evidenceCheck: 'Verified Fact'
          };
        }
        return q;
      });

      onUpdateVenture({
        ...venture,
        investorQuestions: updatedQuestions,
        lastUpdated: 'Just now'
      });
    } catch (err) {
      console.warn('Evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#10131E] border border-[#1E2536] p-6 rounded-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider font-bold">
                PARTNER SPARRING TERMINAL
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white">
              INVESTOR OBJECTION ARENA
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
              Test your defenses against aggressive questions before sitting across from partners.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1.5 rounded-lg border border-[#00E5FF]/20">
              {questions.length} PARTNER PROMPTS ACTIVE
            </span>
          </div>
        </div>

        {/* Dual Pane Layout: Left Question Roster, Right Sparring Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Questions List (Col 1-5) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-mono capitalize shrink-0 transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#1D2538] text-[#00E5FF] border border-[#00E5FF]/40 font-bold'
                      : 'bg-[#10131D] text-slate-400 hover:text-white border border-[#1E2434]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Questions Roster */}
            <div className="space-y-2">
              {filteredQuestions.map((q) => {
                const isSelected = q.id === selectedQuestionId;
                const hasAnswer = Boolean(q.founderAnswer || q.userAnswer);

                return (
                  <button
                    key={q.id}
                    onClick={() => handleSelectQuestion(q)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#161C2C] border-[#00E5FF]/60 shadow-lg shadow-[#00E5FF]/5'
                        : 'bg-[#10131E] border-[#1E2536] hover:bg-[#141824] hover:border-[#2A344A]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-[#00E5FF] px-2 py-0.5 rounded bg-[#090A0F] border border-[#1F273A]">
                        {q.category}
                      </span>
                      {hasAnswer ? (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>DEFENSE RECORDED</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-amber-400">UNTESTED</span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-white leading-relaxed">
                      {q.question}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Sparring Console & Evaluation (Col 6-12) */}
          <div className="lg:col-span-7 space-y-4">
            {selectedQuestion ? (
              <div className="p-6 rounded-2xl bg-[#10131E] border border-[#1E2536] space-y-5">
                
                {/* Active Question Prompt */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                      General Partner Scrutiny
                    </span>
                    <span className="text-xs font-mono text-[#00E5FF]">
                      {selectedQuestion.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-relaxed font-mono">
                    "{selectedQuestion.question}"
                  </h3>
                </div>

                {/* Founder Defense Input Area */}
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs font-mono text-slate-400">
                    <span>Your Defense (Verifiable Facts & Operational Logic):</span>
                    <span className="text-slate-500">Press evaluate to test credibility</span>
                  </div>

                  <textarea
                    rows={4}
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                    placeholder="Enter your concise, fact-grounded response to the partner..."
                    className="w-full bg-[#151926] border border-[#252F44] rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#00E5FF] leading-relaxed"
                  />

                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={isEvaluating || !answerInput.trim()}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#00E5FF] to-emerald-400 text-[#090A0F] font-mono font-bold text-xs flex items-center gap-1.5 transition-all hover:brightness-110 disabled:opacity-50"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
                      <span>{isEvaluating ? 'Testing Credibility...' : 'Score Answer Credibility'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Credibility Evaluation Output */}
                {evaluation && (
                  <div className="p-5 rounded-xl bg-[#0D1017] border border-[#1E2536] space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1A202F]">
                      <span className="text-[#00E5FF] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        AI EVALUATION SUMMARY
                      </span>
                      <span className="text-[10px] text-slate-400">PARTNER PERSPECTIVE</span>
                    </div>

                    {evaluation.strong && (
                      <div className="space-y-1">
                        <span className="text-emerald-400 block font-bold">Convincing Points:</span>
                        <p className="text-slate-300 font-sans text-xs">{evaluation.strong}</p>
                      </div>
                    )}

                    {evaluation.missingEvidence && (
                      <div className="space-y-1">
                        <span className="text-amber-400 block font-bold">Unverified Assumptions:</span>
                        <p className="text-slate-300 font-sans text-xs">{evaluation.missingEvidence}</p>
                      </div>
                    )}

                    {evaluation.howToImprove && (
                      <div className="space-y-1 pt-2 border-t border-[#181E2C]">
                        <span className="text-[#00E5FF] block font-bold">Partner Defense Recommendation:</span>
                        <p className="text-slate-300 font-sans text-xs">{evaluation.howToImprove}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 font-mono">
                Select a question from the left panel to begin defense rehearsal.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
