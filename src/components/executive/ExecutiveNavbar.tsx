import { useState } from 'react';
import { 
  Venture, 
  UserProfile, 
  AppView, 
  UiDesignMode 
} from '../../types';
import { 
  Terminal, 
  Layers, 
  ShieldAlert, 
  BarChart3, 
  HelpCircle, 
  Play, 
  Plus, 
  LogOut, 
  ChevronDown, 
  Sparkles, 
  Palette,
  CheckCircle2,
  Bell,
  Cpu
} from 'lucide-react';

interface ExecutiveNavbarProps {
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
  uiMode: UiDesignMode;
  onToggleUiMode: () => void;
}

export function ExecutiveNavbar({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onSignOut,
  ventures,
  activeVenture,
  onSelectVenture,
  onCreateNewVenture,
  onStartPresentation,
  uiMode,
  onToggleUiMode
}: ExecutiveNavbarProps) {
  const [showVentureMenu, setShowVentureMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'Critical Vulnerability Identified', desc: 'VC Critic flagged unverified CAC assumptions on Slide 6.', time: '8m ago' },
    { id: '2', title: 'Milestone Grounded', desc: 'Unit economics updated with positive gross contribution.', time: '45m ago' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0D13]/95 backdrop-blur-md border-b border-[#1E2330] text-slate-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between gap-4">
        
        {/* Left: Brand + Venture Selector */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#E64A19] flex items-center justify-center shadow-md shadow-[#FF5722]/20 border border-[#FF7043]/30">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white font-mono">
                  VENTURE<span className="text-[#FF5722]">.WICKS</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#181D2A] text-[#00E5FF] border border-[#00E5FF]/30 font-mono">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide hidden sm:block">
                EXECUTIVE OS
              </p>
            </div>
          </button>

          {/* Active Venture Dropdown Switcher */}
          {activeVenture && (
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowVentureMenu(!showVentureMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#131620] hover:bg-[#1A1F2D] border border-[#252C3D] text-xs font-mono text-slate-200 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722] animate-pulse"></span>
                <span className="max-w-[130px] truncate font-sans font-medium">{activeVenture.name}</span>
                {activeVenture.isDemo && (
                  <span className="text-[9px] uppercase font-bold text-[#FF9E80] bg-[#3E1B10] px-1 py-0.2 rounded border border-[#FF5722]/30">
                    DEMO
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>

              {showVentureMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-[#11141E] rounded-lg shadow-2xl border border-[#252C3D] py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider border-b border-[#1E2433]">
                    Switch Venture Workspace
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1 divide-y divide-[#181D2A]">
                    {ventures.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          onSelectVenture(v);
                          setShowVentureMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#181D2A] transition-colors ${
                          v.id === activeVenture.id ? 'bg-[#1D2333] text-white font-medium' : 'text-slate-300'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-sans font-medium">{v.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{v.stage}</div>
                        </div>
                        {v.id === activeVenture.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#1E2433] pt-1.5 px-2">
                    <button
                      onClick={() => {
                        onCreateNewVenture();
                        setShowVentureMenu(false);
                      }}
                      className="w-full py-1.5 px-2.5 rounded text-xs font-mono text-slate-200 hover:bg-[#181D2A] flex items-center justify-center gap-1.5 text-center"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#FF5722]" />
                      <span>Create New Venture</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#12151F] p-1 rounded-lg border border-[#212738]">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all ${
              currentView === 'dashboard'
                ? 'bg-[#1F2538] text-white shadow-sm font-semibold border border-[#30384E]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181D2A]'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => onNavigate('studio')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all ${
              currentView === 'studio'
                ? 'bg-[#1F2538] text-white shadow-sm font-semibold border border-[#30384E]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181D2A]'
            }`}
          >
            Studio
          </button>

          <button
            onClick={() => onNavigate('critic')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all flex items-center gap-1.5 ${
              currentView === 'critic'
                ? 'bg-[#1F2538] text-white shadow-sm font-semibold border border-[#30384E]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181D2A]'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-[#FF5722]" />
            <span>Threat Radar</span>
          </button>

          <button
            onClick={() => onNavigate('analysis')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all flex items-center gap-1.5 ${
              currentView === 'analysis'
                ? 'bg-[#1F2538] text-white shadow-sm font-semibold border border-[#30384E]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181D2A]'
            }`}
          >
            <BarChart3 className="w-3 h-3 text-[#00E5FF]" />
            <span>9D Audit</span>
          </button>

          <button
            onClick={() => onNavigate('investor')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all flex items-center gap-1.5 ${
              currentView === 'investor'
                ? 'bg-[#1F2538] text-white shadow-sm font-semibold border border-[#30384E]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#181D2A]'
            }`}
          >
            <HelpCircle className="w-3 h-3 text-emerald-400" />
            <span>Sparring Arena</span>
          </button>
        </nav>

        {/* Right: UI Theme Switcher + Present + User */}
        <div className="flex items-center gap-2">
          
          {/* UI Design Switcher Button */}
          <button
            id="btn-toggle-ui-mode"
            onClick={onToggleUiMode}
            title="Switch UI & UX design between Executive Obsidian and Editorial Paper"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#131722] hover:bg-[#1B2131] border border-[#273043] text-xs text-slate-300 transition-all font-mono"
          >
            <Palette className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="hidden xl:inline text-slate-400">UI Mode:</span>
            <span className="font-semibold text-white">Executive</span>
            <span className="text-[10px] text-[#00E5FF] bg-[#00E5FF]/10 px-1 py-0.2 rounded border border-[#00E5FF]/20">
              SWITCH
            </span>
          </button>

          {/* Start Presentation */}
          <button
            onClick={onStartPresentation}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-[#161B27] text-slate-200 hover:bg-[#202738] border border-[#2B3449] transition-colors"
          >
            <Play className="w-3 h-3 text-[#FF5722] fill-current" />
            <span>Present</span>
          </button>

          {/* New Venture button */}
          <button
            onClick={onCreateNewVenture}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white hover:brightness-110 transition-all shadow-sm shadow-[#FF5722]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Venture</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-[#181D2A] transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF5722] rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-[#11141F] rounded-lg shadow-2xl border border-[#242C3D] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#1E2536] flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">System Alerts</span>
                  <span className="text-[10px] font-mono text-[#00E5FF]">2 active</span>
                </div>
                <div className="divide-y divide-[#171C2B]">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 text-xs hover:bg-[#161B29] cursor-pointer">
                      <div className="font-semibold text-slate-200 mb-0.5">{n.title}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{n.desc}</p>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-[#181D2A] border border-transparent hover:border-[#273043] transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1E2538] to-[#2B354E] flex items-center justify-center text-xs font-mono font-bold text-[#00E5FF] border border-[#303B54]">
                  {currentUser.fullName.charAt(0)}
                </div>
                <span className="text-xs font-mono text-slate-300 hidden lg:inline-block max-w-[80px] truncate">
                  {currentUser.fullName}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#11141F] rounded-lg shadow-2xl border border-[#252C3D] py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#1E2536]">
                    <p className="text-xs font-bold text-white">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">@{currentUser.username}</p>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-[#181D2A] flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    Portfolio Ventures
                  </button>
                  <button
                    onClick={() => {
                      onSignOut();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-950/30 flex items-center gap-2"
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
              className="px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-[#191F2D] text-slate-200 hover:bg-[#232A3C] border border-[#2C3549] transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
