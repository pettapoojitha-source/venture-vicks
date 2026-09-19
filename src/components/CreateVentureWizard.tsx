import { useState } from 'react';
import { QuestionnaireData, VentureStage, PitchSlide, AISuggestion } from '../types';
import { askQuestionAssist, generatePitchApi } from '../lib/api';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  X, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  Flame,
  FileCheck2,
  RefreshCw,
  Edit2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateVentureWizardProps {
  initialData?: Partial<QuestionnaireData>;
  onComplete: (questionnaire: QuestionnaireData, generatedSlides: PitchSlide[]) => void;
  onCancel: () => void;
}

export function CreateVentureWizard({ initialData, onComplete, onCancel }: CreateVentureWizardProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [generationError, setGenerationError] = useState('');

  // Form State
  const [formData, setFormData] = useState<QuestionnaireData>({
    ventureName: initialData?.ventureName || '',
    problem: initialData?.problem || '',
    solution: initialData?.solution || '',
    targetCustomers: initialData?.targetCustomers || '',
    whoBenefits: initialData?.whoBenefits || '',
    industry: initialData?.industry || '',
    marketOpportunity: initialData?.marketOpportunity || '',
    ventureStage: initialData?.ventureStage || 'Idea Stage',
    businessModel: initialData?.businessModel || '',
    competition: initialData?.competition || '',
    differentiation: initialData?.differentiation || '',
    goToMarket: initialData?.goToMarket || '',
    currentTraction: initialData?.currentTraction || '',
    financialModel: initialData?.financialModel || '',
    fundingRequirement: initialData?.fundingRequirement || '',
    useOfFunds: initialData?.useOfFunds || ''
  });

  // AI Assistance Side Panel State
  const [activeAiField, setActiveAiField] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<AISuggestion | null>(null);
  const [isEditingSuggestion, setIsEditingSuggestion] = useState(false);
  const [editableSuggestionText, setEditableSuggestionText] = useState('');

  const updateField = (field: keyof QuestionnaireData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAskWicksAi = async (field: keyof QuestionnaireData) => {
    setActiveAiField(field);
    setAiLoading(true);
    setIsEditingSuggestion(false);

    try {
      const res = await askQuestionAssist(field, formData[field], formData);
      setAiSuggestion({
        field,
        userFacts: res.userFacts || [],
        suggestion: res.suggestion || '',
        assumptions: res.assumptions || [],
        evidenceNeeded: res.evidenceNeeded || []
      });
      setEditableSuggestionText(res.suggestion || '');
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseSuggestion = () => {
    if (!aiSuggestion || !activeAiField) return;
    const textToUse = isEditingSuggestion ? editableSuggestionText : aiSuggestion.suggestion;
    updateField(activeAiField as keyof QuestionnaireData, textToUse);
    setActiveAiField(null);
    setAiSuggestion(null);
  };

  const handleDismissSuggestion = () => {
    setActiveAiField(null);
    setAiSuggestion(null);
    setIsEditingSuggestion(false);
  };

  // Step 5: Final Pitch Generation
  const handleGeneratePitch = async () => {
    setIsGeneratingPitch(true);
    setGenerationError('');

    try {
      const slides = await generatePitchApi(formData);
      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D96B27', '#E8732A', '#191716', '#F5ECE0']
        });
      } catch {
        // ignore confetti errors in sandbox
      }
      onComplete(formData, slides);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'Pitch generation encountered an error. Retrying with deterministic engine...');
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  // Step names
  const steps = [
    { num: 1, label: 'Idea' },
    { num: 2, label: 'Market' },
    { num: 3, label: 'Business' },
    { num: 4, label: 'Evidence' },
    { num: 5, label: 'Pitch' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E7DFD5]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#D96B27] font-semibold">
            Venture Setup Questionnaire
          </span>
          <h1 className="font-serif text-3xl text-[#191716] font-bold mt-1">
            {formData.ventureName ? formData.ventureName : 'New Venture Questionnaire'}
          </h1>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-[#736B63] hover:text-[#191716] font-medium px-3 py-1.5 rounded-md hover:bg-[#EFE9DF] transition-colors"
        >
          Cancel & Exit
        </button>
      </div>

      {/* Progress Bar (01 Idea → 02 Market → 03 Business → 04 Evidence → 05 Pitch) */}
      <div className="mb-10 max-w-3xl">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => {
                    if (currentStep > s.num) setCurrentStep(s.num as any);
                  }}
                  disabled={currentStep < s.num}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-[#D96B27]'
                      : isCompleted
                      ? 'text-[#191716] cursor-pointer'
                      : 'text-[#9C9387] cursor-not-allowed'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                      isActive
                        ? 'bg-[#D96B27] text-white'
                        : isCompleted
                        ? 'bg-[#191716] text-white'
                        : 'bg-[#E7DFD5] text-[#736B63]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : `0${s.num}`}
                  </span>
                  <span className="hidden sm:inline-block">{s.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-2 ${
                      currentStep > s.num ? 'bg-[#191716]' : 'bg-[#E7DFD5]'
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Questionnaire + AI Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center: Questionnaire Questions */}
        <div className={`${activeAiField ? 'lg:col-span-7' : 'lg:col-span-8'} bg-white border border-[#E7DFD5] rounded-xl p-8 shadow-xs transition-all`}>
          {/* STEP 1: IDEA */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-[#F0EAE1] pb-4 mb-6">
                <h2 className="font-serif text-2xl text-[#191716] font-bold">Step 1 — The Idea</h2>
                <p className="text-xs text-[#6B635A] mt-1">Define the fundamental spark and core value creation.</p>
              </div>

              {/* 1. Venture Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-1.5">
                  1. Venture Name *
                </label>
                <input
                  id="field-venture-name"
                  type="text"
                  required
                  value={formData.ventureName}
                  onChange={(e) => updateField('ventureName', e.target.value)}
                  placeholder="e.g. QuickPrint"
                  className="w-full px-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27]"
                />
              </div>

              {/* 2. Problem */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D3731]">
                    2. Problem Statement *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAskWicksAi('problem')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D96B27] hover:text-[#9A3412]"
                  >
                    <Sparkles className="w-3 h-3" />
                    Need help? Ask Wicks AI
                  </button>
                </div>
                <p className="text-[11px] text-[#786E65] mb-2">What acute frustration or bottleneck do users currently face?</p>
                <textarea
                  id="field-problem"
                  rows={3}
                  value={formData.problem}
                  onChange={(e) => updateField('problem', e.target.value)}
                  placeholder="e.g. Students face long queues and broken printers right before assignment deadlines..."
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27] leading-relaxed"
                />
              </div>

              {/* 3. Solution */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D3731]">
                    3. Solution *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAskWicksAi('solution')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D96B27] hover:text-[#9A3412]"
                  >
                    <Sparkles className="w-3 h-3" />
                    Need help? Ask Wicks AI
                  </button>
                </div>
                <p className="text-[11px] text-[#786E65] mb-2">How does your product eliminate this friction cleanly?</p>
                <textarea
                  id="field-solution"
                  rows={3}
                  value={formData.solution}
                  onChange={(e) => updateField('solution', e.target.value)}
                  placeholder="e.g. A hyperlocal on-demand mobile platform that delivers bound prints directly to dorms in 45 minutes..."
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30 focus:border-[#D96B27] leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* STEP 2: MARKET */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-[#F0EAE1] pb-4 mb-6">
                <h2 className="font-serif text-2xl text-[#191716] font-bold">Step 2 — The Market</h2>
                <p className="text-xs text-[#6B635A] mt-1">Ground your customers and industry scope in reality.</p>
              </div>

              {/* 4. Target Customers */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D3731]">
                    4. Target Customers
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAskWicksAi('targetCustomers')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D96B27] hover:text-[#9A3412]"
                  >
                    <Sparkles className="w-3 h-3" />
                    Need help? Ask Wicks AI
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.targetCustomers}
                  onChange={(e) => updateField('targetCustomers', e.target.value)}
                  placeholder="e.g. Undergraduate and graduate students living in campus residence halls..."
                  className="w-full px-4 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>

              {/* 5. Who Benefits */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-1.5">
                  5. Who Benefits
                </label>
                <input
                  type="text"
                  value={formData.whoBenefits}
                  onChange={(e) => updateField('whoBenefits', e.target.value)}
                  placeholder="e.g. Students save 40 minutes per deadline; local shops get off-peak print volume."
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>

              {/* 6. Industry */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-1.5">
                  6. Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => updateField('industry', e.target.value)}
                  placeholder="e.g. Campus On-Demand Services & EdTech"
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>

              {/* 7. Market Opportunity */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D3731]">
                    7. Market Opportunity
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAskWicksAi('marketOpportunity')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D96B27] hover:text-[#9A3412]"
                  >
                    <Sparkles className="w-3 h-3" />
                    Need help? Ask Wicks AI
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.marketOpportunity}
                  onChange={(e) => updateField('marketOpportunity', e.target.value)}
                  placeholder="e.g. 20M college students across North America submit periodic physical reports..."
                  className="w-full px-4 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>
            </div>
          )}

          {/* STEP 3: BUSINESS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-[#F0EAE1] pb-4 mb-6">
                <h2 className="font-serif text-2xl text-[#191716] font-bold">Step 3 — The Business</h2>
                <p className="text-xs text-[#6B635A] mt-1">Structure the commercial model and competitive defensibility.</p>
              </div>

              {/* 8. Venture Stage */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-2">
                  8. Venture Stage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Idea Stage', 'Prototype / MVP', 'Early Traction', 'Growth'] as VentureStage[]).map((stg) => (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => updateField('ventureStage', stg)}
                      className={`py-2 px-3 text-xs rounded-md border text-center transition-all ${
                        formData.ventureStage === stg
                          ? 'bg-[#191716] text-white border-[#191716] font-semibold'
                          : 'bg-[#FAF8F5] text-[#5C544C] border-[#DDD5C9] hover:bg-[#F3ECE1]'
                      }`}
                    >
                      {stg}
                    </button>
                  ))}
                </div>
              </div>

              {/* 9. Business Model */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-1.5">
                  9. Business Model
                </label>
                <textarea
                  rows={2}
                  value={formData.businessModel}
                  onChange={(e) => updateField('businessModel', e.target.value)}
                  placeholder="e.g. Per-page margin spread plus $2.50 flat delivery fee per dorm drop..."
                  className="w-full px-4 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>

              {/* 10. Competition */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-1.5">
                  10. Competition & Substitutes
                </label>
                <input
                  type="text"
                  value={formData.competition}
                  onChange={(e) => updateField('competition', e.target.value)}
                  placeholder="e.g. University library print labs, retail FedEx Office, personal dorm desktop inkjets."
                  className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>

              {/* 11. Differentiation */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D3731]">
                    11. Differentiation & Moat
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAskWicksAi('differentiation')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D96B27] hover:text-[#9A3412]"
                  >
                    <Sparkles className="w-3 h-3" />
                    Need help? Ask Wicks AI
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.differentiation}
                  onChange={(e) => updateField('differentiation', e.target.value)}
                  placeholder="e.g. 45-minute dorm delivery speed, student formatting pre-flight checks, zero hardware maintenance."
                  className="w-full px-4 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>

              {/* 12. Go-To-Market */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-1.5">
                  12. Go-To-Market Strategy
                </label>
                <textarea
                  rows={2}
                  value={formData.goToMarket}
                  onChange={(e) => updateField('goToMarket', e.target.value)}
                  placeholder="e.g. Dormitory ambassador activation, move-in orientation vouchers, student club sponsorships."
                  className="w-full px-4 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>
            </div>
          )}

          {/* STEP 4: EVIDENCE */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-[#F0EAE1] pb-4 mb-6">
                <h2 className="font-serif text-2xl text-[#191716] font-bold">Step 4 — Evidence & Stewardship</h2>
                <p className="text-xs text-[#6B635A] mt-1">
                  Only provide facts you have verified. Unvalidated assumptions will be marked clearly for investors.
                </p>
              </div>

              {/* 13. Current Traction / Evidence */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-1.5">
                  13. Current Traction / Validation Signals
                </label>
                <textarea
                  rows={3}
                  value={formData.currentTraction}
                  onChange={(e) => updateField('currentTraction', e.target.value)}
                  placeholder="e.g. 65 student discovery interviews conducted; 1 local print vendor agreed in principle to fulfill batch orders."
                  className="w-full px-4 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>

              {/* 14. Financial / Revenue Model */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#3D3731]">
                    14. Financial / Revenue Model
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAskWicksAi('financialModel')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#D96B27] hover:text-[#9A3412]"
                  >
                    <Sparkles className="w-3 h-3" />
                    Need help? Ask Wicks AI
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.financialModel}
                  onChange={(e) => updateField('financialModel', e.target.value)}
                  placeholder="e.g. Unit cost $0.03/page, customer price $0.10/page, $2.50 delivery fee generating ~50% gross margin."
                  className="w-full px-4 py-2 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                />
              </div>

              {/* 15. Funding Requirement & Use of Funds */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-1.5">
                    Funding Ask
                  </label>
                  <input
                    type="text"
                    value={formData.fundingRequirement}
                    onChange={(e) => updateField('fundingRequirement', e.target.value)}
                    placeholder="e.g. $150,000 Pre-Seed"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3D3731] mb-1.5">
                    Planned Use of Funds
                  </label>
                  <input
                    type="text"
                    value={formData.useOfFunds}
                    onChange={(e) => updateField('useOfFunds', e.target.value)}
                    placeholder="e.g. 45% Tech, 30% Pilot operations, 15% Ambassadors"
                    className="w-full px-4 py-2.5 text-xs bg-[#FAF8F5] border border-[#DDD5C9] rounded-md focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#D96B27]/30"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & GENERATE PITCH */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-[#F0EAE1] pb-4 mb-6">
                <h2 className="font-serif text-2xl text-[#191716] font-bold">Step 5 — Ready to Light the Pitch</h2>
                <p className="text-xs text-[#6B635A] mt-1">
                  Venture Wicks will now generate exactly 11 investor slides based on your inputs.
                </p>
              </div>

              <div className="bg-[#FAF7F2] border border-[#E8DFD4] rounded-lg p-5 text-xs space-y-3">
                <div className="font-semibold text-[#191716] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D96B27]" />
                  Factual Accuracy Guarantee
                </div>
                <p className="text-[#635A51] leading-relaxed">
                  Unlike generic AI pitch generators, Venture Wicks does <strong>not</strong> invent fake revenue, bogus customer logos, or fabricated growth statistics. Missing points will be tagged as <em>Assumption</em> or <em>Evidence Needed</em>.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#EFE7DC] text-[11px] text-[#544C44]">
                  <div>Venture: <strong>{formData.ventureName || 'Untitled'}</strong></div>
                  <div>Stage: <strong>{formData.ventureStage}</strong></div>
                  <div>Ask: <strong>{formData.fundingRequirement || 'TBD'}</strong></div>
                </div>
              </div>

              {generationError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}

              <div className="text-center py-6">
                <button
                  id="btn-generate-pitch-final"
                  type="button"
                  disabled={isGeneratingPitch}
                  onClick={handleGeneratePitch}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-lg bg-[#D96B27] hover:bg-[#C25A19] text-white text-sm font-semibold shadow-md transition-all hover:scale-101"
                >
                  {isGeneratingPitch ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating 11 Investor Slides...</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 fill-current" />
                      <span>Generate My Pitch (11 Slides)</span>
                    </>
                  )}
                </button>
                <p className="text-[11px] text-[#8C8379] mt-3">
                  Instantly editable in the Pitch Studio after generation.
                </p>
              </div>
            </div>
          )}

          {/* Wizard Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-[#F0EAE1]">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-[#544C44] bg-[#F5ECE0] hover:bg-[#EBE0D2] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 5 && (
              <button
                id={`btn-next-step-${currentStep}`}
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !formData.ventureName.trim()) {
                    alert('Please provide a venture name before continuing.');
                    return;
                  }
                  setCurrentStep((prev) => (prev + 1) as any);
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md text-xs font-semibold text-white bg-[#191716] hover:bg-[#332F2A] transition-colors shadow-xs"
              >
                <span>Continue to Step 0{currentStep + 1}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E8732A]" />
              </button>
            )}
          </div>
        </div>

        {/* Right: AI-Assisted Side Panel ("Need help? Ask Wicks AI") */}
        {activeAiField && (
          <div className="lg:col-span-5 bg-[#FAF8F5] border border-[#E4DCD0] rounded-xl p-6 shadow-sm animate-in slide-in-from-right-4 duration-300 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE4DA] mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#191716]">
                <Sparkles className="w-4 h-4 text-[#D96B27]" />
                <span>Wicks AI Suggestion Panel</span>
              </div>
              <button
                onClick={handleDismissSuggestion}
                className="p-1 rounded text-[#948B80] hover:text-[#191716] hover:bg-[#EFE9DF]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {aiLoading ? (
              <div className="py-12 text-center text-xs text-[#7A7167]">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#D96B27] mb-3" />
                <p>Analyzing venture context to formulate grounded suggestion...</p>
              </div>
            ) : aiSuggestion ? (
              <div className="space-y-4 text-xs">
                {/* User Facts Box */}
                {aiSuggestion.userFacts.length > 0 && (
                  <div className="bg-[#F3EFE8] p-3 rounded border border-[#E5DDD2]">
                    <div className="text-[10px] uppercase font-bold text-[#166534] tracking-wider mb-1 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      User-Provided Facts
                    </div>
                    <ul className="list-disc pl-4 text-[11px] text-[#423C37] space-y-0.5">
                      {aiSuggestion.userFacts.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* The AI Suggestion */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#D96B27] tracking-wider">
                      AI Suggestion
                    </span>
                    <button
                      onClick={() => setIsEditingSuggestion(!isEditingSuggestion)}
                      className="text-[10px] text-[#736B63] hover:underline flex items-center gap-1"
                    >
                      <Edit2 className="w-2.5 h-2.5" />
                      {isEditingSuggestion ? 'Preview' : 'Edit before using'}
                    </button>
                  </div>

                  {isEditingSuggestion ? (
                    <textarea
                      rows={4}
                      value={editableSuggestionText}
                      onChange={(e) => setEditableSuggestionText(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white border border-[#D96B27] rounded-md focus:outline-hidden"
                    />
                  ) : (
                    <div className="p-3 bg-white border border-[#DDD5C9] rounded-md text-[#191716] leading-relaxed font-sans">
                      {editableSuggestionText || aiSuggestion.suggestion}
                    </div>
                  )}
                </div>

                {/* Assumptions */}
                {aiSuggestion.assumptions.length > 0 && (
                  <div className="bg-[#FFF8F0] p-2.5 rounded border border-[#F6DECA]">
                    <div className="text-[10px] uppercase font-bold text-[#9A3412] tracking-wider mb-0.5">
                      Assumptions Made
                    </div>
                    <p className="text-[11px] text-[#6B5A4E]">
                      {aiSuggestion.assumptions.join('; ')}
                    </p>
                  </div>
                )}

                {/* Evidence Needed */}
                {aiSuggestion.evidenceNeeded.length > 0 && (
                  <div className="bg-[#FEF2F2] p-2.5 rounded border border-[#FCDADA]">
                    <div className="text-[10px] uppercase font-bold text-[#B91C1C] tracking-wider mb-0.5">
                      Evidence Needed
                    </div>
                    <p className="text-[11px] text-[#783636]">
                      {aiSuggestion.evidenceNeeded.join('; ')}
                    </p>
                  </div>
                )}

                {/* Action Buttons: Use Suggestion, Edit, Dismiss */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={handleUseSuggestion}
                    className="flex-1 py-2 px-3 rounded-md text-xs font-semibold text-white bg-[#D96B27] hover:bg-[#C25A19] transition-colors text-center shadow-xs"
                  >
                    Use Suggestion
                  </button>
                  <button
                    onClick={() => setIsEditingSuggestion(!isEditingSuggestion)}
                    className="py-2 px-3 rounded-md text-xs font-medium text-[#403A34] bg-white border border-[#DCD4CA] hover:bg-[#F8F4EE] transition-colors"
                  >
                    {isEditingSuggestion ? 'Done' : 'Edit'}
                  </button>
                  <button
                    onClick={handleDismissSuggestion}
                    className="py-2 px-3 rounded-md text-xs font-medium text-[#7D756B] hover:text-[#191716] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
