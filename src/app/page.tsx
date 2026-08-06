'use client';

import React, { useState, useMemo } from 'react';
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

export default function PracticePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleAnswers, setVisibleAnswers] = useState<Record<number, boolean>>({});
  const [userSelections, setUserSelections] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | 'all'>(15);
  const [jumpTo, setJumpTo] = useState('');

  // Filter questions based on search
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

  // Paginated questions
  const paginatedQuestions = useMemo(() => {
    if (pageSize === 'all') return filteredQuestions;
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, currentPage, pageSize]);

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredQuestions.length / pageSize);

  const toggleAnswer = (id: number) => {
    setVisibleAnswers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOptionSelect = (qId: number, letter: string) => {
    setUserSelections((prev) => ({
      ...prev,
      [qId]: letter,
    }));
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
    const allState: Record<number, boolean> = {};
    filteredQuestions.forEach((q) => {
      allState[q.id] = true;
    });
    setVisibleAnswers(allState);
  };

  const hideAllAnswers = () => {
    setVisibleAnswers({});
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Hero */}
      <header className="sticky top-0 z-30 glass-panel border-b border-slate-700/50 px-4 sm:px-8 py-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                GST 212 Practice
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {questions.length} Unique Questions
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent mt-1">
              General Studies Practice Portal
            </h1>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={revealAllAnswers}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
            >
              Show All Answers
            </button>
            <button
              onClick={hideAllAnswers}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
            >
              Hide All Answers
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Search & Jump Toolbar */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <input
                type="text"
                placeholder="Search questions by keyword or number..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-2 py-0.5 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Jump To Question */}
            <form onSubmit={handleJump} className="md:col-span-4 flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={questions.length}
                placeholder={`Jump to Q# (1-${questions.length})`}
                value={jumpTo}
                onChange={(e) => setJumpTo(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
              />
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition"
              >
                Go
              </button>
            </form>
          </div>

          {/* Filter Stats & Page Size selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-t border-slate-800 pt-3">
            <div>
              Showing <span className="font-semibold text-slate-200">{filteredQuestions.length}</span> of{' '}
              <span className="font-semibold text-slate-200">{questions.length}</span> questions
            </div>

            <div className="flex items-center gap-2">
              <span>Items per page:</span>
              {[15, 30, 50, 'all'].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setPageSize(size as number | 'all');
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md transition font-medium ${
                    pageSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {size === 'all' ? 'All' : size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions List */}
        {paginatedQuestions.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
            <p className="text-lg font-medium text-slate-300">No matching questions found</p>
            <p className="text-sm text-slate-400">Try searching for a different keyword or question number.</p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-2 px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedQuestions.map((q) => {
              const isAnswerShown = !!visibleAnswers[q.id];
              const selectedOpt = userSelections[q.id];

              return (
                <div
                  key={q.id}
                  className="glass-card p-6 rounded-2xl space-y-5 border border-slate-700/60 shadow-lg hover:border-slate-600 transition"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600/30 text-indigo-300 font-bold text-sm border border-indigo-500/40">
                        {q.id}
                      </span>
                      <h2 className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                        {q.question}
                      </h2>
                    </div>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    {q.options.map((opt) => {
                      const isSelected = selectedOpt === opt.letter;
                      const isCorrect = isAnswerShown && opt.letter === q.answerLetter;

                      let btnStyle =
                        'bg-slate-800/60 border-slate-700/70 text-slate-200 hover:border-slate-500 hover:bg-slate-800';

                      if (isCorrect) {
                        btnStyle =
                          'bg-emerald-950/60 border-emerald-500/80 text-emerald-100 font-medium shadow-sm';
                      } else if (isSelected) {
                        btnStyle =
                          'bg-indigo-950/70 border-indigo-500 text-indigo-100 font-medium';
                      }

                      return (
                        <button
                          key={opt.letter}
                          onClick={() => handleOptionSelect(q.id, opt.letter)}
                          className={`w-full text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all ${btnStyle}`}
                        >
                          <span
                            className={`flex items-center justify-center min-w-[26px] h-[26px] rounded-lg text-xs font-bold uppercase transition ${
                              isCorrect
                                ? 'bg-emerald-500 text-slate-950'
                                : isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-700/80 text-slate-300'
                            }`}
                          >
                            {opt.letter}
                          </span>
                          <span className="text-sm leading-snug pt-0.5">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Show Answer Action Area */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm ${
                        isAnswerShown
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30'
                      }`}
                    >
                      {isAnswerShown ? 'Hide Answer' : 'Show Answer'}
                    </button>

                    {/* Revealed Answer Text */}
                    {isAnswerShown && (
                      <div className="flex-1 bg-slate-900/90 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 animate-fadeIn">
                        <span className="font-bold uppercase text-emerald-400">
                          Option ({q.answerLetter}):
                        </span>{' '}
                        {q.answerText || 'See reference material'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pageSize !== 'all' && totalPages > 1 && (
          <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 rounded-xl transition border border-slate-700"
            >
              Previous Page
            </button>

            <span className="text-xs text-slate-400 font-medium">
              Page <span className="text-slate-100 font-bold">{currentPage}</span> of{' '}
              <span className="text-slate-100 font-bold">{totalPages}</span>
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 rounded-xl transition border border-slate-700"
            >
              Next Page
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-6xl mx-auto space-y-1">
          <p>GST 212 Practice Bank — {questions.length} Deduplicated Unique Questions</p>
          <p className="text-slate-500">Built with Next.js & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
