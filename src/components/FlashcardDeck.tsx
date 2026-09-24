import { useState, useEffect, useMemo } from 'react';
import { FLASHCARDS } from '../data/kcnaReferenceData.ts';
import { DomainId } from '../types/kcna.ts';
import { DomainBadge } from './DomainBadge.tsx';
import { 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  RotateCcw, 
  Shuffle, 
  ShieldAlert, 
  Lightbulb, 
  Sparkles,
  BookOpen
} from 'lucide-react';

interface FlashcardDeckProps {
  masteredIds: string[];
  onToggleMastered: (id: string) => void;
}

export const FlashcardDeck = ({ masteredIds, onToggleMastered }: FlashcardDeckProps) => {
  const [selectedDomain, setSelectedDomain] = useState<DomainId | 'all'>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'needs-review' | 'mastered'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardOrder, setCardOrder] = useState<string[]>([]);

  // Initialize or filter cards
  const filteredCards = useMemo(() => {
    return FLASHCARDS.filter((card) => {
      const matchesDomain = selectedDomain === 'all' || card.domain === selectedDomain;
      const isMastered = masteredIds.includes(card.id);
      
      if (!matchesDomain) return false;
      if (filterMode === 'needs-review') return !isMastered;
      if (filterMode === 'mastered') return isMastered;
      return true;
    });
  }, [selectedDomain, filterMode, masteredIds]);

  // Keep card order synced or randomized
  useEffect(() => {
    setCardOrder(filteredCards.map((c) => c.id));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedDomain, filterMode]);

  const currentCard = useMemo(() => {
    if (filteredCards.length === 0) return null;
    const safeIndex = Math.min(currentIndex, filteredCards.length - 1);
    return filteredCards[safeIndex] || null;
  }, [filteredCards, currentIndex]);

  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cardOrder].sort(() => Math.random() - 0.5);
    setCardOrder(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredCards.length]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Filter Controls */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Domain Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              selectedDomain === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All Domains ({FLASHCARDS.length})
          </button>
          {(['fundamentals', 'orchestration', 'architecture', 'observability', 'delivery'] as DomainId[]).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedDomain === d
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Filter & Shuffle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                filterMode === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({filteredCards.length})
            </button>
            <button
              onClick={() => setFilterMode('needs-review')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                filterMode === 'needs-review' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Review ({FLASHCARDS.length - masteredIds.length})
            </button>
            <button
              onClick={() => setFilterMode('mastered')}
              className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                filterMode === 'mastered' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mastered ({masteredIds.length})
            </button>
          </div>

          <button
            onClick={handleShuffle}
            title="Shuffle Card Order"
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Flashcard Arena */}
      {currentCard ? (
        <div className="space-y-4">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                [Space] Flip · [←/→] Navigate
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                isCurrentMastered
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                  : 'bg-amber-950/80 text-amber-400 border-amber-800'
              }`}>
                {isCurrentMastered ? 'Mastered' : 'Needs Review'}
              </span>
            </div>
          </div>

          {/* Flashcard 3D Container */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="w-full min-h-[380px] sm:min-h-[420px] rounded-3xl cursor-pointer perspective-1000 select-none group"
          >
            <div
              className={`w-full h-full min-h-[380px] sm:min-h-[420px] transition-transform duration-500 transform-style-3d relative rounded-3xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT SIDE (Question) */}
              <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-2xl group-hover:border-slate-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <DomainBadge domain={currentCard.domain} />
                      <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-800/80">
                        {currentCard.category}
                      </span>
                    </div>
                    <span className="text-xs text-blue-400 font-mono flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                      <RotateCw className="w-3.5 h-3.5" />
                      Click to reveal answer
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-relaxed mt-4">
                    {currentCard.question}
                  </h3>
                </div>

                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>Recall prompt</span>
                  <span className="font-mono text-slate-400">Spacebar to flip</span>
                </div>
              </div>

              {/* BACK SIDE (Answer + Traps) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 p-8 sm:p-10 rounded-3xl border border-blue-500/30 flex flex-col justify-between shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Detailed Answer
                    </span>
                    <DomainBadge domain={currentCard.domain} showWeight={false} />
                  </div>

                  <p className="text-base sm:text-lg text-slate-100 leading-relaxed font-normal whitespace-pre-line">
                    {currentCard.answer}
                  </p>

                  {/* Key Takeaway */}
                  {currentCard.keyTakeaway && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 text-xs text-blue-200">
                      <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-blue-300 font-semibold">Core Concept: </strong>
                        {currentCard.keyTakeaway}
                      </div>
                    </div>
                  )}

                  {/* Exam Trap */}
                  {currentCard.examTrap && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 font-semibold">Exam Trap: </strong>
                        {currentCard.examTrap}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>Answer & Gotcha breakdown</span>
                  <span className="font-mono text-slate-400">Spacebar to flip back</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Navigation Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Toggle Mastered Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentCard) onToggleMastered(currentCard.id);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 shadow-md ${
                isCurrentMastered
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-emerald-600 hover:text-emerald-400'
              }`}
            >
              {isCurrentMastered ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Mastered (Click to Unmark)</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Mark as Mastered</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === filteredCards.length - 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-all duration-200 shadow-md shadow-blue-500/20"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <Sparkles className="w-12 h-12 text-blue-400 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-white">No cards in this filter</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            You've marked all cards in this category as mastered or filtered out available cards.
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer"
          >
            Show All Flashcards
          </button>
        </div>
      )}
    </div>
  );
};
