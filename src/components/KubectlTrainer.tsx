import { useState } from 'react';
import { RESOURCE_ABBREVIATIONS, KUBECTL_COMMANDS } from '../data/kcnaReferenceData.ts';
import { Terminal, Check, X, Sparkles, Filter, Code2, Copy, CheckCheck } from 'lucide-react';

export const KubectlTrainer = () => {
  const [activeSubTab, setActiveSubTab] = useState<'abbrevs' | 'commands'>('abbrevs');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick Quiz State for Abbreviations
  const [quizIndex, setQuizIndex] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);

  const currentAbbrev = RESOURCE_ABBREVIATIONS[quizIndex % RESOURCE_ABBREVIATIONS.length];

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGuess.trim()) return;

    const isMatch = userGuess.trim().toLowerCase() === currentAbbrev.short.toLowerCase();
    if (isMatch) {
      setFeedback('correct');
      setScore((s) => s + 1);
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNextQuiz = () => {
    setUserGuess('');
    setFeedback(null);
    setQuizIndex((i) => i + 1);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCommands = KUBECTL_COMMANDS.filter((cmd) => {
    const term = searchTerm.toLowerCase();
    return (
      cmd.command.toLowerCase().includes(term) ||
      cmd.description.toLowerCase().includes(term) ||
      cmd.category.toLowerCase().includes(term)
    );
  });

  const filteredAbbrevs = RESOURCE_ABBREVIATIONS.filter((abbrev) => {
    const term = searchTerm.toLowerCase();
    return (
      abbrev.full.toLowerCase().includes(term) ||
      abbrev.short.toLowerCase().includes(term) ||
      (abbrev.notes && abbrev.notes.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Terminal className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              kubectl & Syntax Rapid Recall
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Master the 25+ essential resource abbreviations and high-frequency exam CLI commands.
          </p>
        </div>

        {/* Sub-tab Pill Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('abbrevs')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
              activeSubTab === 'abbrevs'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Resource Abbreviations ({RESOURCE_ABBREVIATIONS.length})
          </button>
          <button
            onClick={() => setActiveSubTab('commands')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors ${
              activeSubTab === 'commands'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Essential Commands ({KUBECTL_COMMANDS.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'abbrevs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick-Fire Quiz Widget (Left column) */}
          <div className="lg:col-span-1 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Quick-Fire Abbreviation Drill
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  Score: {score}
                </span>
              </div>

              <div className="py-6 text-center space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Resource Name</span>
                <h3 className="text-2xl font-black text-white tracking-wide font-mono">
                  {currentAbbrev.full}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {currentAbbrev.notes}
                </p>
                <div className="pt-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono border ${
                    currentAbbrev.namespaced
                      ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                      : 'bg-purple-950/60 text-purple-300 border-purple-800'
                  }`}>
                    {currentAbbrev.namespaced ? 'Namespaced' : 'Cluster-Scoped'}
                  </span>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleGuessSubmit} className="space-y-3">
                <div>
                  <label htmlFor="abbrev-input" className="block text-xs font-mono text-slate-400 mb-1">
                    Enter kubectl short form (e.g. po, sts, netpol):
                  </label>
                  <input
                    id="abbrev-input"
                    type="text"
                    value={userGuess}
                    onChange={(e) => setUserGuess(e.target.value)}
                    placeholder="e.g. sts"
                    disabled={feedback !== null}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center font-mono text-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    autoFocus
                  />
                </div>

                {feedback === null ? (
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 cursor-pointer transition-colors shadow-md shadow-blue-500/20"
                  >
                    Check Short Code
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold font-mono ${
                        feedback === 'correct'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          : 'bg-rose-950/80 text-rose-300 border-rose-800'
                      }`}
                    >
                      {feedback === 'correct' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Correct! Short code is: {currentAbbrev.short}</span>
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 text-rose-400" />
                          <span>Incorrect. Correct short code is: {currentAbbrev.short}</span>
                        </>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleNextQuiz}
                      className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-sm hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      Next Resource
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="text-[11px] text-slate-500 font-mono text-center pt-4 border-t border-slate-800/80">
              Exam Questions often use short forms inside command snippets.
            </div>
          </div>

          {/* Reference Table (Right 2 columns) */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/40">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                All 25+ KCNA Resource Short Codes
              </span>
              <div className="relative">
                <Filter className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[520px]">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/90 text-xs font-mono uppercase text-slate-400 border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="px-5 py-3">Resource Name</th>
                    <th className="px-5 py-3">Short Form</th>
                    <th className="px-5 py-3">Scope</th>
                    <th className="px-5 py-3">Context & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans">
                  {filteredAbbrevs.map((res) => (
                    <tr key={res.full} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3 font-semibold text-white font-mono text-xs">
                        {res.full}
                      </td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 font-mono font-bold border border-blue-800 text-xs">
                          {res.short}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs">
                        <span className={`px-2 py-0.5 rounded font-mono ${
                          res.namespaced
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-purple-950/70 text-purple-300 border border-purple-800'
                        }`}>
                          {res.namespaced ? 'Namespaced' : 'Cluster'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-400">
                        {res.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Commands Reference & Search */
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white">Essential kubectl CLI Reference</h2>
              <p className="text-xs text-slate-400">
                Organized by operational category. Click any command to copy.
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search commands or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredCommands.map((cmd) => (
              <div
                key={cmd.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {cmd.category}
                    </span>
                    <button
                      onClick={() => handleCopy(cmd.command, cmd.id)}
                      className="p-1 rounded text-slate-400 hover:text-white cursor-pointer transition-colors"
                      title="Copy command"
                    >
                      {copiedId === cmd.id ? (
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-sm font-semibold text-sky-300">
                    <Code2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{cmd.command}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {cmd.description}
                </p>

                {cmd.exampleSnippet && (
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[11px] text-slate-300 truncate">
                    <span className="text-slate-500 select-none">$ </span>
                    {cmd.exampleSnippet}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
