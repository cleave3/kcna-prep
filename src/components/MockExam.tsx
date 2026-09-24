import { useState, useEffect } from 'react';
import { ExamQuestion } from '../types/kcna.ts';
import { DomainBadge } from './DomainBadge.tsx';
import { 
  Timer, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Pause, 
  Play, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface MockExamProps {
  examId: 1 | 2 | 3 | 4;
  questions: ExamQuestion[];
  onFinishExam: (answers: Record<string, number>) => void;
  examInProgress: boolean;
  setExamInProgress: (inProgress: boolean) => void;
  onSelectExam: (id: 1 | 2 | 3 | 4) => void;
}

export const MockExam = ({
  examId,
  questions,
  onFinishExam,
  examInProgress,
  setExamInProgress,
  onSelectExam,
}: MockExamProps) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [pendingExamId, setPendingExamId] = useState<(1 | 2 | 3 | 4) | null>(null);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  // Start exam on mount
  useEffect(() => {
    setExamInProgress(true);
    setCurrentIdx(0);
    setUserAnswers({});
    setFlaggedIds([]);
    setTimeRemaining(90 * 60);
    setIsPaused(false);
  }, [examId]);

  // Countdown Timer
  useEffect(() => {
    if (!examInProgress || isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examInProgress, isPaused]);

  const currentQuestion = questions[currentIdx];
  const answeredCount = Object.keys(userAnswers).length;
  const isCurrentFlagged = currentQuestion ? flaggedIds.includes(currentQuestion.id) : false;

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleToggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedIds((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id]
    );
  };

  const handleSubmitExam = () => {
    setExamInProgress(false);
    setShowSubmitModal(false);
    onFinishExam(userAnswers);
  };

  const handleRequestSwitchExam = (targetId: 1 | 2 | 3 | 4) => {
    if (targetId === examId) return;
    if (answeredCount > 0) {
      setPendingExamId(targetId);
      setShowSwitchModal(true);
    } else {
      onSelectExam(targetId);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        if (currentIdx < questions.length - 1) setCurrentIdx((i) => i + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentIdx > 0) setCurrentIdx((i) => i - 1);
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        handleSelectOption(parseInt(e.key, 10) - 1);
      } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
        const charCode = e.key.toUpperCase().charCodeAt(0);
        handleSelectOption(charCode - 65);
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFlag();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, currentQuestion]);

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const EXAM_SUBTITLES: Record<1 | 2 | 3 | 4, string> = {
    1: 'Comprehensive Baseline Mock',
    2: 'Scenarios & Troubleshooting Drill',
    3: 'Rapid-Recall & CNCF Traps',
    4: '🎯 Weak-Spot & Practice Test Drill',
  };

  if (!currentQuestion) return null;

  return (
    <div className="space-y-4">
      {/* Quick Exam Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Choose Practice Exam:
          </span>
        </div>
        <div className="grid grid-cols-2 sm:flex items-center gap-2">
          {([1, 2, 3, 4] as const).map((id) => (
            <button
              key={id}
              onClick={() => handleRequestSwitchExam(id)}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all duration-200 ${
                examId === id
                  ? id === 4
                    ? 'bg-amber-600 text-white font-semibold shadow-md shadow-amber-500/25 ring-1 ring-amber-400/50'
                    : 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/25 ring-1 ring-blue-400/50'
                  : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{id === 4 ? 'Exam 4: Weak-Spots 🎯' : `Exam ${id}`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top Bar with Timer, Progress & Status */}
      <div className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Exam Title & Stats */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Practice Exam {examId}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60 font-medium">
                {EXAM_SUBTITLES[examId]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{questions.length} Questions</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">
                {answeredCount} Answered
              </span>
              <span>·</span>
              <span className="text-amber-400 font-medium">
                {flaggedIds.length} Flagged
              </span>
            </div>
          </div>
        </div>

        {/* Timer Control & Submit Trigger */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm">
            <Timer className={`w-4 h-4 ${timeRemaining < 600 ? 'text-rose-400 animate-pulse' : 'text-blue-400'}`} />
            <span className={timeRemaining < 600 ? 'text-rose-400 font-bold' : 'text-white'}>
              {formatTime(timeRemaining)}
            </span>
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer ml-1"
              title={isPaused ? 'Resume Timer' : 'Pause Timer'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-500 cursor-pointer transition-all duration-200 shadow-md shadow-emerald-500/20"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Area (3 Cols) */}
        <div className="lg:col-span-3 bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6">
          <div className="space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <DomainBadge domain={currentQuestion.domain} />
              </div>

              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  isCurrentFlagged
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{isCurrentFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Optional Code Snippet */}
            {currentQuestion.codeSnippet && (
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 overflow-x-auto">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQuestion.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="text-sm leading-relaxed pt-0.5">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={() => currentIdx > 0 && setCurrentIdx((i) => i - 1)}
              disabled={currentIdx === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-medium text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Keyboard: [1-4] or [A-D] Select · [←/→] Navigate
            </span>

            <button
              onClick={() => currentIdx < questions.length - 1 && setCurrentIdx((i) => i + 1)}
              disabled={currentIdx === questions.length - 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors shadow-md shadow-blue-500/20"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar (1 Col) */}
        <div className="lg:col-span-1 bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Question Navigator
            </span>
            <span className="text-xs font-mono text-slate-400">
              {answeredCount}/{questions.length}
            </span>
          </div>

          {/* Palette Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-[480px] overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isFlagged = flaggedIds.includes(q.id);
              const isCurrent = currentIdx === idx;

              let btnStyle = 'bg-slate-950 text-slate-400 border-slate-800';
              if (isCurrent) {
                btnStyle = 'ring-2 ring-blue-500 text-white font-bold bg-blue-600/30';
              } else if (isFlagged) {
                btnStyle = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
              } else if (isAnswered) {
                btnStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-800 font-medium';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-9 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-center relative ${btnStyle}`}
                  title={`Question ${idx + 1}`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-800" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-950 border border-amber-800" />
              <span>Flagged for review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800" />
              <span>Unvisited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Ready to Finish?</h3>
                <p className="text-xs text-slate-400">Practice Exam {examId} Submission</p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total Questions:</span>
                <span className="font-mono font-bold text-white">{questions.length}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Answered Questions:</span>
                <span className="font-mono font-bold text-emerald-400">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Unanswered Questions:</span>
                <span className="font-mono font-bold text-rose-400">
                  {questions.length - answeredCount}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Flagged Questions:</span>
                <span className="font-mono font-bold text-amber-400">{flaggedIds.length}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-sm font-medium text-slate-300 hover:text-white cursor-pointer"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-500 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                Confirm & View Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Exam Confirmation Modal */}
      {showSwitchModal && pendingExamId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">Switch to Practice Exam {pendingExamId}?</h3>
                <p className="text-xs text-slate-400">Current progress will be reset</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You currently have <span className="text-emerald-400 font-semibold">{answeredCount} answered questions</span> in Exam {examId}. Switching now will start Exam {pendingExamId} with a fresh 90-minute timer.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowSwitchModal(false);
                  setPendingExamId(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                Stay on Exam {examId}
              </button>
              <button
                onClick={() => {
                  const nextId = pendingExamId;
                  setShowSwitchModal(false);
                  setPendingExamId(null);
                  onSelectExam(nextId);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Switch to Exam {pendingExamId}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
