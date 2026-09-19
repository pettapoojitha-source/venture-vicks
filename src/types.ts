export type VentureStage = 'Idea Stage' | 'Prototype / MVP' | 'Early Traction' | 'Growth';

export type UiDesignMode = 'editorial' | 'executive';

export type AppView = 
  | 'landing' 
  | 'dashboard' 
  | 'wizard' 
  | 'studio' 
  | 'critic' 
  | 'analysis' 
  | 'investor' 
  | 'presentation';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  isGoogleUser?: boolean;
  createdAt: string;
}

export interface QuestionnaireData {
  // Step 1 - Idea
  ventureName: string;
  problem: string;
  solution: string;

  // Step 2 - Market
  targetCustomers: string;
  whoBenefits: string;
  industry: string;
  marketOpportunity: string;

  // Step 3 - Business
  ventureStage: VentureStage;
  businessModel: string;
  competition: string;
  differentiation: string;
  goToMarket: string;

  // Step 4 - Evidence
  currentTraction: string;
  financialModel: string;
  fundingRequirement: string;
  useOfFunds: string;
}

export type SlideCategory = 
  | 'title' 
  | 'problem' 
  | 'solution' 
  | 'target_market' 
  | 'market_opportunity' 
  | 'business_model' 
  | 'competition' 
  | 'gtm' 
  | 'traction' 
  | 'financials' 
  | 'funding';

export interface PitchSlide {
  id: string;
  slideNumber: number; // 1 to 11
  category: SlideCategory;
  title: string;
  subtitle: string;
  headline: string;
  keyPoints: string[];
  facts: string[];
  assumptions: string[];
  evidenceNeeded: string[];
  metrics?: { label: string; value: string; isAssumption?: boolean }[];
  visualType?: 'flow' | 'comparison' | 'timeline' | 'allocation' | 'market_size' | 'pillars';
  speakerNotes: string;
}

export type CriticSeverity = 'Critical' | 'Warning' | 'Suggestion' | 'Info';

export interface VCCriticItem {
  id: string;
  category: string;
  severity: CriticSeverity;
  slideNumber: number;
  title?: string;
  problem: string;
  whyItMatters?: string;
  critique?: string;
  suggestedImprovement?: string;
  recommendation?: string;
  resolved?: boolean;
}

export type VcCritiqueIssue = VCCriticItem;

export type AnalysisStatus = 
  | 'Strong' 
  | 'Needs Evidence' 
  | 'Challenged' 
  | 'Compelling' 
  | 'Defensible' 
  | 'High Conviction' 
  | 'Needs Grounding' 
  | 'Early Hypothesis' 
  | 'Validating' 
  | 'Disciplined' 
  | string;

export interface DimensionAnalysis {
  name?: string;
  dimension: string;
  status: AnalysisStatus;
  summary?: string;
  details?: string;
  analysis?: string;
  actionableStep?: string;
}

export interface VentureAIAnalysis {
  executiveSummary?: string;
  strategicImperative?: string;
  overallReadiness?: string;
  dimensions: DimensionAnalysis[];
  whatIsWorking?: string[];
  whatNeedsEvidence?: string[];
  whatInvestorsMayChallenge?: string[];
  recommendedNextActions?: string[];
  lastUpdated?: string;
}

export type VentureAnalysis = VentureAIAnalysis;

export interface InvestorQuestion {
  id: string;
  category: string;
  question: string;
  suggestedAnswer?: string;
  founderAnswer?: string;
  userAnswer?: string;
  evidenceCheck?: string;
  isEvidenceNeeded?: boolean;
  evidenceMissingDetails?: string;
  evaluation?: PracticeEvaluation;
  tags?: string[];
}

export interface PracticeEvaluation {
  credibility?: string;
  strengths?: string;
  strong?: string;
  unclear?: string;
  missingEvidence?: string;
  suggestedAnswer?: string;
  howToImprove?: string;
}

export interface PracticeMessage {
  id: string;
  sender: 'investor' | 'founder' | 'evaluator';
  text: string;
  timestamp: string;
  evaluation?: PracticeEvaluation;
  questionIndex?: number;
}

export interface Venture {
  id: string;
  userId: string;
  name: string;
  industry: string;
  stage: VentureStage;
  tagline: string;
  createdAt: string;
  lastUpdated: string;
  pitchCompletion: number; // 0 to 100
  criticStatus: 'unreviewed' | 'issues_found' | 'investor_ready';
  questionnaire: QuestionnaireData;
  slides: PitchSlide[];
  critique: VCCriticItem[];
  analysis?: VentureAIAnalysis;
  investorQuestions: InvestorQuestion[];
  isDemo?: boolean;
}

export interface AISuggestion {
  field: string;
  userFacts: string[];
  suggestion: string;
  assumptions: string[];
  evidenceNeeded: string[];
}
