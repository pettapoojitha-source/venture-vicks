import { useState, useEffect } from 'react';
import { 
  Venture, 
  UserProfile, 
  QuestionnaireData, 
  PitchSlide, 
  AppView,
  UiDesignMode 
} from './types';
import { 
  getStoredVentures, 
  saveStoredVentures, 
  getCurrentUser, 
  setCurrentUser, 
  clearCurrentUser,
  syncVenturesWithSupabase
} from './lib/storage';
import { demoVenture } from './data/demoVenture';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { CreateVentureWizard } from './components/CreateVentureWizard';
import { PitchStudio } from './components/PitchStudio';
import { VcCriticView } from './components/VcCriticView';
import { VentureAnalysisView } from './components/VentureAnalysisView';
import { InvestorRoomView } from './components/InvestorRoomView';
import { PresentationMode } from './components/PresentationMode';
import { WicksAiDrawer } from './components/WicksAiDrawer';

// Executive Obsidian UI Suite
import { ExecutiveNavbar } from './components/executive/ExecutiveNavbar';
import { ExecutiveLanding } from './components/executive/ExecutiveLanding';
import { ExecutiveDashboard } from './components/executive/ExecutiveDashboard';
import { ExecutiveStudio } from './components/executive/ExecutiveStudio';
import { ExecutiveCritic } from './components/executive/ExecutiveCritic';
import { ExecutiveAnalysis } from './components/executive/ExecutiveAnalysis';
import { ExecutiveInvestorRoom } from './components/executive/ExecutiveInvestorRoom';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [uiMode, setUiMode] = useState<UiDesignMode>(() => {
    return (localStorage.getItem('venture_wicks_ui_mode') as UiDesignMode) || 'executive';
  });
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [activeVenture, setActiveVenture] = useState<Venture | null>(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  const handleToggleUiMode = () => {
    const nextMode: UiDesignMode = uiMode === 'executive' ? 'editorial' : 'executive';
    setUiMode(nextMode);
    localStorage.setItem('venture_wicks_ui_mode', nextMode);
  };

  // Initialize data on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
    }

    const loadedVentures = getStoredVentures();
    setVentures(loadedVentures);

    // Set demo venture as active if available
    const demo = loadedVentures.find((v) => v.isDemo) || loadedVentures[0];
    if (demo) {
      setActiveVenture(demo);
    }
  }, []);

  const handleUpdateVentures = (updatedList: Venture[]) => {
    setVentures(updatedList);
    saveStoredVentures(updatedList);
    syncVenturesWithSupabase(updatedList, currentUser?.id);
  };

  const handleUpdateActiveVenture = (updated: Venture) => {
    setActiveVenture(updated);
    const updatedList = ventures.map((v) => (v.id === updated.id ? updated : v));
    handleUpdateVentures(updatedList);
  };

  // Auth Actions
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUserState(user);
    // If on landing, transition to dashboard
    if (currentView === 'landing') {
      setCurrentView('dashboard');
    }
  };

  const handleSignOut = () => {
    clearCurrentUser();
    setCurrentUserState(null);
    setCurrentView('landing');
  };

  // Venture Actions
  const handleSelectVenture = (venture: Venture) => {
    setActiveVenture(venture);
    setCurrentView('studio');
  };

  const handleExploreDemo = () => {
    const demo = ventures.find((v) => v.isDemo) || demoVenture;
    setActiveVenture(demo);
    setCurrentView('studio');
  };

  const handleStartVenture = () => {
    setCurrentView('wizard');
  };

  const handleDuplicateVenture = (venture: Venture) => {
    const copy: Venture = {
      ...venture,
      id: `venture-${Date.now()}`,
      name: `${venture.name} (Copy)`,
      isDemo: false,
      lastUpdated: 'Just now'
    };
    const updated = [copy, ...ventures];
    handleUpdateVentures(updated);
    setActiveVenture(copy);
  };

  const handleRenameVenture = (venture: Venture, newName: string) => {
    const updated = ventures.map((v) => (v.id === venture.id ? { ...v, name: newName } : v));
    handleUpdateVentures(updated);
    if (activeVenture?.id === venture.id) {
      setActiveVenture({ ...activeVenture, name: newName });
    }
  };

  const handleDeleteVenture = (ventureId: string) => {
    const updated = ventures.filter((v) => v.id !== ventureId);
    handleUpdateVentures(updated);
    if (activeVenture?.id === ventureId) {
      setActiveVenture(updated[0] || null);
    }
  };

  // Wizard Completion
  const handleWizardComplete = (questionnaire: QuestionnaireData, generatedSlides: PitchSlide[]) => {
    const newVenture: Venture = {
      id: `venture-${Date.now()}`,
      userId: currentUser?.id || 'founder-local',
      name: questionnaire.ventureName || 'Untitled Venture',
      tagline: questionnaire.solution.slice(0, 70),
      industry: questionnaire.industry || 'Technology',
      stage: questionnaire.ventureStage,
      createdAt: new Date().toISOString(),
      pitchCompletion: 85,
      criticStatus: 'unreviewed',
      lastUpdated: 'Just now',
      questionnaire,
      slides: generatedSlides,
      critique: [],
      analysis: {
        executiveSummary: `${questionnaire.ventureName} presents a focused solution targeting ${questionnaire.targetCustomers || 'early adopters'} with a disciplined commercial approach.`,
        strategicImperative: 'Validate willingness to pay with a high-density concierge pilot before expanding capital allocation.',
        dimensions: [
          {
            name: 'Problem Strength',
            dimension: 'Problem Strength',
            status: 'Compelling',
            analysis: questionnaire.problem,
            actionableStep: 'Interview 20 more users to verify frequency.'
          },
          {
            name: 'Solution Clarity',
            dimension: 'Solution Clarity',
            status: 'Defensible',
            analysis: questionnaire.solution,
            actionableStep: 'Ship functional MVP to pilot group.'
          },
          {
            name: 'Target Customer Focus',
            dimension: 'Target Customer Focus',
            status: 'High Conviction',
            analysis: questionnaire.targetCustomers,
            actionableStep: 'Narrow launch beachhead to 1-2 dense cohorts.'
          },
          {
            name: 'Market Opportunity',
            dimension: 'Market Opportunity',
            status: 'Needs Grounding',
            analysis: questionnaire.marketOpportunity,
            actionableStep: 'Build bottom-up beachhead sizing.'
          },
          {
            name: 'Business Model',
            dimension: 'Business Model',
            status: 'Defensible',
            analysis: questionnaire.businessModel,
            actionableStep: 'Test price sensitivity on initial transactions.'
          },
          {
            name: 'Defensibility / Moat',
            dimension: 'Defensibility / Moat',
            status: 'Early Hypothesis',
            analysis: questionnaire.differentiation,
            actionableStep: 'Secure exclusive local channel access.'
          },
          {
            name: 'Go-To-Market',
            dimension: 'Go-To-Market',
            status: 'Validating',
            analysis: questionnaire.goToMarket,
            actionableStep: 'Launch student ambassador pilot.'
          },
          {
            name: 'Evidence / Traction',
            dimension: 'Evidence / Traction',
            status: questionnaire.currentTraction ? 'Validating' : 'Needs Evidence',
            analysis: questionnaire.currentTraction || 'No validated customer metrics recorded yet.',
            actionableStep: 'Complete 50 paid transactions.'
          },
          {
            name: 'Funding Ask Realism',
            dimension: 'Funding Ask Realism',
            status: 'Disciplined',
            analysis: `${questionnaire.fundingRequirement} allocated across ${questionnaire.useOfFunds}`,
            actionableStep: 'Tie capital tranches directly to de-risking milestone thresholds.'
          }
        ]
      },
      investorQuestions: [
        {
          id: 'q-1',
          category: 'Business Model',
          question: `How do unit margins for ${questionnaire.ventureName} sustain scaling overhead?`,
          founderAnswer: questionnaire.financialModel || 'Gross contribution remains positive on each transaction.',
          suggestedAnswer: questionnaire.financialModel || 'Gross contribution remains positive on each transaction.',
          isEvidenceNeeded: false,
          evidenceCheck: 'Grounded Assumption'
        },
        {
          id: 'q-2',
          category: 'Competition',
          question: 'Why won’t incumbent market leaders copy this workflow immediately?',
          founderAnswer: questionnaire.differentiation || 'Incumbents have high legacy overhead and lack hyper-local distribution trust.',
          suggestedAnswer: questionnaire.differentiation || 'Incumbents have high legacy overhead and lack hyper-local distribution trust.',
          isEvidenceNeeded: false,
          evidenceCheck: 'Grounded Assumption'
        },
        {
          id: 'q-3',
          category: 'Traction',
          question: 'What definitive proof validates that customers will pay repeatedly?',
          founderAnswer: questionnaire.currentTraction || 'Evidence missing. Concierge pilot currently in progress.',
          suggestedAnswer: questionnaire.currentTraction || 'Evidence missing. Concierge pilot currently in progress.',
          isEvidenceNeeded: !questionnaire.currentTraction,
          evidenceCheck: questionnaire.currentTraction ? 'Verified Fact' : 'Evidence Missing'
        }
      ]
    };

    const updated = [newVenture, ...ventures];
    handleUpdateVentures(updated);
    setActiveVenture(newVenture);
    setCurrentView('studio');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans ${
        uiMode === 'executive'
          ? 'bg-[#090A0F] text-slate-100 selection:bg-[#FF5722]/30 selection:text-[#FF8A65]'
          : 'bg-[#FAF8F5] text-[#191716] selection:bg-[#E8732A]/20'
      }`}
    >
      {/* Top Navbar */}
      {currentView !== 'landing' && (
        uiMode === 'executive' ? (
          <ExecutiveNavbar
            currentView={currentView}
            onNavigate={(view: AppView) => setCurrentView(view)}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSignOut={handleSignOut}
            ventures={ventures}
            activeVenture={activeVenture}
            onSelectVenture={(v: Venture) => {
              setActiveVenture(v);
              if (currentView === 'dashboard') {
                setCurrentView('studio');
              }
            }}
            onCreateNewVenture={() => setCurrentView('wizard')}
            onStartPresentation={() => setIsPresentationOpen(true)}
            uiMode={uiMode}
            onToggleUiMode={handleToggleUiMode}
          />
        ) : (
          <Navbar
            currentView={currentView}
            onNavigate={(view: AppView) => setCurrentView(view)}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onSignOut={handleSignOut}
            ventures={ventures}
            activeVenture={activeVenture}
            onSelectVenture={(v: Venture) => {
              setActiveVenture(v);
              if (currentView === 'dashboard') {
                setCurrentView('studio');
              }
            }}
            onCreateNewVenture={() => setCurrentView('wizard')}
            onStartPresentation={() => setIsPresentationOpen(true)}
            uiMode={uiMode}
            onToggleUiMode={handleToggleUiMode}
          />
        )
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          uiMode === 'executive' ? (
            <ExecutiveLanding
              onStartNew={() => setCurrentView('wizard')}
              onExploreDemo={handleExploreDemo}
              uiMode={uiMode}
              onToggleUiMode={handleToggleUiMode}
            />
          ) : (
            <LandingPage
              onStartVenture={() => setCurrentView('wizard')}
              onExploreDemo={handleExploreDemo}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              uiMode={uiMode}
              onToggleUiMode={handleToggleUiMode}
            />
          )
        )}

        {currentView === 'dashboard' && (
          uiMode === 'executive' ? (
            <ExecutiveDashboard
              ventures={ventures}
              activeVenture={activeVenture}
              onSelectVenture={handleSelectVenture}
              onCreateNewVenture={() => setCurrentView('wizard')}
              onNavigateToStudio={() => setCurrentView('studio')}
              onNavigateToCritic={() => setCurrentView('critic')}
              onStartPresentation={() => setIsPresentationOpen(true)}
            />
          ) : (
            <Dashboard
              currentUser={currentUser}
              ventures={ventures}
              onSelectVenture={handleSelectVenture}
              onCreateNewVenture={() => setCurrentView('wizard')}
              onDuplicateVenture={handleDuplicateVenture}
              onRenameVenture={handleRenameVenture}
              onDeleteVenture={handleDeleteVenture}
            />
          )
        )}

        {currentView === 'wizard' && (
          <CreateVentureWizard
            initialData={activeVenture?.questionnaire}
            onComplete={handleWizardComplete}
            onCancel={() => setCurrentView(ventures.length > 0 ? 'dashboard' : 'landing')}
          />
        )}

        {currentView === 'studio' && activeVenture && (
          uiMode === 'executive' ? (
            <ExecutiveStudio
              venture={activeVenture}
              onUpdateVenture={handleUpdateActiveVenture}
              onStartPresentation={() => setIsPresentationOpen(true)}
              onNavigateToCritic={() => setCurrentView('critic')}
            />
          ) : (
            <PitchStudio
              venture={activeVenture}
              onUpdateVenture={handleUpdateActiveVenture}
              onStartPresentation={() => setIsPresentationOpen(true)}
              onNavigateToCritic={() => setCurrentView('critic')}
            />
          )
        )}

        {currentView === 'critic' && activeVenture && (
          uiMode === 'executive' ? (
            <ExecutiveCritic
              venture={activeVenture}
              onUpdateVenture={handleUpdateActiveVenture}
              onNavigateToSlide={(slideNum) => {
                setCurrentView('studio');
              }}
            />
          ) : (
            <VcCriticView
              venture={activeVenture}
              onUpdateVenture={handleUpdateActiveVenture}
              onNavigateToStudio={() => setCurrentView('studio')}
            />
          )
        )}

        {currentView === 'analysis' && activeVenture && (
          uiMode === 'executive' ? (
            <ExecutiveAnalysis
              venture={activeVenture}
              onUpdateVenture={handleUpdateActiveVenture}
              onNavigateToStudio={() => setCurrentView('studio')}
            />
          ) : (
            <VentureAnalysisView
              venture={activeVenture}
              onUpdateVenture={handleUpdateActiveVenture}
              onNavigateToStudio={() => setCurrentView('studio')}
            />
          )
        )}

        {currentView === 'investor' && activeVenture && (
          uiMode === 'executive' ? (
            <ExecutiveInvestorRoom
              venture={activeVenture}
              onUpdateVenture={handleUpdateActiveVenture}
            />
          ) : (
            <InvestorRoomView
              venture={activeVenture}
              onUpdateVenture={handleUpdateActiveVenture}
              onNavigateToStudio={() => setCurrentView('studio')}
            />
          )
        )}
      </main>

      {/* Full-Screen Presentation Mode Overlay */}
      {isPresentationOpen && activeVenture && (
        <PresentationMode
          venture={activeVenture}
          onExit={() => setIsPresentationOpen(false)}
        />
      )}

      {/* Persistent Wicks AI Assistant Floating Drawer */}
      <WicksAiDrawer venture={activeVenture} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
