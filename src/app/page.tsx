'use client';

import React, { useState, useMemo, useRef } from 'react';
import rawQuestions from '../data/questions.json';

interface Option {
  letter: string;
  text: string;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
  answerLetter: string;
  answerText: string;
}

const questions: Question[] = rawQuestions as Question[];

/* ── SVG Icons ─────────────────────────────────────────────── */

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    </svg>
  );
}

export default function PracticePage() {
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});
  const [userSelections, setUserSelections] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const topRef = useRef<HTMLDivElement>(null);

  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return questions.slice(start, start + pageSize);
  }, [currentPage]);

  const totalPages = Math.ceil(questions.length / pageSize);

  const handleOptionSelect = (qId: number, letter: string) => {
    setUserSelections((prev) => ({ ...prev, [qId]: letter }));
  };

  const revealAllAnswers = () => {
    const state: Record<number, boolean> = {};
    questions.forEach((q) => { state[q.id] = true; });
    setVisibleAnswers(state);
  };

  const hideAllAnswers = () => {
    setVisibleAnswers({});
    setUserSelections({});
  };

  const goToPage = (p: number) => {
    setCurrentPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="mesh-bg" />
      <div className="noise-overlay" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/15 border border-violet-500/25">
              <BookIcon />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight" style={{ color: '#f1f5f9' }}>
                GST 212 Practice
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="pill pill-violet">{questions.length} Questions</span>
                <span className="pill pill-cyan">Philosophy</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={revealAllAnswers} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
              <EyeIcon /> Show All
            </button>
            <button onClick={hideAllAnswers} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs">
              <EyeOffIcon /> Hide All
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main ref={topRef} className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="space-y-4">
          {paginatedQuestions.map((q) => {
            const selectedOpt = userSelections[q.id];
            const hasAnswered = !!selectedOpt;
            const isAnswerShown = !!visibleAnswers[q.id];
            const showFeedback = hasAnswered || isAnswerShown;

            return (
              <article key={q.id} className="glass-card rounded-2xl overflow-hidden">
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="q-badge">{q.id}</span>
                    <h2 className="text-sm sm:text-[0.9375rem] font-medium leading-relaxed pt-0.5" style={{ color: '#e2e8f0' }}>
                      {q.question}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 sm:pl-12">
                    {q.options.map((opt) => {
                      const isSelected = selectedOpt === opt.letter;
                      const isCorrectOption = opt.letter === q.answerLetter;

                      let optClass = 'option-btn';
                      let badgeClass = 'letter-badge default';
                      let textColor = '#cbd5e1';

                      if (showFeedback) {
                        if (isCorrectOption) {
                          optClass += ' correct';
                          badgeClass = 'letter-badge correct';
                          textColor = '#a7f3d0';
                        } else if (isSelected) {
                          optClass += ' wrong';
                          badgeClass = 'letter-badge wrong';
                          textColor = '#fca5a5';
                        }
                      }

                      return (
                        <button
                          key={opt.letter}
                          onClick={() => handleOptionSelect(q.id, opt.letter)}
                          className={`${optClass} w-full text-left p-3 rounded-xl flex items-start gap-2.5 cursor-pointer`}
                        >
                          <span className={badgeClass}>{opt.letter}</span>
                          <span className="text-[0.8125rem] leading-snug pt-0.5" style={{ color: textColor }}>
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div className={`answer-reveal flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                      selectedOpt === q.answerLetter
                        ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300'
                        : 'bg-rose-500/10 border border-rose-500/25 text-rose-300'
                    }`}>
                      {selectedOpt === q.answerLetter ? (
                        <><CheckCircleIcon /> Correct!</>
                      ) : (
                        <><XCircleIcon />{' '}Wrong {'\u2014'} the answer is ({q.answerLetter}) {q.answerText || ''}</>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="glass-toolbar rounded-2xl p-4 flex items-center justify-between gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              className="pagination-btn pagination-prev flex items-center gap-1.5"
            >
              <ChevronLeftIcon /> Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 7) return true;
                  if (p === 1 || p === totalPages) return true;
                  if (Math.abs(p - currentPage) <= 1) return true;
                  return false;
                })
                .reduce<(number | 'dots')[]>((acc, p, idx, arr) => {
                  if (idx > 0) {
                    const prev = arr[idx - 1];
                    if (p - prev > 1) acc.push('dots');
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === 'dots' ? (
                    <span key={`dots-${i}`} className="px-1 text-xs" style={{ color: '#475569' }}>{'\u2026'}</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => goToPage(item as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                        currentPage === item
                          ? 'text-white'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                      style={currentPage === item ? {
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(6, 182, 212, 0.6))',
                        boxShadow: '0 2px 10px rgba(139, 92, 246, 0.3)'
                      } : {}}
                    >
                      {item}
                    </button>
                  )
                )}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              className="pagination-btn pagination-next flex items-center gap-1.5"
            >
              Next <ChevronRightIcon />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-xs font-medium" style={{ color: '#475569' }}>
          GST 212 {'\u00b7'} {questions.length} Deduplicated Questions {'\u00b7'} Built with Next.js
        </p>
      </footer>
    </div>
  );
}
