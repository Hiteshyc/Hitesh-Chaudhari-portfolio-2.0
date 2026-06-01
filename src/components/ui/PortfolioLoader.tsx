'use client';

import React, { useState, useEffect } from 'react';

export function PortfolioLoader() {
  const [mounted, setMounted] = useState(true);
  const [fade, setFade] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  const bootSequence = [
    'visitor@hitesh-portfolio:~$ boot_portfolio.sh',
    '[SYSTEM] Initializing Custom Web IDE...',
    '[SYSTEM] Syncing local vector embeddings [Samsung R&D]...',
    '[SYSTEM] Verified CGPA: 8.89/10.0 (VIT Vellore) [OK]',
    '[SYSTEM] Activating Agentic RAG reasoning nodes...',
    '[SYSTEM] Preparing developer workspace environment...',
    '[SUCCESS] Compilation successful. Redirecting to workspace...',
  ];

  // Sequentially display terminal boot logs
  useEffect(() => {
    if (currentLineIdx < bootSequence.length) {
      const delay = currentLineIdx === 0 ? 300 : currentLineIdx === bootSequence.length - 1 ? 400 : 250;
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, bootSequence[currentLineIdx]]);
        setCurrentLineIdx((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Initiate fade out 600ms after last line finishes
      const fadeTimer = setTimeout(() => {
        setFade(true);
      }, 600000); // Wait, let's make it quick so it's not annoying: e.g. 500ms after last line
      // Actually let's make it fade 500ms after success!
    }
  }, [currentLineIdx]);

  useEffect(() => {
    if (currentLineIdx === bootSequence.length) {
      const fadeTimer = setTimeout(() => {
        setFade(true);
        // Fully unmount after fade transition (300ms)
        const unmountTimer = setTimeout(() => {
          setMounted(false);
        }, 300);
        return () => clearTimeout(unmountTimer);
      }, 500);
      return () => clearTimeout(fadeTimer);
    }
  }, [currentLineIdx]);

  // Disable scroll while loading
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0d0d0d] font-mono text-xs px-4 transition-opacity duration-300 select-none ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-lg space-y-6">
        {/* Pulsing visual bracket logo in the center */}
        <div className="flex flex-col items-center justify-center gap-2 mb-6">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-lg bg-white/5 border border-white/10 shadow-2xl animate-pulse">
            <span className="text-xl font-bold font-display text-accent-primary" style={{ color: 'var(--accent-primary, #cba6f7)' }}>
              &lt;/&gt;
            </span>
          </div>
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold">
            Hitesh Chaudhari
          </span>
        </div>

        {/* Sequential Boot Terminal logs */}
        <div className="bg-[#141414] border border-white/5 rounded p-4 h-[210px] flex flex-col justify-start gap-1.5 shadow-xl text-left overflow-y-auto scrollbar-none">
          {lines.map((line, idx) => {
            const isInput = line.startsWith('visitor');
            const isSuccess = line.startsWith('[SUCCESS]');
            const colorClass = isInput
              ? 'text-accent-secondary'
              : isSuccess
              ? 'text-accent-green font-bold'
              : 'text-white/70';

            return (
              <div key={idx} className={`${colorClass} leading-relaxed font-mono`}>
                {line}
              </div>
            );
          })}

          {/* Typing flashing prompt cursor */}
          {currentLineIdx < bootSequence.length && (
            <div className="flex items-center gap-1 text-white/50 animate-pulse">
              <span>●</span>
              <span className="w-1.5 h-3 bg-white/70 inline-block animate-blink" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
