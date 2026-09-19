import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    brand: 'Venture Wicks',
    tagline: 'Light the way from startup idea to investor-ready pitch',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Helper to sanitize and parse JSON response safely
function parseJsonSafe<T>(text: string, fallback: T): T {
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean) as T;
  } catch (err) {
    console.warn('Failed to parse AI JSON response, using fallback logic:', err);
    return fallback;
  }
}

// 1. AI-Assisted Questionnaire Helper
app.post('/api/ai/question-assist', async (req: Request, res: Response) => {
  try {
    const { field, currentValue, questionnaire } = req.body;
    const ai = getGeminiClient();

    const fallbackResponse = generateQuestionAssistFallback(field, questionnaire);

    if (!ai) {
      return res.json(fallbackResponse);
    }

    const prompt = `You are Wicks AI, the strategic assistant for Venture Wicks.
A founder is completing a startup questionnaire for their venture "${questionnaire?.ventureName || 'New Venture'}".
Field being answered: "${field}"
Current input: "${currentValue || '(empty)'}"
Existing Venture Context:
${JSON.stringify(questionnaire, null, 2)}

RULE REQUIREMENTS:
1. Provide a professional, concise suggested answer based strictly on the clues and facts already entered by the user.
2. NEVER fabricate revenue, customers, partnerships, traction, market statistics, growth rates, funding figures, or citations.
3. If specifics are absent, frame them cleanly as realistic strategic hypotheses or mark what evidence is needed.
4. Output STRICT JSON with this schema:
{
  "userFacts": ["Fact 1 already supplied by founder", "Fact 2"],
  "suggestion": "Concrete, professional drafted answer for this question...",
  "assumptions": ["Assumption 1 needed for this to hold"],
  "evidenceNeeded": ["Specific real-world metric or evidence founder must verify"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = parseJsonSafe(response.text || '', fallbackResponse);
    return res.json(parsed);
  } catch (error) {
    console.error('Error in /api/ai/question-assist:', error);
    res.json(generateQuestionAssistFallback(req.body?.field, req.body?.questionnaire));
  }
});

function generateQuestionAssistFallback(field: string, q: any) {
  const name = q?.ventureName || 'the venture';
  const problem = q?.problem || '';
  const solution = q?.solution || '';
  const customers = q?.targetCustomers || '';

  switch (field) {
    case 'targetCustomers':
      return {
        userFacts: problem ? [`Solves: "${problem.slice(0, 80)}..."`] : ['Founder identified core friction point'],
        suggestion: problem 
          ? `Early adopters who actively experience this problem on a recurring basis, specifically individuals or organizations impacted by ${problem.slice(0, 100)}.`
          : 'High-intent early adopters with acute frequency of this pain point and documented willingness to test alternative workflows.',
        assumptions: ['Target users have purchasing authority or direct workflow autonomy'],
        evidenceNeeded: ['Discovery interviews with at least 25 prospective customer profiles']
      };
    case 'differentiation':
      return {
        userFacts: solution ? [`Current solution approach: "${solution.slice(0, 90)}..."`] : [],
        suggestion: `Unlike legacy manual alternatives, ${name} delivers faster turnaround with lower friction, purpose-built workflows, and zero unnecessary overhead.`,
        assumptions: ['Speed and specialized UX offer sufficient defensibility against incumbents'],
        evidenceNeeded: ['Side-by-side workflow benchmark against primary substitute']
      };
    case 'marketOpportunity':
      return {
        userFacts: customers ? [`Target segment: ${customers.slice(0, 80)}`] : [],
        suggestion: `Concentrated beachhead segment of ${customers || 'target users'} with recurring monthly demand, expanding adjacent into broader regional markets.`,
        assumptions: ['Beachhead segment density is sufficient for initial capital efficiency'],
        evidenceNeeded: ['Bottom-up market sizing: (# of target units) x ($ annual estimated spend)']
      };
    case 'financialModel':
      return {
        userFacts: q?.businessModel ? [`Model: ${q.businessModel}`] : [],
        suggestion: 'Transaction-based contribution margin per unit delivered, generating positive gross margin before platform overhead and acquisition spend.',
        assumptions: ['Direct variable costs remain predictable at pilot scale'],
        evidenceNeeded: ['Vendor quote sheets or verified cost-of-goods breakdown']
      };
    default:
      return {
        userFacts: q?.ventureName ? [`Venture name: ${q.ventureName}`] : ['Early concept phase'],
        suggestion: `Refined, investor-ready formulation for ${field || 'this question'} emphasizing clear value creation, tangible scope, and grounded assumptions.`,
        assumptions: ['Core customer pain point remains acute and unaddressed by incumbents'],
        evidenceNeeded: ['Customer validation signals and preliminary operational milestones']
      };
  }
}

// 2. Generate Exactly 11 Investor Pitch Slides
app.post('/api/ai/generate-pitch', async (req: Request, res: Response) => {
  try {
    const { questionnaire } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ slides: generateDeterministicSlides(questionnaire) });
    }

    const prompt = `You are the Pitch Engine for Venture Wicks.
Given this founder's questionnaire:
${JSON.stringify(questionnaire, null, 2)}

GENERATE EXACTLY 11 INVESTOR PITCH SLIDES:
1. Title
2. Problem
3. Solution
4. Target Market
5. Market Opportunity
6. Business Model
7. Competition & Differentiation
8. Go-To-Market
9. Traction & Milestones
10. Financial Logic
11. Funding Ask & Use of Funds

CRITICAL RULES:
- Use ONLY information supplied by the user.
- If information is missing or not provided, CLEARLY designate it in "assumptions" or "evidenceNeeded" arrays.
- NEVER invent revenue, metrics, partner logos, or fake user statistics.
- Provide crisp, editorial headlines and 3-4 succinct bullet points.
- Output JSON format matching this schema:
{
  "slides": [
    {
      "slideNumber": 1,
      "category": "title",
      "title": "...",
      "subtitle": "...",
      "headline": "...",
      "keyPoints": ["...", "..."],
      "facts": ["..."],
      "assumptions": ["..."],
      "evidenceNeeded": ["..."],
      "visualType": "pillars" | "flow" | "comparison" | "timeline" | "allocation" | "market_size",
      "speakerNotes": "..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = parseJsonSafe(response.text || '', { slides: generateDeterministicSlides(questionnaire) });
    res.json(parsed);
  } catch (error) {
    console.error('Error generating pitch slides:', error);
    res.json({ slides: generateDeterministicSlides(req.body?.questionnaire) });
  }
});

function generateDeterministicSlides(q: any) {
  const name = q?.ventureName || 'Untitled Venture';
  const stage = q?.ventureStage || 'Idea Stage';
  const problem = q?.problem || 'Unaddressed customer friction in the target market.';
  const solution = q?.solution || 'A streamlined solution built for customer ease and reliability.';
  const market = q?.targetCustomers || 'Initial beachhead customer segment.';
  const opp = q?.marketOpportunity || 'Growing demand in target vertical with recurring usage patterns.';
  const bizModel = q?.businessModel || 'Value-based pricing model with scalable unit economics.';
  const comp = q?.competition || 'Legacy alternatives and fragmented local substitutes.';
  const diff = q?.differentiation || 'Faster execution, modern UX, and tailored workflows.';
  const gtm = q?.goToMarket || 'Direct founder-led outreach and strategic community channels.';
  const traction = q?.currentTraction || 'Preliminary customer discovery interviews completed.';
  const fin = q?.financialModel || 'Healthy contribution margin per unit transaction.';
  const ask = q?.fundingRequirement || 'Seed financing round';
  const use = q?.useOfFunds || 'Product development, initial customer pilot, and operational runway.';

  return [
    {
      id: 'slide-1',
      slideNumber: 1,
      category: 'title',
      title: name,
      subtitle: q?.industry || 'Startup Pitch Deck',
      headline: 'Light the way from idea to venture.',
      keyPoints: [`Stage: ${stage}`, `Industry: ${q?.industry || 'Emerging Tech'}`, 'Prepared with Venture Wicks'],
      facts: [name, stage],
      assumptions: ['Target customer pain point is acute and recurring'],
      evidenceNeeded: ['Commercial pilot agreement or customer signups'],
      visualType: 'pillars',
      speakerNotes: `Welcome investors. This is ${name}, designed to address critical workflow frictions.`
    },
    {
      id: 'slide-2',
      slideNumber: 2,
      category: 'problem',
      title: 'The Problem',
      subtitle: 'Acute Friction with Legacy Inefficiencies',
      headline: 'The current status quo causes systemic delays and user frustration.',
      keyPoints: [
        problem.slice(0, 120),
        'Existing solutions are slow, fragmented, or inaccessible when users need them most',
        'Users are forced to rely on cumbersome manual workarounds'
      ],
      facts: [problem],
      assumptions: ['Current alternatives fail to adequately resolve this for the core segment'],
      evidenceNeeded: ['Quantified hours or dollars lost by users per month'],
      visualType: 'pillars',
      speakerNotes: 'Walk investors through the exact friction point and why incumbent tools fall short.'
    },
    {
      id: 'slide-3',
      slideNumber: 3,
      category: 'solution',
      title: 'The Solution',
      subtitle: 'Purpose-Built On-Demand Platform',
      headline: 'A streamlined, intuitive approach built around the modern user journey.',
      keyPoints: [
        solution.slice(0, 130),
        'Eliminates unnecessary intermediary steps through intuitive workflow design',
        'Delivers reliable execution with transparent tracking and zero friction'
      ],
      facts: [solution],
      assumptions: ['Users will adopt a digital platform over existing habits'],
      evidenceNeeded: ['Usability testing metrics and task completion rates'],
      visualType: 'flow',
      speakerNotes: 'Highlight the core product mechanism and why it provides an order-of-magnitude better experience.'
    },
    {
      id: 'slide-4',
      slideNumber: 4,
      category: 'target_market',
      title: 'Target Customers',
      subtitle: 'Concentrated Beachhead with Recurring Demand',
      headline: 'Focusing on high-intent early adopters with acute frequency.',
      keyPoints: [
        `Primary Audience: ${market.slice(0, 120)}`,
        'Beneficiaries: Direct end-users and organizational coordinators',
        'Beachhead Strategy: Focus on geographically dense or community-clustered segments'
      ],
      facts: [market],
      assumptions: ['Segment has identifiable channels for low-friction acquisition'],
      evidenceNeeded: ['Audited segmentation study or verified waitlist demographics'],
      visualType: 'pillars',
      speakerNotes: 'Define who feels the pain most severely and why starting with this niche creates rapid momentum.'
    },
    {
      id: 'slide-5',
      slideNumber: 5,
      category: 'market_opportunity',
      title: 'Market Opportunity',
      subtitle: 'Expanding Vertical with Strong Fundamentals',
      headline: 'Compelling market dynamics driven by secular digital transitions.',
      keyPoints: [
        opp.slice(0, 140),
        'Adjacent expansion into surrounding regional and enterprise segments',
        'High repeat usage frequency compounds lifetime customer value'
      ],
      facts: ['Identified vertical opportunity'],
      assumptions: ['Target segment spending velocity reflects broader macro trends'],
      evidenceNeeded: ['Bottom-up Total Addressable Market (TAM) breakdown with audited sources'],
      visualType: 'market_size',
      metrics: [
        { label: 'Market Segment', value: 'High Density', isAssumption: false },
        { label: 'Stage Focus', value: stage, isAssumption: false },
        { label: 'Expansion Potential', value: 'National', isAssumption: true }
      ],
      speakerNotes: 'Present the market opportunity with sober realism, demonstrating disciplined focus before broad expansion.'
    },
    {
      id: 'slide-6',
      slideNumber: 6,
      category: 'business_model',
      title: 'Business Model',
      subtitle: 'Transparent Unit Economics & Monetization Flow',
      headline: 'Generating predictable gross contribution margins on every transaction.',
      keyPoints: [
        bizModel.slice(0, 130),
        'Clear pricing tiers aligned with user value and operational delivery costs',
        'Opportunity for high-margin premium add-ons and subscription tiers'
      ],
      facts: [bizModel],
      assumptions: ['Willingness to pay meets or exceeds modeled price points'],
      evidenceNeeded: ['Empirical pricing elasticity data from pilot transactions'],
      visualType: 'flow',
      speakerNotes: 'Explain how money flows through the system and why the unit economics are inherently defensible.'
    },
    {
      id: 'slide-7',
      slideNumber: 7,
      category: 'competition',
      title: 'Competition & Differentiation',
      subtitle: 'Defending Our Position in the Market',
      headline: 'Why legacy alternatives cannot easily replicate our focused approach.',
      keyPoints: [
        `Incumbent Landscape: ${comp.slice(0, 110)}`,
        `Core Differentiation: ${diff.slice(0, 120)}`,
        'Sustainable Moat: User workflow integration, speed, and localized density'
      ],
      facts: [comp, diff],
      assumptions: ['Incumbents will not cannibalize their existing revenue models to match us'],
      evidenceNeeded: ['Feature-by-feature matrix validated by objective customer feedback'],
      visualType: 'comparison',
      speakerNotes: 'Demonstrate deep respect for existing competitors while clearly delineating our asymmetric advantages.'
    },
    {
      id: 'slide-8',
      slideNumber: 8,
      category: 'gtm',
      title: 'Go-To-Market Strategy',
      subtitle: 'Efficient Multi-Channel Customer Acquisition',
      headline: 'Scalable grassroots activation designed for viral community loops.',
      keyPoints: [
        gtm.slice(0, 130),
        'Low-cost ambassador networks driving word-of-mouth recommendations',
        'Seasonal promotional sprints timed to coincide with high-demand cycles'
      ],
      facts: [gtm],
      assumptions: ['Organic referral coefficient exceeds 1.1 in dense pilot hubs'],
      evidenceNeeded: ['Customer Acquisition Cost (CAC) benchmarked across initial channels'],
      visualType: 'timeline',
      speakerNotes: 'Outline how we win customers cost-effectively without relying on unsustainable ad spend.'
    },
    {
      id: 'slide-9',
      slideNumber: 9,
      category: 'traction',
      title: 'Traction & Milestones',
      subtitle: 'Milestones Completed and Roadmap Ahead',
      headline: 'Disciplined execution grounded in real qualitative validation.',
      keyPoints: [
        traction.slice(0, 140),
        'Completed initial prototype and preliminary vendor architecture discussions',
        'Next Milestone: Execute structured closed beta with qualified target users'
      ],
      facts: [traction],
      assumptions: ['Pilot signups will mirror interview enthusiasm at launch'],
      evidenceNeeded: ['Audited user retention curves and repeat order percentages'],
      visualType: 'timeline',
      speakerNotes: 'Be candid about current stage: show what has been proven and what hypotheses remain to be tested.'
    },
    {
      id: 'slide-10',
      slideNumber: 10,
      category: 'financials',
      title: 'Financial Logic',
      subtitle: 'Capital-Efficient Unit Economics',
      headline: 'Structured for positive unit margins and scalable operational leverage.',
      keyPoints: [
        fin.slice(0, 130),
        'Direct fulfillment costs scale variable with demand, minimizing fixed risk',
        'Targeting operating breakeven on a localized hub-by-hub basis'
      ],
      facts: [fin],
      assumptions: ['Fixed overhead remains constrained during multi-city expansion'],
      evidenceNeeded: ['Audited 3-year pro-forma financial statement with sensitivity analysis'],
      visualType: 'flow',
      speakerNotes: 'Walk through the financial mechanics, demonstrating disciplined cost control and cash flow focus.'
    },
    {
      id: 'slide-11',
      slideNumber: 11,
      category: 'funding',
      title: 'Funding Ask & Use of Funds',
      subtitle: `Targeting ${ask}`,
      headline: 'Fueling our pilot validation and achieving core milestone inflection points.',
      keyPoints: [
        `Funding Requirement: ${ask}`,
        `Planned Allocation: ${use.slice(0, 140)}`,
        'Target Milestone: Prove repeat unit economics and establish market beachhead'
      ],
      facts: [ask, use],
      assumptions: ['Target capital provides 12-18 months of disciplined operational runway'],
      evidenceNeeded: ['Clear milestone milestones tied to follow-on institutional valuation'],
      visualType: 'allocation',
      metrics: [
        { label: 'Round Ask', value: ask.slice(0, 16), isAssumption: false },
        { label: 'Runway Target', value: '12-18 Mo', isAssumption: true },
        { label: 'Core Target', value: 'Pilot Scale', isAssumption: true }
      ],
      speakerNotes: 'Close with the specific capital ask, clear stewardship of investor funds, and definitive milestone gates.'
    }
  ];
}

// 3. Improve Slide With AI
app.post('/api/ai/improve-slide', async (req: Request, res: Response) => {
  try {
    const { slide, instructions, questionnaire } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        ...slide,
        headline: slide.headline ? `${slide.headline} (Polished for Investor Clarity)` : 'High-impact value proposition.',
        speakerNotes: slide.speakerNotes ? `${slide.speakerNotes} Focus on metrics and defensibility.` : 'Highlight clear customer value.'
      });
    }

    const prompt = `You are the Pitch Refiner in Venture Wicks.
Given this slide:
${JSON.stringify(slide, null, 2)}
Founder instructions: "${instructions || 'Make this punchier, more concise, and investor-ready'}"
Venture questionnaire context:
${JSON.stringify(questionnaire || {}, null, 2)}

STRICT RULES:
1. Preserve factual accuracy. Do NOT invent new numbers or fake partnerships.
2. Refine the headline to be high-impact, crisp, and investor-focused.
3. Clean up the bullet points so they are scannable and direct.
4. Keep the same slideNumber, category, and visualType.
5. Return the updated slide JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = parseJsonSafe(response.text || '', slide);
    res.json(parsed);
  } catch (error) {
    console.error('Error improving slide:', error);
    res.json(req.body?.slide);
  }
});

// 4. VC Critic: "Challenge Your Pitch" (5-7 concrete weaknesses)
app.post('/api/ai/vc-critic', async (req: Request, res: Response) => {
  try {
    const { questionnaire, slides } = req.body;
    const ai = getGeminiClient();

    const fallbackCritique = [
      {
        id: 'critic-1',
        category: 'Market Opportunity',
        severity: 'Warning',
        slideNumber: 5,
        problem: 'Broad market assertions lack specific bottom-up sizing metrics and segment definitions.',
        whyItMatters: 'Investors need to verify if the addressable market is large enough to sustain venture returns.',
        suggestedImprovement: 'Provide a bottom-up formula: (number of target accounts) × (annual spend per account).'
      },
      {
        id: 'critic-2',
        category: 'Traction & Milestones',
        severity: 'Critical',
        slideNumber: 9,
        problem: 'Validation relies primarily on conversational feedback rather than transactional commitment.',
        whyItMatters: 'Conversational enthusiasm often evaporates when users are asked to pay or sign contracts.',
        suggestedImprovement: 'Secure 10-20 letters of intent, deposits, or waitlist pre-orders prior to fundraising.'
      },
      {
        id: 'critic-3',
        category: 'Defensibility',
        severity: 'Warning',
        slideNumber: 7,
        problem: 'Barriers preventing an incumbent from copying your features are not convincingly established.',
        whyItMatters: 'If incumbents can build this in a 2-week sprint, your market position is vulnerable.',
        suggestedImprovement: 'Identify non-replicable assets: proprietary data loops, network density, or exclusive channel access.'
      },
      {
        id: 'critic-4',
        category: 'Financial Logic',
        severity: 'Critical',
        slideNumber: 10,
        problem: 'Unit economics do not explicitly account for customer acquisition churn or seasonal fluctuations.',
        whyItMatters: 'Hidden variable costs or seasonal lulls can quickly exhaust early cash runway.',
        suggestedImprovement: 'Model best-case, base-case, and stressed unit economics under 20% higher acquisition costs.'
      },
      {
        id: 'critic-5',
        category: 'Go-To-Market',
        severity: 'Info',
        slideNumber: 8,
        problem: 'Go-to-market playbook relies on multiple unproven channels simultaneously rather than one dominant engine.',
        whyItMatters: 'Early-stage startups succeed by mastering a single repeatable acquisition channel first.',
        suggestedImprovement: 'Pick one single primary channel and detail the step-by-step funnel economics.'
      },
      {
        id: 'critic-6',
        category: 'Funding Ask',
        severity: 'Info',
        slideNumber: 11,
        problem: 'The funding ask does not state the exact valuation and follow-on milestones it unlocks.',
        whyItMatters: 'Investors want to know what valuation inflection point this round achieves for the next Series round.',
        suggestedImprovement: 'State specifically: "This $Xk round delivers us to Y milestone, positioning us for a $Z Series round."'
      }
    ];

    if (!ai) {
      return res.json({ critique: fallbackCritique });
    }

    const prompt = `You are the VC Critic at Venture Wicks.
"See your venture through an investor's eyes."
Challenge this venture pitch with 5 to 7 concrete weaknesses:
Questionnaire:
${JSON.stringify(questionnaire, null, 2)}
Slides:
${JSON.stringify(slides, null, 2)}

REQUIREMENTS:
- Generate 5 to 7 rigorous, realistic, high-value criticisms.
- For each issue provide:
  - category (e.g. "Market Opportunity", "Defensibility", "Traction", "Financial Logic", "Go-To-Market", "Funding Ask")
  - severity ("Critical", "Warning", or "Info")
  - slideNumber (1 to 11)
  - problem (concrete, specific flaw)
  - whyItMatters (why serious investors care)
  - suggestedImprovement (actionable advice to fix it)
- Return STRICT JSON:
{
  "critique": [
    {
      "id": "crit-1",
      "category": "...",
      "severity": "Critical" | "Warning" | "Info",
      "slideNumber": 5,
      "problem": "...",
      "whyItMatters": "...",
      "suggestedImprovement": "..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = parseJsonSafe(response.text || '', { critique: fallbackCritique });
    res.json(parsed);
  } catch (error) {
    console.error('Error in VC critic:', error);
    res.json({ critique: [] });
  }
});

// 5. AI Analysis: 9 Dimensions
app.post('/api/ai/analyze-venture', async (req: Request, res: Response) => {
  try {
    const { questionnaire } = req.body;
    const ai = getGeminiClient();

    const fallbackAnalysis = {
      overallReadiness: 'Early Validation Stage — Promising strategic foundation requiring concrete transactional evidence before formal institutional pitching.',
      dimensions: [
        { dimension: 'Problem Strength', status: 'Strong', summary: 'Clear and acute friction point identified.', details: 'Directly tackles user pain with relatable day-to-day workflow disruption.' },
        { dimension: 'Solution Clarity', status: 'Strong', summary: 'Straightforward mechanic with high utility.', details: 'Solution is easy for customers to understand without complex onboarding.' },
        { dimension: 'Market Opportunity', status: 'Needs Evidence', summary: 'Macro size is attractive, but bottom-up metrics needed.', details: 'Requires audited data on addressable unit volumes in the initial target geography.' },
        { dimension: 'Competitive Position', status: 'Needs Evidence', summary: 'Differentiation is clear on speed, but moat requires defense.', details: 'Need to clarify how the platform protects against rapid competitor feature clones.' },
        { dimension: 'Business Model', status: 'Strong', summary: 'Simple, direct monetization mechanics.', details: 'Value-aligned fee structure with immediate cash collection.' },
        { dimension: 'Go-To-Market', status: 'Needs Evidence', summary: 'Channel plan is logical, but conversion metrics are unproven.', details: 'Channel acquisition economics need empirical validation in live pilot.' },
        { dimension: 'Traction', status: 'Challenged', summary: 'Limited to discovery conversations without commercial pre-orders.', details: 'Requires real paid commitments to de-risk market demand.' },
        { dimension: 'Financial Logic', status: 'Needs Evidence', summary: 'Gross margin is positive, but variable costs need stress-testing.', details: 'Buffer for labor fluctuation, fulfillment churn, and seasonal troughs is needed.' },
        { dimension: 'Investor Readiness', status: 'Needs Evidence', summary: 'Suitable for angels and accelerators; prepare pilot data for venture funds.', details: 'Running a short structured pilot will elevate investor confidence significantly.' }
      ],
      whatIsWorking: [
        'Direct founder empathy and deep understanding of the core customer friction',
        'Asset-light execution model avoiding heavy upfront capital expenditures',
        'High-density community target that allows localized viral expansion'
      ],
      whatNeedsEvidence: [
        'Customer willingness to pay at sustainable gross margin price points',
        'Repeat usage frequency and cohort retention over 60+ days',
        'Bottom-up unit economics with all variable delivery fees accounted for'
      ],
      whatInvestorsMayChallenge: [
        'Can incumbents easily clone these capabilities into existing tools?',
        'How will you sustain customer acquisition cost as you expand past your initial niche?',
        'What specific milestone gates will this funding round definitively prove?'
      ],
      recommendedNextActions: [
        'Run a 14-day manual pilot test to complete 25 real paid transactions',
        'Interview 10 key stakeholders to confirm annual budget availability',
        'Secure 1 formal letter of intent or pilot fulfillment partnership'
      ],
      lastUpdated: new Date().toISOString()
    };

    if (!ai) {
      return res.json(fallbackAnalysis);
    }

    const prompt = `You are the Venture Analyst at Venture Wicks.
Perform an in-depth Venture Analysis across these 9 dimensions:
1. Problem Strength
2. Solution Clarity
3. Market Opportunity
4. Competitive Position
5. Business Model
6. Go-To-Market
7. Traction
8. Financial Logic
9. Investor Readiness

Venture Data:
${JSON.stringify(questionnaire, null, 2)}

RULES:
- Do not use meaningless fake scores. Provide qualitative, professional analytical substance.
- Show: "whatIsWorking", "whatNeedsEvidence", "whatInvestorsMayChallenge", "recommendedNextActions".
- Output JSON format matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = parseJsonSafe(response.text || '', fallbackAnalysis);
    res.json(parsed);
  } catch (error) {
    console.error('Error analyzing venture:', error);
    res.json({});
  }
});

// 6. Investor Practice Evaluation
app.post('/api/ai/investor-practice-eval', async (req: Request, res: Response) => {
  try {
    const { question, answer, questionnaire } = req.body;
    const ai = getGeminiClient();

    const fallbackEval = {
      strong: answer && answer.length > 30 
        ? 'Directly addressed the core of the question with clear personal perspective.' 
        : 'Good initial start acknowledging the underlying investor concern.',
      unclear: 'Lacks specific metrics or comparative benchmarks to substantiate the claim.',
      missingEvidence: 'Needs concrete customer quotes, conversion percentages, or signed LOIs to prove the thesis.',
      howToImprove: 'Lead with a definitive factual outcome, reference your pilot discovery data, and finish with unit economics.'
    };

    if (!ai) {
      return res.json(fallbackEval);
    }

    const prompt = `You are a tough, fair VC partner evaluating a founder's verbal response to an investor question in Venture Wicks Practice Mode.
Investor Question: "${question}"
Founder Answer: "${answer}"
Venture context:
${JSON.stringify(questionnaire || {}, null, 2)}

Evaluate the founder's answer objectively:
1. What was strong
2. What was unclear
3. What evidence is missing
4. How to improve the answer

Output STRICT JSON:
{
  "strong": "...",
  "unclear": "...",
  "missingEvidence": "...",
  "howToImprove": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = parseJsonSafe(response.text || '', fallbackEval);
    res.json(parsed);
  } catch (error) {
    console.error('Error in investor eval:', error);
    res.json({
      strong: 'Clear articulation of the concept.',
      unclear: 'Missing quantified proof points.',
      missingEvidence: 'Needs pilot traction data.',
      howToImprove: 'Anchor your answer in validated unit economics and customer commitments.'
    });
  }
});

// 7. Wicks AI Chat Companion
app.post('/api/ai/wicks-chat', async (req: Request, res: Response) => {
  try {
    const { message, history, ventureContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: `As Wicks AI, I'm analyzing "${ventureContext?.name || 'your venture'}". For "${message}", remember that investors look for three things: genuine problem severity, asset-light scalability, and defensibility against incumbents. Ground your answers in what you've validated with real users.`
      });
    }

    const prompt = `You are Wicks AI, the startup strategy partner inside Venture Wicks.
Tagline: "Light the way from startup idea to investor-ready pitch."
Tone: Professional, supportive, razor-sharp, strategic, grounded in real venture capital standards.
Never invent facts or fake metrics. Always advise the founder to mark assumptions and build real evidence.

Current Venture Context:
${JSON.stringify(ventureContext || {}, null, 2)}

Chat history:
${JSON.stringify(history || [], null, 2)}

User question: "${message}"

Give a concise, insightful, actionable reply (150-250 words) with clear strategic takeaways.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ reply: response.text || 'Wicks AI is ready to help refine your pitch.' });
  } catch (error) {
    console.error('Error in wicks chat:', error);
    res.json({ reply: 'I am here to help you refine your strategy, challenge assumptions, and prepare for investor questions.' });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Venture Wicks server listening on port ${PORT}`);
  });
}

startServer();
