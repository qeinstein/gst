'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
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

/* ── SVG Icons (inline, no dependency needed) ─────────────── */

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

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

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
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

function HashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

export default function PracticePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});
  const [userSelections, setUserSelections] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(15);
  const [jumpTo, setJumpTo] = useState('');
  const topRef = useRef<HTMLDivElement>(null);

  const filteredQuestions = useMemo(() => {
    if (!searchTerm.trim()) return questions;
    const term = searchTerm.toLowerCase();
    return questions.filter(
      (q) =>
        q.id.toString() === term ||
        q.question.toLowerCase().includes(term) ||
        q.options.some((o) => o.text.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  const paginatedQuestions = useMemo(() => {
    if (pageSize === 'all') return filteredQuestions;
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredQuestions.length / pageSize);

  const toggleAnswer = (id: number) => {
    setVisibleAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOptionSelect = (qId: number, letter: string) => {
    setUserSelections((prev) => ({ ...prev, [qId]: letter }));
  };

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(jumpTo, 10);
    if (!isNaN(num) && num >= 1 && num <= questions.length) {
      setSearchTerm(num.toString());
      setJumpTo('');
    }
  };

  const revealAllAnswers = () => {
    const state: Record<number, boolean> = {};
    filteredQuestions.forEach((q) => { state[q.id] = true; });
    setVisibleAnswers(state);
  };

  const hideAllAnswers = () => setVisibleAnswers({});

  const goToPage = (p: number) => {
    setCurrentPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // count how many of the filtered questions have visible answers
  const answersShownCount = filteredQuestions.filter((q) => visibleAnswers[q.id]).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background layers */}
      <div className="mesh-bg" />
      <div className="noise-overlay" />

      {/* ─── Header ──────────────────────────────── */}
      <header className="sticky top-0 z-40 glass-header">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Left: Brand */}
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

          {/* Right: Bulk actions */}
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

      {/* ─── Main ────────────────────────────────── */}
      <main ref={topRef} className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Toolbar ────────────────────────────── */}
        <div className="glass-toolbar rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <div className="md:col-span-8 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search by keyword, topic, or question number…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="input-field pl-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/5"
                  style={{ color: '#64748b' }}
                >
                  <XIcon />
                </button>
              )}
            </div>

            {/* Jump to Q# */}
            <form onSubmit={handleJump} className="md:col-span-4 flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }}>
                  <HashIcon />
                </span>
                <input
                  type="number"
                  min="1"
                  max={questions.length}
                  placeholder={`Q# (1–${questions.length})`}
                  value={jumpTo}
                  onChange={(e) => setJumpTo(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
              <button type="submit" className="btn-primary px-4 py-2.5 text-sm whitespace-nowrap">
                Jump
              </button>
            </form>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <p className="text-xs" style={{ color: '#64748b' }}>
              Showing{' '}
              <span className="font-semibold" style={{ color: '#94a3b8' }}>{filteredQuestions.length}</span>
              {' '}of{' '}
              <span className="font-semibold" style={{ color: '#94a3b8' }}>{questions.length}</span>
              {' '}questions
              {answersShownCount > 0 && (
                <span style={{ color: '#6ee7b7' }}> · {answersShownCount} answers shown</span>
              )}
            </p>

            <div className="flex items-center gap-1.5">
              <span className="text-xs mr-1" style={{ color: '#64748b' }}>Per page:</span>
              {[15, 30, 50, 'all' as const].map((size) => (
                <button
                  key={String(size)}
                  onClick={() => { setPageSize(size); setCurrentPage(1); }}
                  className={`page-size-btn ${pageSize === size ? 'active' : ''}`}
                >
                  {size === 'all' ? 'All' : size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Questions ──────────────────────────── */}
        {paginatedQuestions.length === 0 ? (
          <div className="glass-toolbar rounded-2xl empty-state">
            <div className="empty-state-icon">?</div>
            <p className="text-lg font-semibold" style={{ color: '#cbd5e1' }}>No questions match your search</p>
            <p className="text-sm mt-1" style={{ color: '#64748b' }}>Try a different keyword or clear the search.</p>
            <button onClick={() => setSearchTerm('')} className="btn-primary px-5 py-2 text-xs mt-4 inline-block">
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedQuestions.map((q) => {
              const isAnswerShown = !!visibleAnswers[q.id];
              const selectedOpt = userSelections[q.id];

              return (
                <article key={q.id} className="glass-card rounded-2xl overflow-hidden">
                  {/* Card body */}
                  <div className="p-5 sm:p-6 space-y-4">

                    {/* Question text */}
                    <div className="flex items-start gap-3">
                      <span className="q-badge">{q.id}</span>
                      <h2 className="text-sm sm:text-[0.9375rem] font-medium leading-relaxed pt-0.5" style={{ color: '#e2e8f0' }}>
                        {q.question}
                      </h2>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 sm:pl-12">
                      {q.options.map((opt) => {
                        const isSelected = selectedOpt === opt.letter;
                        const isCorrect = isAnswerShown && opt.letter === q.answerLetter;

                        let optClass = 'option-btn';
                        let badgeClass = 'letter-badge default';

                        if (isCorrect) {
                          optClass += ' correct';
                          badgeClass = 'letter-badge correct';
                        } else if (isSelected) {
                          optClass += ' selected';
                          badgeClass = 'letter-badge selected';
                        }

                        return (
                          <button
                            key={opt.letter}
                            onClick={() => handleOptionSelect(q.id, opt.letter)}
                            className={`${optClass} w-full text-left p-3 rounded-xl flex items-start gap-2.5 cursor-pointer`}
                          >
                            <span className={badgeClass}>{opt.letter}</span>
                            <span className="text-[0.8125rem] leading-snug pt-0.5" style={{ color: isCorrect ? '#a7f3d0' : isSelected ? '#ddd6fe' : '#cbd5e1' }}>
                              {opt.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Answer action strip */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                    <hr className="divider mb-4" />
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <button
                        onClick={() => toggleAnswer(q.id)}
                        className={`btn-reveal flex items-center gap-2 px-4 py-2 text-xs ${isAnswerShown ? 'active' : ''}`}
                      >
                        {isAnswerShown ? <><EyeOffIcon /> Hide Answer</> : <><EyeIcon /> Show Answer</>}
                      </button>

                      {isAnswerShown && (
                        <div className="answer-box answer-reveal flex-1 flex items-start gap-2">
                          <CheckCircleIcon />
                          <div>
                            <span className="answer-label">Answer ({q.answerLetter}): </span>
                            <span>{q.answerText || 'See reference material'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ── Pagination ─────────────────────────── */}
        {pageSize !== 'all' && totalPages > 1 && (
          <div className="glass-toolbar rounded-2xl p-4 flex items-center justify-between gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              className="pagination-btn pagination-prev flex items-center gap-1.5"
            >
              <ChevronLeftIcon /> Previous
            </button>

            {/* Page numbers */}
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
                    <span key={`dots-${i}`} className="px-1 text-xs" style={{ color: '#475569' }}>…</span>
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

      {/* ─── Footer ──────────────────────────────── */}
      <footer className="mt-auto py-8 px-4 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-xs font-medium" style={{ color: '#475569' }}>
          GST 212 · {questions.length} Deduplicated Questions · Built with Next.js
        </p>
      </footer>
    </div>
  );
}
