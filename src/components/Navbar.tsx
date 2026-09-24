import { GraduationCap, Layers, TableProperties, Terminal, Search, Award } from 'lucide-react';

export type NavTab = 'exam' | 'flashcards' | 'matrix' | 'kubectl' | 'notes';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  selectedExamId: 1 | 2 | 3 | 4;
  onExamChange: (id: 1 | 2 | 3 | 4) => void;
  examInProgress: boolean;
  masteredCount: number;
  totalCards: number;
}

export const Navbar = ({
  activeTab,
  onTabChange,
  selectedExamId,
  onExamChange,
  examInProgress,
  masteredCount,
  totalCards,
}: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">KCNA Exam Ace</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  2026 Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Kubernetes & Cloud Native Associate Mastery Suite
              </p>
            </div>
          </div>

          {/* Quick Study Stat */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Cards Mastered:</span>
              <span className="text-emerald-400 font-bold">
                {masteredCount}/{totalCards}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Passing Target:</span>
              <span className="text-amber-400 font-bold">75% (45/60)</span>
            </div>
          </div>

          {/* Exam Switcher (if on exam tab) */}
          {activeTab === 'exam' && (
            <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 px-2 font-medium hidden sm:inline">Exam:</span>
              {([1, 2, 3, 4] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => onExamChange(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
                    selectedExamId === id
                      ? id === 4
                        ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/30 ring-1 ring-amber-400/40'
                        : 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 ring-1 ring-blue-400/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                  }`}
                  title={
                    id === 1
                      ? 'Practice Exam 1: Comprehensive Baseline Mock (60 Qs)'
                      : id === 2
                      ? 'Practice Exam 2: Scenario & Troubleshooting Drill (60 Qs)'
                      : id === 3
                      ? 'Practice Exam 3: Rapid-Recall & CNCF Traps (60 Qs)'
                      : 'Practice Exam 4: 🎯 Weak-Spot & Practice Test Drill (60 Qs)'
                  }
                >
                  {selectedExamId === id && examInProgress && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span>{id === 4 ? 'Exam 4 🎯' : `Exam ${id}`}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-900 scrollbar-none" aria-label="Tabs">
          <button
            onClick={() => onTabChange('exam')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === 'exam'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>4x Practice Exams (240 Qs)</span>
          </button>

          <button
            onClick={() => onTabChange('flashcards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === 'flashcards'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Interactive Flashcards ({totalCards})</span>
          </button>

          <button
            onClick={() => onTabChange('matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === 'matrix'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            <span>High-Yield Matrices</span>
          </button>

          <button
            onClick={() => onTabChange('kubectl')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === 'kubectl'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>kubectl & Syntax Drill</span>
          </button>

          <button
            onClick={() => onTabChange('notes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 ${
              activeTab === 'notes'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Master Notes Search</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
