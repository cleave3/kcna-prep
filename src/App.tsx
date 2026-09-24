import { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar.tsx';
import { MockExam } from './components/MockExam.tsx';
import { ExamResults } from './components/ExamResults.tsx';
import { FlashcardDeck } from './components/FlashcardDeck.tsx';
import { CheatMatrix } from './components/CheatMatrix.tsx';
import { KubectlTrainer } from './components/KubectlTrainer.tsx';
import { NotesSearch } from './components/NotesSearch.tsx';
import { PRACTICE_EXAMS_QUESTIONS } from './data/practiceExams.ts';
import { FLASHCARDS } from './data/kcnaReferenceData.ts';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('exam');
  const [selectedExamId, setSelectedExamId] = useState<1 | 2 | 3 | 4>(1);
  const [examInProgress, setExamInProgress] = useState<boolean>(false);
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  
  // Flashcard mastered state stored in localStorage
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('kcna_mastered_flashcards');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kcna_mastered_flashcards', JSON.stringify(masteredIds));
    } catch {
      // storage unavailable
    }
  }, [masteredIds]);

  const toggleMasteredCard = (id: string) => {
    setMasteredIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Filter current exam questions
  const currentExamQuestions = PRACTICE_EXAMS_QUESTIONS.filter(
    (q) => q.examId === selectedExamId
  );

  const handleFinishExam = (answers: Record<string, number>) => {
    setExamAnswers(answers);
    setExamFinished(true);
  };

  const handleRetakeExam = () => {
    setExamFinished(false);
    setExamAnswers({});
    setExamInProgress(true);
  };

  const handleSelectExam = (id: 1 | 2 | 3 | 4) => {
    setSelectedExamId(id);
    setExamFinished(false);
    setExamAnswers({});
    setExamInProgress(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
        selectedExamId={selectedExamId}
        onExamChange={handleSelectExam}
        examInProgress={examInProgress && !examFinished}
        masteredCount={masteredIds.length}
        totalCards={FLASHCARDS.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'exam' && (
          examFinished ? (
            <ExamResults
              questions={currentExamQuestions}
              userAnswers={examAnswers}
              onRetake={handleRetakeExam}
              onSelectAnotherExam={handleSelectExam}
              currentExamId={selectedExamId}
            />
          ) : (
            <MockExam
              examId={selectedExamId}
              questions={currentExamQuestions}
              onFinishExam={handleFinishExam}
              examInProgress={examInProgress}
              setExamInProgress={setExamInProgress}
              onSelectExam={handleSelectExam}
            />
          )
        )}

        {activeTab === 'flashcards' && (
          <FlashcardDeck
            masteredIds={masteredIds}
            onToggleMastered={toggleMasteredCard}
          />
        )}

        {activeTab === 'matrix' && <CheatMatrix />}

        {activeTab === 'kubectl' && <KubectlTrainer />}

        {activeTab === 'notes' && <NotesSearch />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            KCNA Certified Associate Exam Companion · 60 Questions · 90 Minutes · ~75% Passing Mark
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Official CNCF Weighting: 46% · 22% · 16% · 8% · 8%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
