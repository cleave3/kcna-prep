import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ExamQuestion, DomainId } from '../types/kcna.ts';
import { DOMAINS } from '../data/kcnaReferenceData.ts';
import { DomainBadge } from './DomainBadge.tsx';
import { Award, CheckCircle2, XCircle, RotateCcw, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ExamResultsProps {
  questions: ExamQuestion[];
  userAnswers: Record<string, number>;
  onRetake: () => void;
  onSelectAnotherExam: (id: 1 | 2 | 3 | 4) => void;
  currentExamId: 1 | 2 | 3 | 4;
}

export const ExamResults = ({
  questions,
  userAnswers,
  onRetake,
  onSelectAnotherExam,
  currentExamId,
}: ExamResultsProps) => {
  const totalQuestions = questions.length;
  let correctCount = 0;

  // Domain breakdown counters
  const domainStats: Record<DomainId, { correct: number; total: number }> = {
    fundamentals: { correct: 0, total: 0 },
    orchestration: { correct: 0, total: 0 },
    architecture: { correct: 0, total: 0 },
    observability: { correct: 0, total: 0 },
    delivery: { correct: 0, total: 0 },
  };

  questions.forEach((q) => {
    domainStats[q.domain].total += 1;
    if (userAnswers[q.id] === q.correctAnswerIndex) {
      correctCount += 1;
      domainStats[q.domain].correct += 1;
    }
  });

  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = percentage >= 75;

  useEffect(() => {
    if (isPassed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isPassed]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Banner Result Card */}
      <div
        className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
          isPassed
            ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/40'
            : 'bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-900 border-rose-500/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span
                className={`p-2 rounded-xl border ${
                  isPassed
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
                }`}
              >
                {isPassed ? <Award className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                Practice Exam {currentExamId} Complete
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {isPassed ? 'Congratulations! You Passed!' : 'Needs Review — Passing is 75%'}
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              {isPassed
                ? 'Your performance meets the CNCF certified passing threshold. Review any missed questions below to lock in complete confidence for exam day.'
                : 'Focus on your lowest scoring domains below tonight and run another practice exam before tomorrow.'}
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shrink-0 w-44 text-center">
            <span className="text-xs font-mono text-slate-400 uppercase">Score</span>
            <div
              className={`text-4xl sm:text-5xl font-black tracking-tight my-1 ${
                isPassed ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {percentage}%
            </div>
            <span className="text-xs font-mono text-slate-400">
              {correctCount} / {totalQuestions} Correct
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 cursor-pointer transition-all duration-200 shadow-md shadow-blue-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Exam {currentExamId}</span>
          </button>

          {([1, 2, 3, 4] as const)
            .filter((id) => id !== currentExamId)
            .map((id) => (
              <button
                key={id}
                onClick={() => onSelectAnotherExam(id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-sm font-medium cursor-pointer transition-all duration-200"
              >
                <span>Take Practice Exam {id}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ))}
        </div>
      </div>

      {/* Domain Performance Breakdown */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span>Domain-by-Domain Accuracy Breakdown</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Weighted by CNCF Syllabus</span>
        </div>

        <div className="space-y-3 pt-2">
          {(Object.keys(domainStats) as DomainId[]).map((d) => {
            const stat = domainStats[d];
            const domainPercentage = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
            const isDomainPassed = domainPercentage >= 75;

            return (
              <div
                key={d}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <DomainBadge domain={d} />
                  </div>
                  <p className="text-xs text-slate-400">{DOMAINS[d].description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold font-mono ${
                        isDomainPassed ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {domainPercentage}% ({stat.correct}/{stat.total})
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Weight: {DOMAINS[d].weight}%
                    </span>
                  </div>

                  <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isDomainPassed ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${domainPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Question-by-Question Review */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Question Analysis & Rationales</h2>
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const selectedAnswer = userAnswers[q.id];
            const isCorrect = selectedAnswer === q.correctAnswerIndex;

            return (
              <div
                key={q.id}
                className={`p-6 rounded-2xl border bg-slate-900 transition-all duration-200 space-y-4 ${
                  isCorrect
                    ? 'border-emerald-900/60 hover:border-emerald-700/60'
                    : 'border-rose-900/60 hover:border-rose-700/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      Q{idx + 1}
                    </span>
                    <DomainBadge domain={q.domain} />
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      isCorrect
                        ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                        : 'bg-rose-950/80 text-rose-400 border-rose-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-semibold text-white leading-relaxed">
                  {q.question}
                </h3>

                {/* Options List */}
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isChosen = selectedAnswer === optIdx;
                    const isAnswerCorrect = q.correctAnswerIndex === optIdx;

                    let optionStyle = 'bg-slate-950/60 border-slate-800 text-slate-300';
                    if (isAnswerCorrect) {
                      optionStyle = 'bg-emerald-950/60 border-emerald-700 text-emerald-200 font-medium';
                    } else if (isChosen && !isCorrect) {
                      optionStyle = 'bg-rose-950/60 border-rose-700 text-rose-200 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono opacity-70 w-5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isAnswerCorrect && (
                          <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wide">
                            Correct Answer
                          </span>
                        )}
                        {isChosen && !isCorrect && (
                          <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wide">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Rationale & Source Note Reference */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <div>
                    <strong className="text-blue-400 font-semibold block mb-0.5">Explanation:</strong>
                    <span>{q.explanation}</span>
                  </div>
                  {q.sourceReference && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
                      <span>Source Reference: </span>
                      <span className="text-slate-300">{q.sourceReference}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
