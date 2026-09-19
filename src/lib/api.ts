import { PitchSlide, QuestionnaireData, VCCriticItem, VentureAIAnalysis, PracticeEvaluation } from '../types';

export async function fetchHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: String(err) };
  }
}

export async function askQuestionAssist(
  field: string,
  currentValue: string,
  questionnaire: QuestionnaireData
) {
  try {
    const res = await fetch('/api/ai/question-assist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, currentValue, questionnaire })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error in question assist:', err);
    return {
      userFacts: ['Manual entry mode'],
      suggestion: 'Early adopters with acute pain points who prioritize speed and reliability over legacy workarounds.',
      assumptions: ['Core customer problem is validated'],
      evidenceNeeded: ['Discovery interviews with prospective target users']
    };
  }
}

export async function generatePitchApi(questionnaire: QuestionnaireData): Promise<PitchSlide[]> {
  try {
    const res = await fetch('/api/ai/generate-pitch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionnaire })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.slides || [];
  } catch (err) {
    console.warn('API error generating pitch:', err);
    throw err;
  }
}

export async function improveSlideApi(
  slide: PitchSlide,
  instructions?: string,
  questionnaire?: QuestionnaireData
): Promise<PitchSlide> {
  try {
    const res = await fetch('/api/ai/improve-slide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slide, instructions, questionnaire })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error improving slide:', err);
    return slide;
  }
}

export async function runVCCriticApi(
  questionnaire: QuestionnaireData,
  slides: PitchSlide[]
): Promise<VCCriticItem[]> {
  try {
    const res = await fetch('/api/ai/vc-critic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionnaire, slides })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.critique || [];
  } catch (err) {
    console.warn('API error running VC critic:', err);
    return [];
  }
}

export async function runVentureAnalysisApi(
  questionnaire: QuestionnaireData,
  slides: PitchSlide[]
): Promise<VentureAIAnalysis | null> {
  try {
    const res = await fetch('/api/ai/analyze-venture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionnaire, slides })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error running analysis:', err);
    return null;
  }
}

export async function evaluatePracticeAnswerApi(
  question: string,
  answer: string,
  questionnaire?: QuestionnaireData
): Promise<PracticeEvaluation> {
  try {
    const res = await fetch('/api/ai/investor-practice-eval', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer, questionnaire })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error evaluating answer:', err);
    return {
      strong: 'Good foundational explanation.',
      unclear: 'Lacks quantitative backing or benchmark comparison.',
      missingEvidence: 'Needs customer validation data or pilot metrics.',
      howToImprove: 'Lead directly with the measurable result, then explain the operational mechanic.'
    };
  }
}

export async function sendWicksChatMessageApi(
  message: string,
  history: Array<{ role: string; content: string }>,
  ventureContext?: any
): Promise<string> {
  try {
    const res = await fetch('/api/ai/wicks-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, ventureContext })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.reply || '';
  } catch (err) {
    console.warn('API error chatting with Wicks AI:', err);
    return 'Wicks AI is ready to advise on your pitch, market strategy, and investor preparedness.';
  }
}

export const runVcCriticApi = runVCCriticApi;
export const analyzeVentureApi = runVentureAnalysisApi;
export const chatWithWicksAiApi = sendWicksChatMessageApi;
