import { Venture } from '../types';

export const DEMO_QUICKPRINT_VENTURE: Venture = {
  id: 'demo-quickprint-01',
  userId: 'demo-user',
  name: 'QuickPrint',
  industry: 'Campus Logistics & Student Services',
  stage: 'Idea Stage',
  tagline: 'Student print & delivery platform',
  createdAt: '2026-03-15T10:00:00Z',
  lastUpdated: 'Today at 09:42 AM',
  pitchCompletion: 78,
  criticStatus: 'issues_found',
  isDemo: true,
  questionnaire: {
    ventureName: 'QuickPrint',
    problem: 'University students face long queues, broken library printers, and inconvenient campus printing hours right before critical assignment and thesis deadlines, causing friction and missed submissions.',
    solution: 'A hyperlocal web-and-mobile printing and delivery platform that lets students upload documents, select finishing options, and receive delivered prints directly to dorms or campus pickup lockers within 45 minutes.',
    targetCustomers: 'Undergraduate and graduate university students living on or near campus who frequently submit physical reports, lab notes, blueprints, and senior capstone projects.',
    whoBenefits: 'Students save an average of 40 minutes per deadline sprint; local certified print shops gain predictable student print volume during off-peak and evening hours.',
    industry: 'EdTech & Campus On-Demand Services',
    marketOpportunity: 'Approximately 20 million college students across North America submit periodic physical course submissions and presentation packets, relying on aging campus-operated hardware.',
    ventureStage: 'Idea Stage',
    businessModel: 'Per-page print margin (e.g. standard black & white + color fees) plus a modest campus delivery convenience fee. Optional monthly subscription bundle for high-volume thesis students.',
    competition: 'On-campus university library printing facilities, commercial retail print centers (FedEx Office, UPS Store), and personal desktop home inkjet printers.',
    differentiation: 'Dedicated 45-minute dorm-room delivery, automated student formatting checks (preventing paper-size & bleed errors), and zero hardware ownership hassle for students.',
    goToMarket: 'Direct student ambassador activation in dormitory halls, student union flyer partnerships, and orientation week free-print vouchers.',
    currentTraction: 'Conducted 65 student discovery interviews at 2 university campuses; 52 respondents reported regular library queue frustration. 1 local commercial print shop agreed in principle to fulfill batch pilot orders.',
    financialModel: 'Unit economics based on estimated gross cost of $0.03 per page from wholesale print partner, customer price of $0.10 per page, and $2.50 flat delivery fee per drop.',
    fundingRequirement: '$150,000 pre-seed round',
    useOfFunds: 'Software platform development (45%), initial two-campus pilot fulfillment logistics (30%), campus brand ambassador incentives (15%), legal & operational buffer (10%).'
  },
  slides: [
    {
      id: 'slide-1',
      slideNumber: 1,
      category: 'title',
      title: 'QuickPrint',
      subtitle: 'Hyperlocal Printing & Delivery for University Campuses',
      headline: 'Light the way from dorm room to submission desk.',
      keyPoints: [
        'Founder: University Student & Campus Operations Team',
        'Stage: Idea Stage (Validation Phase)',
        'Target Market: Higher Education Campuses'
      ],
      facts: ['Campus student service concept', 'Focused on university ecosystems'],
      assumptions: ['Campus density enables 45-minute bicycle/walking courier fulfillment'],
      evidenceNeeded: ['Pilot operational confirmation'],
      speakerNotes: 'Introduce QuickPrint as an on-demand campus service designed to eliminate student printing stress during critical academic deadlines.'
    },
    {
      id: 'slide-2',
      slideNumber: 2,
      category: 'problem',
      title: 'The Problem',
      subtitle: 'Campus Printing is Broken, Fragmented, and Time-Consuming',
      headline: 'Deadlines do not wait for jammed library printers.',
      keyPoints: [
        'Long physical queues at library computer labs right before 9 AM and midnight deadlines',
        'Frequent hardware downtime, toner shortages, and card balance reload errors',
        'Personal dorm printers are expensive, prone to ink drying, and bulky for shared rooms',
        'Commercial print shops are located off-campus with restrictive operating hours'
      ],
      facts: ['65 student interviews completed across 2 campuses', '52 students reported regular library queue frustration'],
      assumptions: ['Printing bottlenecks occur uniformly across semesters'],
      evidenceNeeded: ['Campus facility log data on printer outages'],
      visualType: 'pillars',
      speakerNotes: 'Walk through the acute frustration students face before major deadlines, supported by our initial 65 user discovery interviews.'
    },
    {
      id: 'slide-3',
      slideNumber: 3,
      category: 'solution',
      title: 'The Solution',
      subtitle: 'Hyperlocal On-Demand Campus Print & Delivery',
      headline: 'Upload from bed. Receive bound prints at your dorm door in 45 minutes.',
      keyPoints: [
        'One-click cloud upload with auto-format verification for academic papers',
        'Distributed routing to partner print shops within 1 mile of campus perimeter',
        'Student courier network delivering directly to residence halls and campus study hubs',
        'Real-time order tracking and SMS notification upon delivery'
      ],
      facts: ['1 local certified print shop agreed in principle to fulfill pilot orders'],
      assumptions: ['Batching allows under 45-minute turnaround during peak evening hours'],
      evidenceNeeded: ['End-to-end turnaround benchmark in live pilot'],
      visualType: 'flow',
      speakerNotes: 'Demonstrate the simplicity of the student workflow: drag-and-drop file upload to dorm-room doorstep fulfillment.'
    },
    {
      id: 'slide-4',
      slideNumber: 4,
      category: 'target_market',
      title: 'Target Customers',
      subtitle: 'Higher Education Students with High-Frequency Physical Deliverables',
      headline: 'Focusing on dense campus populations with mandatory physical submission requirements.',
      keyPoints: [
        'Primary: STEM, Law, Architecture, and Business students requiring bound reports and presentations',
        'Secondary: Student clubs, Greek life organizations, and academic event coordinators needing flyers and posters',
        'Initial Beachhead: High-density residential campuses with strict vehicular access restrictions'
      ],
      facts: ['Interviewed 65 students across undergraduate and graduate levels'],
      assumptions: ['High-volume majors spend $60-$120 per semester on print services'],
      evidenceNeeded: ['Granular audit of syllabus-mandated physical printing volume by department'],
      visualType: 'pillars',
      speakerNotes: 'Identify our beachhead customer persona—specifically students in high-output majors where physical deliverables remain standard.'
    },
    {
      id: 'slide-5',
      slideNumber: 5,
      category: 'market_opportunity',
      title: 'Market Opportunity',
      subtitle: 'University Campus Specialty Print & Logistics',
      headline: 'High-density micro-economies with concentrated recurring demand.',
      keyPoints: [
        'Macro Environment: ~20M college students in the United States across 4,000+ accredited institutions',
        'Beachhead Segment: 15 large residential state universities with 30,000+ on-campus students each',
        'Structural Advantage: Walking-density geographic clusters minimize delivery dispatch radii to <1.5 miles'
      ],
      facts: ['Targeting top-tier residential university campuses'],
      assumptions: ['Total addressable market estimate assumes 40% of students print physical materials at least 3x per semester'],
      evidenceNeeded: ['Audited industry market sizing report for on-campus student spending'],
      visualType: 'market_size',
      metrics: [
        { label: 'Total US Students', value: '~20M', isAssumption: false },
        { label: 'Pilot Campus Target', value: '2 Campuses', isAssumption: false },
        { label: 'Est. Annual Spend/Student', value: '$75', isAssumption: true }
      ],
      speakerNotes: 'Provide transparent market context. Emphasize that while the macro student population is 20 million, our initial model focuses strictly on 2 high-density pilot campuses.'
    },
    {
      id: 'slide-6',
      slideNumber: 6,
      category: 'business_model',
      title: 'Business Model',
      subtitle: 'Per-Order Print Spread Plus Flat Convenience Delivery Fee',
      headline: 'Asset-light marketplace connecting student demand to surplus commercial print capacity.',
      keyPoints: [
        'Print Margin: Customer price $0.10/page vs. partner wholesale cost of $0.03/page ($0.07 gross profit spread)',
        'Delivery Convenience: $2.50 flat fee per delivery run (courier compensation modeled at $1.75/drop)',
        'Value-Add Finishing: Binding, stapling, high-gloss covers ($3.00 - $8.00 per booklet)',
        'Semester Pass (Future): $29/semester subscription with unlimited free deliveries'
      ],
      facts: ['Wholesale print rate of $0.03/page negotiated in principle with 1 local provider'],
      assumptions: ['Average order size of 24 pages per submission sprint', 'Couriers achieve 2.5 drops per hour on foot/bicycle'],
      evidenceNeeded: ['Live partner fee agreement and courier payout validation'],
      visualType: 'flow',
      speakerNotes: 'Highlight the asset-light operational model. We do not purchase expensive heavy printers; we route orders to existing local print facilities.'
    },
    {
      id: 'slide-7',
      slideNumber: 7,
      category: 'competition',
      title: 'Competition & Differentiation',
      subtitle: 'Why Alternatives Fail the Modern Digital Student',
      headline: 'Speed, convenience, and formatting reliability beat legacy queues.',
      keyPoints: [
        'Campus Library Labs: Cheap but severe queue bottlenecks, frequent downtime, no delivery',
        'Personal Dorm Inkjets: High upfront hardware cost, frequent cartridge replacement, ink dry-out',
        'Commercial Retail (FedEx/UPS): High pricing ($0.25+/page), inconvenient off-campus travel required',
        'QuickPrint Moat: Hyperlocal dorm-room delivery, pre-flight PDF format auto-checks, campus locker integrations'
      ],
      facts: ['Comparison against existing alternatives established via student surveys'],
      assumptions: ['QuickPrint brand loyalty develops within 3 weeks of semester start'],
      evidenceNeeded: ['Net Promoter Score (NPS) benchmark from pilot run'],
      visualType: 'comparison',
      speakerNotes: 'Articulate why current solutions leave students stranded, and how QuickPrint bridges the last-mile gap.'
    },
    {
      id: 'slide-8',
      slideNumber: 8,
      category: 'gtm',
      title: 'Go-To-Market Strategy',
      subtitle: 'Grassroots Campus Density Playbook',
      headline: 'Winning dormitory by dormitory through student peer ambassadors.',
      keyPoints: [
        'Phase 1 (Pre-Launch): Campus Ambassador program across 8 largest freshman residence halls',
        'Phase 2 (Orientation Week): "First 20 Pages Free" welcome voucher distributed during dorm move-in',
        'Phase 3 (Midterms/Finals): Targeted exam-week sprint promotions and 24-hour express fulfillment windows',
        'Phase 4 (Academic Clubs): Direct sponsorship of engineering society and student government presentation packets'
      ],
      facts: ['Strategy built around direct physical campus activation'],
      assumptions: ['Customer Acquisition Cost (CAC) under $4.50 per student via peer ambassador referrals'],
      evidenceNeeded: ['Empirical CAC and viral coefficient data from initial pilot'],
      visualType: 'timeline',
      speakerNotes: 'Explain the low-cost campus ambassador acquisition flywheel designed specifically for concentrated collegiate communities.'
    },
    {
      id: 'slide-9',
      slideNumber: 9,
      category: 'traction',
      title: 'Traction & Milestones',
      subtitle: 'Discovery Phase Completed; Preparing for First Campus Pilot',
      headline: 'Real validation without fabricated numbers.',
      keyPoints: [
        'Completed: 65 detailed student discovery interviews confirming acute workflow pain points',
        'Completed: Functional web ordering interface prototype completed for desktop and mobile',
        'Completed: Operational partnership terms discussed in principle with 1 commercial print shop',
        'Upcoming Milestone: Launch 8-week closed beta pilot on 1 campus targeting 500 active student orders',
        'Upcoming Milestone: Establish dormitory representative coverage across top 6 campus living complexes'
      ],
      facts: ['65 student interviews completed', '1 print shop partnership in preliminary discussion'],
      assumptions: ['Pilot conversion rate will reach 15% of reached dorm residents'],
      evidenceNeeded: ['Actual paid order volume and repeat order retention rate'],
      visualType: 'timeline',
      speakerNotes: 'Be completely transparent with investors: we are in the validation phase with strong qualitative signal, preparing for our first pilot launch.'
    },
    {
      id: 'slide-10',
      slideNumber: 10,
      category: 'financials',
      title: 'Financial Logic & Unit Economics',
      subtitle: 'Predictable Contribution Margin per Order Drop',
      headline: 'Positive unit contribution on every delivery run.',
      keyPoints: [
        'Modeled Average Order Value (AOV): $4.90 (24 pages @ $0.10 + $2.50 delivery fee)',
        'Cost of Goods Sold (COGS): $0.72 print cost ($0.03/page) + $1.75 courier payout = $2.47',
        'Gross Contribution per Drop: $2.43 (49.6% gross margin)',
        'Break-even Target: 65 orders per day per campus to cover fixed campus coordinator stipend'
      ],
      facts: ['Unit economics based on wholesale quote and projected student pricing'],
      assumptions: ['Average order size remains 24 pages', 'Courier delivery density enables $1.75 compensation rate'],
      evidenceNeeded: ['Empirical order batching efficiency and realized average order sizes during finals weeks'],
      visualType: 'flow',
      speakerNotes: 'Walk through the unit economics showing that each order generates positive gross contribution margin without requiring heavy balance sheet investments.'
    },
    {
      id: 'slide-11',
      slideNumber: 11,
      category: 'funding',
      title: 'Funding Ask & Use of Funds',
      subtitle: 'Targeting $150,000 Pre-Seed Round',
      headline: 'Funding our 2-campus pilot and validating repeatable student unit economics.',
      keyPoints: [
        'Funding Target: $150,000 pre-seed capital',
        'Use of Funds — 45% Software & Courier Dispatch App ($67,500)',
        'Use of Funds — 30% Pilot Operations & Partner Print Guarantees ($45,000)',
        'Use of Funds — 15% Campus Ambassador Acquisition & Vouchers ($22,500)',
        'Use of Funds — 10% Operational Contingency & Regulatory Compliance ($15,000)',
        '12-Month Target: 10,000 completed student orders across 2 launch campuses'
      ],
      facts: ['$150,000 total pre-seed ask', 'Defined budget allocation breakdown'],
      assumptions: ['12-month runway is sufficient to reach Series Seed institutional milestones'],
      evidenceNeeded: ['Clear pilot milestones for Series Seed inflection'],
      visualType: 'allocation',
      metrics: [
        { label: 'Target Capital', value: '$150,000', isAssumption: false },
        { label: 'Target Runway', value: '12 Months', isAssumption: true },
        { label: 'Milestone', value: '10K Orders', isAssumption: true }
      ],
      speakerNotes: 'Conclude with the clear funding request, disciplined capital allocation, and concrete milestone goals for the next 12 months.'
    }
  ],
  critique: [
    {
      id: 'critic-1',
      category: 'Market Opportunity',
      severity: 'Warning',
      slideNumber: 5,
      problem: 'Your market opportunity cites 20M college students broadly, but lacks evidence supporting the actual percentage of coursework that still mandates physical paper printing.',
      whyItMatters: 'Investors need to understand whether physical course submissions are a sustainable market or a rapidly shrinking legacy practice being replaced by Canvas/Blackboard digital uploads.',
      suggestedImprovement: 'Add a transparent breakdown showing physical submission requirements by major (e.g. engineering design reviews, legal briefs, architecture portfolios) vs general lecture courses.',
      resolved: false
    },
    {
      id: 'critic-2',
      category: 'Traction & Milestones',
      severity: 'Critical',
      slideNumber: 9,
      problem: 'The pitch relies entirely on 65 qualitative discovery interviews without any transactional pre-orders, waitlist signups, or letters of intent.',
      whyItMatters: 'Investors cannot determine willingness to pay from conversational feedback alone; users often express enthusiasm in interviews but resist paying in practice.',
      suggestedImprovement: 'Run a 3-day manual concierge test (using a simple WhatsApp/Google Form hotline) to fulfill 25 real paid orders before presenting to institutional investors.',
      resolved: false
    },
    {
      id: 'critic-3',
      category: 'Competitive Defense',
      severity: 'Warning',
      slideNumber: 7,
      problem: 'The barrier to entry against an incumbent university print contractor (like Ricoh or Canon Managed Services) launching their own locker pickup is not clearly defended.',
      whyItMatters: 'Hardware vendors already have master service agreements with universities and could integrate mobile lockers if student demand proves lucrative.',
      suggestedImprovement: 'Clarify your proprietary advantage: student brand affinity, faster dorm doorstep delivery (which institutional vendors refuse to staff), and software integration.',
      resolved: false
    },
    {
      id: 'critic-4',
      category: 'Financial Logic',
      severity: 'Critical',
      slideNumber: 10,
      problem: 'Courier compensation of $1.75 per drop may be insufficient to retain student bike messengers, especially during inclement winter weather on northern campuses.',
      whyItMatters: 'If courier churn is high, delivery guarantees will fail during exam week rushes, causing catastrophic service breakdowns.',
      suggestedImprovement: 'Test a batching model where couriers deliver 3-5 orders per building cluster to achieve an effective wage of $18-$22/hour while keeping per-order costs low.',
      resolved: false
    },
    {
      id: 'critic-5',
      category: 'Go-To-Market',
      severity: 'Info',
      slideNumber: 8,
      problem: 'Voucher distribution during move-in week is expensive and may attract non-recurring one-time users.',
      whyItMatters: 'Customer lifetime value (LTV) must support the promotional subsidy; high churn among freshman degrades unit economics.',
      suggestedImprovement: 'Tie the free-print voucher to creating an account and saving payment details, or focus vouchers on student course group leaders.',
      resolved: false
    },
    {
      id: 'critic-6',
      category: 'Funding Ask',
      severity: 'Info',
      slideNumber: 11,
      problem: 'The $150,000 ask lacks explicit milestone gates tied to follow-on Seed round metrics.',
      whyItMatters: 'Angel and pre-seed investors want to know exactly what proof points this capital unlocks so the company can raise its next round safely.',
      suggestedImprovement: 'Explicitly state: "$150k gets us to 10k orders and $35k ARR, which satisfies typical regional seed fund qualification criteria."',
      resolved: false
    }
  ],
  analysis: {
    overallReadiness: 'Validation Stage — Strong qualitative problem identification, but requires operational pilot data before institutional investor pitching.',
    dimensions: [
      {
        dimension: 'Problem Strength',
        status: 'Strong',
        summary: 'Direct, relatable friction point for university students with verified interview signals.',
        details: 'The problem of library print queues, hardware outages, and inconvenient hours before deadlines is visceral and confirmed across 65 user interviews.'
      },
      {
        dimension: 'Solution Clarity',
        status: 'Strong',
        summary: 'Clear on-demand marketplace mechanic with clean user journey.',
        details: 'Hyperlocal routing to existing print shops solves hardware capex, while dorm delivery solves the student convenience bottleneck.'
      },
      {
        dimension: 'Market Opportunity',
        status: 'Needs Evidence',
        summary: 'Macro size is clear, but secular digital transition risk requires evidence.',
        details: 'The broader shift to digital submission (LMS) means total addressable paper volume may decline; need major-by-major segmentation.'
      },
      {
        dimension: 'Competitive Position',
        status: 'Needs Evidence',
        summary: 'Defensibility against university incumbents relies primarily on speed and brand.',
        details: 'No patent or technological barrier; defensive moat must come from campus network density and exclusive student partner status.'
      },
      {
        dimension: 'Business Model',
        status: 'Strong',
        summary: 'Asset-light marketplace with immediate cash collection on orders.',
        details: 'Gross spread on pages plus flat delivery fee provides positive unit contribution if courier batching works as planned.'
      },
      {
        dimension: 'Go-To-Market',
        status: 'Strong',
        summary: 'High organic density in campus dormitories allows targeted word-of-mouth growth.',
        details: 'Dorm ambassadors, student union clubs, and exam-week targeted marketing are proven acquisition vectors for collegiate apps.'
      },
      {
        dimension: 'Traction',
        status: 'Challenged',
        summary: 'Zero paid transactional history to date; purely qualitative discovery.',
        details: '65 interviews is a solid foundation, but institutional investors demand proof of willingness to pay and repeat retention.'
      },
      {
        dimension: 'Financial Logic',
        status: 'Needs Evidence',
        summary: 'Unit economics look attractive on paper, but courier labor reliability is untested.',
        details: 'Fulfillment economics must be proven in real winter weather and during 2 AM peak deadline spikes.'
      },
      {
        dimension: 'Investor Readiness',
        status: 'Needs Evidence',
        summary: 'Ready for angel/incubator conversations; needs pilot data for institutional seed.',
        details: 'A focused 8-week pilot proving repeat usage will transform this venture into an exceptionally attractive pre-seed candidate.'
      }
    ],
    whatIsWorking: [
      'Authentic student-problem founder empathy rooted in 65 first-hand discovery interviews',
      'Asset-light fulfillment structure that avoids purchasing expensive industrial printers',
      'Positive unit contribution margin modeled on every completed order drop',
      'High geographic clustering on residential campuses that reduces transit times to under 1.5 miles'
    ],
    whatNeedsEvidence: [
      'Empirical proof of student willingness to pay a $2.50 delivery premium over walking to a library',
      'Reliability and willingness of student couriers to deliver during late night and cold weather shifts',
      'Verification of average order page count across diverse academic disciplines'
    ],
    whatInvestorsMayChallenge: [
      'Is the physical printing market declining too fast as universities move to full digital grading?',
      'Why won\'t campus bookstores or library facilities launch their own pickup lockers?',
      'How do you manage extreme demand seasonality where 70% of orders occur during 4 weeks of finals?'
    ],
    recommendedNextActions: [
      'Launch a 2-week manual concierge pilot on 1 campus to fulfill 50 real paid orders without building full software',
      'Survey 10 department chairs to identify which specific courses legally or pedagogically require paper submissions',
      'Sign a binding pilot fulfillment agreement with 1 local print vendor specifying per-page rates and turnaround SLAs'
    ],
    lastUpdated: '2026-03-15T12:00:00Z'
  },
  investorQuestions: [
    {
      id: 'iq-1',
      category: 'Market',
      question: 'With universities shifting heavily toward digital submissions on Canvas and Blackboard, isn\'t physical printing a secularly declining market?',
      suggestedAnswer: 'While routine homework submissions have transitioned to digital, significant academic deliverables—such as senior engineering capstone packets, architecture portfolios, lab binders, student legal briefs, and thesis manuscripts—still mandate physical evaluation. Furthermore, campus clubs, student government elections, and Greek life events drive constant non-academic physical collateral demand.',
      isEvidenceNeeded: true,
      evidenceMissingDetails: 'Need audit data quantifying percentage of course syllabi requiring physical hard copies at pilot universities.',
      tags: ['Market Size', 'Digital Trends']
    },
    {
      id: 'iq-2',
      category: 'Competition',
      question: 'Why can\'t an existing commercial print shop like FedEx Office or UPS simply offer dorm delivery themselves?',
      suggestedAnswer: 'Commercial retail print chains operate standard 9-to-6 retail storefronts off-campus and are structured around commercial B2B contracts. They lack the campus-specific security clearances, student courier networks, and localized software integrations required to access student residential dormitories efficiently.',
      isEvidenceNeeded: false,
      tags: ['Defensibility', 'Incumbent Response']
    },
    {
      id: 'iq-3',
      category: 'Traction',
      question: 'You interviewed 65 students, but how many have actually pre-paid or committed dollars to use QuickPrint?',
      suggestedAnswer: 'Currently, QuickPrint has completed 65 qualitative discovery interviews without collecting cash pre-orders. We have intentionally chosen to validate problem severity and pricing thresholds qualitatively before initiating our upcoming 500-student closed beta pilot.',
      isEvidenceNeeded: true,
      evidenceMissingDetails: 'Evidence needed: Your current venture information does not establish transactional pre-order data yet.',
      tags: ['Validation', 'Revenue']
    },
    {
      id: 'iq-4',
      category: 'Business Model',
      question: 'How do you prevent partner print shops from experiencing bottlenecks during final exam week?',
      suggestedAnswer: 'Our partner print shop operates commercial high-speed digital presses running at 90+ pages per minute, whereas campus library desktop printers run at 15-20 pages per minute. The commercial partner has confirmed surplus capacity during evening hours when student submission rushes peak.',
      isEvidenceNeeded: false,
      tags: ['Operations', 'SLA']
    },
    {
      id: 'iq-5',
      category: 'Financials',
      question: 'How do you keep student courier turnover from wiping out your unit economics?',
      suggestedAnswer: 'We model student courier earnings on an order-cluster basis rather than single point-to-point dispatches. By batching deliveries within the same residential hall complex, couriers can complete 3 to 4 drops in a single 20-minute route, translating to an effective hourly rate of $18-$22.',
      isEvidenceNeeded: true,
      evidenceMissingDetails: 'Courier retention and route batching efficiency must be verified during pilot operations.',
      tags: ['Unit Economics', 'Labor']
    },
    {
      id: 'iq-6',
      category: 'Funding',
      question: 'What happens if $150,000 is exhausted before you hit 10,000 completed orders?',
      suggestedAnswer: 'Because QuickPrint is built on an asset-light model with zero printer capital expenditures, our fixed burn rate is constrained to software hosting, student ambassador stipends, and minimal insurance. If order velocity is slower than modeled, we can sustain operations across our single pilot campus with minimal cash draw.',
      isEvidenceNeeded: false,
      tags: ['Runway', 'Capital Efficiency']
    }
  ]
};

export const demoVenture = DEMO_QUICKPRINT_VENTURE;
