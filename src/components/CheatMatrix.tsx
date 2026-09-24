import { useState } from 'react';
import { CHEAT_MATRICES } from '../data/kcnaReferenceData.ts';
import { DomainBadge } from './DomainBadge.tsx';
import { Sparkles, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const CheatMatrix = () => {
  const [selectedTableId, setSelectedTableId] = useState(CHEAT_MATRICES[0].id);

  const activeTable = CHEAT_MATRICES.find((t) => t.id === selectedTableId) || CHEAT_MATRICES[0];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                High-Yield Comparison Matrices
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Side-by-side architectural cheat tables designed for quick pattern recognition before the exam.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
              {CHEAT_MATRICES.length} Curated Tables
            </span>
          </div>
        </div>

        {/* Matrix Pill Switcher */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {CHEAT_MATRICES.map((table) => {
            const isSelected = table.id === selectedTableId;
            return (
              <button
                key={table.id}
                onClick={() => setSelectedTableId(table.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                    : 'bg-slate-950/70 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{table.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Table Container */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">{activeTable.title}</h2>
              <DomainBadge domain={activeTable.domain} />
            </div>
            <p className="text-xs text-slate-400 mt-1">{activeTable.subtitle}</p>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/90 text-xs font-mono uppercase text-slate-400 border-b border-slate-800 tracking-wider">
              <tr>
                {activeTable.columns.map((col) => (
                  <th key={col.key} className="px-6 py-4 font-semibold">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {activeTable.rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-800/40 transition-colors duration-150 group"
                >
                  {activeTable.columns.map((col, colIdx) => (
                    <td
                      key={col.key}
                      className={`px-6 py-4 align-top ${
                        colIdx === 0
                          ? 'font-semibold text-white group-hover:text-blue-400 transition-colors'
                          : 'text-slate-300 leading-relaxed'
                      }`}
                    >
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes & Traps Callout Box */}
        {activeTable.notes && activeTable.notes.length > 0 && (
          <div className="p-5 bg-gradient-to-r from-blue-950/30 via-slate-900 to-amber-950/20 border-t border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <span className="font-bold text-amber-300 uppercase tracking-wider font-mono text-[11px] block">
                  High-Yield Exam Reminders:
                </span>
                {activeTable.notes.map((note, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pro Tip Footer */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs text-slate-400">
        <Info className="w-4 h-4 text-blue-400 shrink-0" />
        <p>
          Exam Tip: Multiple choice questions frequently test contrast (e.g. why choose Ingress over LoadBalancer, or what happens when a Readiness Probe fails versus a Liveness Probe).
        </p>
      </div>
    </div>
  );
};
