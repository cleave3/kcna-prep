import { useState, useMemo } from 'react';
import { MASTER_NOTES } from '../data/kcnaReferenceData.ts';
import { DomainId } from '../types/kcna.ts';
import { DomainBadge } from './DomainBadge.tsx';
import { Search, Sparkles, Tag, CheckCircle2, Lightbulb } from 'lucide-react';

export const NotesSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<DomainId | 'all'>('all');

  const filteredNotes = useMemo(() => {
    return MASTER_NOTES.filter((note) => {
      const matchesDomain = selectedDomain === 'all' || note.domain === selectedDomain;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.summary.toLowerCase().includes(q) ||
        note.importantTakeaway.toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q)) ||
        note.details.some((d) => d.toLowerCase().includes(q));

      return matchesDomain && matchesQuery;
    });
  }, [searchQuery, selectedDomain]);

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Search className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Master Notes Search & Concept Library
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Query across 100% of your notes content, architecture details, and exam takeaways.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search concepts (e.g. IPVS, gVisor, 4Cs, TOC)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              selectedDomain === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All Categories ({MASTER_NOTES.length})
          </button>
          {(['fundamentals', 'orchestration', 'architecture', 'observability', 'delivery'] as DomainId[]).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedDomain === d
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all duration-200 group space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <DomainBadge domain={note.domain} />
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-500" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {note.summary}
                </p>

                {/* Bullet Points */}
                <div className="mt-4 space-y-2">
                  {note.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Takeaway Callout */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-start gap-2.5 text-xs text-blue-200 mt-4">
                <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-300 font-semibold block mb-0.5">High-Yield Takeaway:</strong>
                  <span>{note.importantTakeaway}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No notes matched "{searchQuery}"</h3>
          <p className="text-xs text-slate-400">
            Try a different keyword like <code className="text-sky-300">etcd</code>, <code className="text-sky-300">IPVS</code>, <code className="text-sky-300">gVisor</code>, or <code className="text-sky-300">TOC</code>.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('all');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      )}
    </div>
  );
};
