'use client';

import { useTabContext } from '@/lib/TabContext';
import { Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

export function Titlebar() {
  const { state, dispatch, portfolioData } = useTabContext();

  return (
    <div className="flex items-center justify-center h-9 px-3 bg-bg-tab border-b border-border select-none shrink-0 relative">
      {/* Traffic light dots — hidden on mobile (hamburger occupies that space) */}
      <div className="hidden md:flex items-center gap-1.5 absolute left-3">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>

      {/* Title — nudged right on mobile to avoid hamburger overlap */}
      <span className="text-xs text-text-muted font-mono tracking-wide pl-8 md:pl-0 truncate max-w-[200px] sm:max-w-none">
        hiteshchaudhari : portfolio — IDE
      </span>

      {/* Professional links & panel controls on the right */}
      <div className="hidden md:flex items-center gap-3.5 absolute right-3">
        <a
          href={portfolioData.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-text-primary transition-colors cursor-pointer flex items-center"
          title="GitHub Profile"
        >
          <GithubIcon size={14} />
        </a>
        <a
          href={portfolioData.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-muted hover:text-text-primary transition-colors cursor-pointer flex items-center"
          title="LinkedIn Profile"
        >
          <LinkedinIcon size={14} />
        </a>
        <div className="w-px h-3 bg-border" />
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PANEL' })}
          className={`p-1 rounded hover:bg-bg-hover transition-colors cursor-pointer flex items-center justify-center ${
            state.isPanelOpen ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'
          }`}
          title="Toggle Bottom Terminal Panel (Ctrl+`)"
        >
          <Terminal size={14} />
        </button>
      </div>
    </div>
  );
}
