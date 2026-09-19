import { useState } from 'react';
import { VentureLogo } from './VentureLogo';
import { UserProfile, Venture, AppView } from '../types';
import { 
  Bell, 
  ChevronDown, 
  User, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  HelpCircle, 
  Play, 
  FileText, 
  BarChart3, 
  LogOut,
  Plus,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  ventures: Venture[];
  activeVenture: Venture | null;
  onSelectVenture: (venture: Venture) => void;
  onCreateNewVenture: () => void;
  onStartPresentation: () => void;
}

export function Navbar({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onSignOut,
  ventures,
  activeVenture,
  onSelectVenture,
  onCreateNewVenture,
  onStartPresentation
}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showVentureSelector, setShowVentureSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'VC Critic Completed', desc: 'Identified 2 critical weaknesses in Pitch Deck.', time: '12m ago' },
    { id: '2', title: 'Factual Grounding Alert', desc: 'Slide 5 contains 1 unverified market assumption.', time: '1h ago' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7DFD5] transition-all select-none">
      {/* Level 1: Primary Brand & Venture Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo + Active Venture Selector */}
        <div className="flex items-center gap-6">
          <VentureLogo 
            size="md" 
            onClick={() => onNavigate('dashboard')} 
          />

          {/* Active Venture Dropdown Switcher */}
          {activeVenture && (
            <div className="relative hidden md:block">
              <button
                id="btn-venture-dropdown"
                onClick={() => setShowVentureSelector(!showVentureSelector)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F4EFE7] hover:bg-[#EAE2D6] border border-[#E0D7CC] text-xs font-semibold text-[#191716] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#D96B27]"></span>
                <span className="max-w-[140px] truncate">{activeVenture.name}</span>
                {activeVenture.isDemo && (
                  <span className="text-[9px] uppercase font-bold text-[#883607] bg-[#FCECDD] px-1 rounded">
                    Demo
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-[#736B63]" />
              </button>

              {showVentureSelector && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-[#E7DFD5] py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#8A8177] tracking-wider border-b border-[#F0EAE1]">
                    Switch Venture
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1 divide-y divide-[#FAF7F2]">
                    {ventures.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          onSelectVenture(v);
                          setShowVentureSelector(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#FAF7F2] transition-colors ${
                          v.id === activeVenture.id ? 'bg-[#FAF0E4] font-semibold text-[#883607]' : 'text-[#332D28]'
                        }`}
                      >
                        <div className="truncate">
                          <div>{v.name}</div>
                          <div className="text-[10px] text-[#7A7167]">{v.stage}</div>
                        </div>
                        {v.id === activeVenture.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D96B27] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#F0EAE1] pt-1.5 px-2">
                    <button
                      onClick={() => {
                        onCreateNewVenture();
                        setShowVentureSelector(false);
                      }}
                      className="w-full py-1.5 px-2.5 rounded text-xs font-semibold text-[#191716] hover:bg-[#FAF7F2] flex items-center justify-center gap-1.5 text-center"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#D96B27]" />
                      <span>Create New Venture</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Primary Navigation tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F3ECE1]/70 p-1 rounded-lg border border-[#E4DCD0]">
          <button
            id="nav-dashboard"
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all ${
              currentView === 'dashboard'
                ? 'bg-white text-[#191716] shadow-xs font-semibold'
                : 'text-[#696159] hover:text-[#191716] hover:bg-white/50'
            }`}
          >
            Dashboard
          </button>

          <button
            id="nav-studio"
            onClick={() => onNavigate('studio')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all ${
              currentView === 'studio'
                ? 'bg-white text-[#191716] shadow-xs font-semibold'
                : 'text-[#696159] hover:text-[#191716] hover:bg-white/50'
            }`}
          >
            Pitch Studio
          </button>

          <button
            id="nav-critic"
            onClick={() => onNavigate('critic')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all flex items-center gap-1 ${
              currentView === 'critic'
                ? 'bg-white text-[#191716] shadow-xs font-semibold'
                : 'text-[#696159] hover:text-[#191716] hover:bg-white/50'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-[#D96B27]" />
            <span>VC Critic</span>
          </button>

          <button
            id="nav-analysis"
            onClick={() => onNavigate('analysis')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all flex items-center gap-1 ${
              currentView === 'analysis'
                ? 'bg-white text-[#191716] shadow-xs font-semibold'
                : 'text-[#696159] hover:text-[#191716] hover:bg-white/50'
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            <span>Analysis</span>
          </button>

          <button
            id="nav-investor"
            onClick={() => onNavigate('investor')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all flex items-center gap-1 ${
              currentView === 'investor'
                ? 'bg-white text-[#191716] shadow-xs font-semibold'
                : 'text-[#696159] hover:text-[#191716] hover:bg-white/50'
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            <span>Investor Room</span>
          </button>
        </nav>

        {/* Right: Quick actions + User menu */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onCreateNewVenture}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#191716] text-white hover:bg-[#332F2A] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#E8732A]" />
            <span>New Venture</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md text-[#665E56] hover:text-[#191716] hover:bg-[#EFE9E0] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D96B27] rounded-full ring-2 ring-[#FAF8F5]"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-[#E7DFD5] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#F0EAE1] flex justify-between items-center">
                  <span className="text-xs font-semibold text-[#191716] tracking-wide uppercase">Notifications</span>
                  <span className="text-[10px] text-[#8C8379]">2 unread</span>
                </div>
                <div className="divide-y divide-[#F5EFE8]">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 text-xs hover:bg-[#FAF7F2] cursor-pointer">
                      <div className="font-semibold text-[#191716] mb-0.5">{n.title}</div>
                      <p className="text-[11px] text-[#696158] leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User menu or Login trigger */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-[#EFE9E0] border border-transparent hover:border-[#E2DAD0] transition-all"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-[#D9D1C5]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#E5DDD2] flex items-center justify-center text-xs font-semibold text-[#3D3732]">
                    {currentUser.fullName.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-medium text-[#292420] hidden lg:inline-block max-w-[90px] truncate">
                  {currentUser.fullName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#736B63]" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#E7DFD5] py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#F0EAE1]">
                    <p className="text-xs font-semibold text-[#191716]">{currentUser.fullName}</p>
                    <p className="text-[11px] text-[#786F66] truncate">@{currentUser.username}</p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#403A35] hover:bg-[#FAF7F2] flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    All Ventures
                  </button>
                  <button
                    onClick={() => {
                      onSignOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#191716] text-white hover:bg-[#332F2B] transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Level 2: Contextual Venture Bar */}
      {activeVenture && currentView !== 'landing' && (
        <div className="bg-[#F6F1EA] border-t border-[#E8DFD4] px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-serif font-bold text-[#191716] text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D96B27]"></span>
                {activeVenture.name}
              </span>
              <span className="text-[#A1978B]">•</span>
              <span className="text-[11px] text-[#696157] font-medium bg-[#ECE3D6] px-2 py-0.5 rounded">
                {activeVenture.stage}
              </span>
              {activeVenture.isDemo && (
                <span className="text-[10px] uppercase font-bold text-[#883607] bg-[#FCECDD] border border-[#F3D3B8] px-1.5 py-0.2 rounded tracking-wider">
                  Demo
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                  currentView === 'dashboard'
                    ? 'bg-[#191716] text-white font-semibold'
                    : 'text-[#5C544C] hover:text-[#191716] hover:bg-[#EAE2D6]'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('wizard')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 ${
                  currentView === 'wizard'
                    ? 'bg-[#191716] text-white font-semibold'
                    : 'text-[#5C544C] hover:text-[#191716] hover:bg-[#EAE2D6]'
                }`}
              >
                Questionnaire
              </button>
              <button
                onClick={() => onNavigate('studio')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                  currentView === 'studio'
                    ? 'bg-[#191716] text-white font-semibold'
                    : 'text-[#5C544C] hover:text-[#191716] hover:bg-[#EAE2D6]'
                }`}
              >
                <FileText className="w-3 h-3" />
                Pitch Studio
              </button>
              <button
                onClick={() => onNavigate('critic')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                  currentView === 'critic'
                    ? 'bg-[#191716] text-white font-semibold'
                    : 'text-[#5C544C] hover:text-[#191716] hover:bg-[#EAE2D6]'
                }`}
              >
                <ShieldAlert className="w-3 h-3 text-[#D96B27]" />
                Critique
              </button>
              <button
                onClick={() => onNavigate('analysis')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                  currentView === 'analysis'
                    ? 'bg-[#191716] text-white font-semibold'
                    : 'text-[#5C544C] hover:text-[#191716] hover:bg-[#EAE2D6]'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                Analysis
              </button>
              <button
                onClick={() => onNavigate('investor')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors shrink-0 flex items-center gap-1 ${
                  currentView === 'investor'
                    ? 'bg-[#191716] text-white font-semibold'
                    : 'text-[#5C544C] hover:text-[#191716] hover:bg-[#EAE2D6]'
                }`}
              >
                <HelpCircle className="w-3 h-3" />
                Investor Q&A
              </button>
              <button
                onClick={onStartPresentation}
                className="px-2.5 py-1 rounded text-xs font-semibold text-[#D96B27] bg-[#F8EFE4] hover:bg-[#F3E5D4] transition-colors shrink-0 flex items-center gap-1"
              >
                <Play className="w-3 h-3 fill-current" />
                Presentation
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
