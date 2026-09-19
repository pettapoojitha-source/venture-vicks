import { useState } from 'react';
import { Venture, UserProfile } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  MoreVertical, 
  Copy, 
  Trash2, 
  Edit3,
  Layers,
  Flame,
  AlertTriangle
} from 'lucide-react';

interface DashboardProps {
  currentUser: UserProfile | null;
  ventures: Venture[];
  onSelectVenture: (venture: Venture) => void;
  onCreateNewVenture: () => void;
  onDuplicateVenture: (venture: Venture) => void;
  onRenameVenture: (venture: Venture, newName: string) => void;
  onDeleteVenture: (ventureId: string) => void;
}

export function Dashboard({
  currentUser,
  ventures,
  onSelectVenture,
  onCreateNewVenture,
  onDuplicateVenture,
  onRenameVenture,
  onDeleteVenture
}: DashboardProps) {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renamingVentureId, setRenamingVentureId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState<string>('');

  const userName = currentUser?.fullName?.split(' ')[0] || 'Founder';

  // Greeting based on current time
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const handleStartRename = (venture: Venture) => {
    setRenamingVentureId(venture.id);
    setRenameInput(venture.name);
    setActiveMenuId(null);
  };

  const handleSaveRename = (venture: Venture) => {
    if (renameInput.trim()) {
      onRenameVenture(venture, renameInput.trim());
    }
    setRenamingVentureId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Editorial Dashboard Header */}
      <div className="mb-10">
        <h1 className="font-serif text-4xl sm:text-5xl text-[#191716] font-normal tracking-tight">
          {greetingTime}, {userName}.
        </h1>
        <p className="text-base text-[#6E665E] mt-2 font-normal">
          What are you building today?
        </p>
      </div>

      {/* Large Primary Card: "Create a New Venture" */}
      <div className="bg-[#FAF7F2] border border-[#E5DCD0] rounded-xl p-8 mb-12 shadow-xs relative overflow-hidden transition-all hover:border-[#D6C7B5]">
        {/* Subtle decorative background accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#F5ECE0] to-transparent pointer-events-none opacity-60"></div>

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF0E4] border border-[#E9D5C0] text-xs font-semibold text-[#883607] mb-4">
            <Flame className="w-3.5 h-3.5 text-[#D96B27]" />
            <span>Turn a spark into a flame</span>
          </div>

          <h2 className="font-serif text-3xl text-[#191716] font-bold tracking-tight mb-2">
            Create a New Venture
          </h2>

          <p className="text-sm text-[#615951] leading-relaxed mb-6">
            Turn an idea into a structured investor-ready pitch through our guided strategic questionnaire, AI validation auditor, and pitch studio.
          </p>

          <button
            id="btn-start-building"
            onClick={onCreateNewVenture}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#191716] text-white text-xs font-semibold hover:bg-[#2E2925] transition-all shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#E8732A]" />
            <span>Start Building</span>
          </button>
        </div>
      </div>

      {/* "Your Ventures" Section */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#ECE4DA]">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl text-[#191716] font-bold">Your Ventures</h2>
            <span className="text-xs font-mono bg-[#EFE9E0] text-[#696158] px-2 py-0.5 rounded-full">
              {ventures.length}
            </span>
          </div>

          <button
            onClick={onCreateNewVenture}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D96B27] hover:text-[#B35216] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Venture</span>
          </button>
        </div>

        {ventures.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 bg-white rounded-xl border border-[#E7DFD5] shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF3EA] text-[#D96B27] flex items-center justify-center mx-auto mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#191716] font-bold mb-2">No ventures yet</h3>
            <p className="text-xs text-[#6E665E] max-w-sm mx-auto mb-6">
              Every great venture starts as an idea. Let Wicks AI help you shape yours into a pitch investors take seriously.
            </p>
            <button
              onClick={onCreateNewVenture}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#191716] text-white text-xs font-semibold hover:bg-[#332E2A] transition-colors"
            >
              <Plus className="w-4 h-4 text-[#D96B27]" />
              <span>Create Your First Venture</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ventures.map((venture) => {
              const isDemo = venture.isDemo;
              const hasCriticalIssues = venture.critique?.some((c) => c.severity === 'Critical');

              return (
                <div
                  key={venture.id}
                  className="bg-white border border-[#E5DFD7] rounded-xl p-6 shadow-xs hover:shadow-md hover:border-[#D6CCC0] transition-all flex flex-col justify-between relative group"
                >
                  {/* Top row: Venture Name & Action menu */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      {renamingVentureId === venture.id ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(venture)}
                            className="text-lg font-serif font-bold text-[#191716] border border-[#D96B27] px-2 py-1 rounded w-full"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(venture)}
                            className="text-xs bg-[#191716] text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 
                              onClick={() => onSelectVenture(venture)}
                              className="font-serif text-2xl font-bold text-[#191716] hover:text-[#D96B27] cursor-pointer transition-colors"
                            >
                              {venture.name}
                            </h3>
                            {isDemo && (
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[#883607] bg-[#FCECDD] border border-[#F3D3B8] px-1.5 py-0.2 rounded">
                                Demo
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6B635A] line-clamp-1 mt-0.5">
                            {venture.tagline || venture.industry}
                          </p>
                        </div>
                      )}

                      {/* Menu trigger */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === venture.id ? null : venture.id)}
                          className="p-1 rounded text-[#948B80] hover:text-[#191716] hover:bg-[#F2ECE3] transition-colors"
                          aria-label="Venture options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === venture.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-[#E7DFD5] py-1.5 z-20 text-xs">
                            <button
                              onClick={() => handleStartRename(venture)}
                              className="w-full px-3 py-1.5 text-left text-[#403934] hover:bg-[#FAF7F2] flex items-center gap-2"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Rename
                            </button>
                            <button
                              onClick={() => {
                                onDuplicateVenture(venture);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-left text-[#403934] hover:bg-[#FAF7F2] flex items-center gap-2"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              Duplicate
                            </button>
                            {!isDemo && (
                              <button
                                onClick={() => {
                                  onDeleteVenture(venture.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-left text-[#B91C1C] hover:bg-[#FEF2F2] flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 my-4">
                      <span className="text-[11px] font-medium text-[#59524A] bg-[#F4EFE7] px-2.5 py-0.5 rounded">
                        {venture.stage}
                      </span>
                      <span className="text-[11px] text-[#786E65] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#A89E92]" />
                        {venture.lastUpdated}
                      </span>
                    </div>

                    {/* Progress Bar & Status */}
                    <div className="space-y-3 pt-3 border-t border-[#F0EAE1]">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="text-[#6E665E] font-medium">Pitch Completion</span>
                          <span className="font-semibold text-[#191716]">{venture.pitchCompletion}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#EDE6DD] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#D96B27] rounded-full transition-all duration-500"
                            style={{ width: `${venture.pitchCompletion}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* VC Critic Status */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#6E665E]">Critic Review:</span>
                        {venture.criticStatus === 'issues_found' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B45309]">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" />
                            {venture.critique?.length || 0} issues challenged
                          </span>
                        ) : venture.criticStatus === 'investor_ready' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Investor Ready
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#8C8379]">Unreviewed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="mt-6 pt-3">
                    <button
                      id={`btn-continue-${venture.id}`}
                      onClick={() => onSelectVenture(venture)}
                      className="w-full py-2 px-4 rounded-md text-xs font-semibold text-[#191716] bg-[#F7F3EC] hover:bg-[#191716] hover:text-white transition-all flex items-center justify-center gap-1.5 border border-[#E0D7CC]"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
