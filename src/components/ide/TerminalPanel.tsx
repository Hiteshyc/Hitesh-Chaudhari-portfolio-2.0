'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTabContext } from '@/lib/TabContext';
import { useRouter } from 'next/navigation';
import {
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
  AlertCircle,
  Info,
  CheckCircle2,
  MessageSquare,
  Send,
  CornerDownLeft,
} from 'lucide-react';

// Helper function to render simple Markdown (bold, links) inside chatbot messages
function parseMarkdown(text: string) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // Split inline bold patterns and link patterns
    const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    const parsedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={partIdx} className="font-bold text-text-primary">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('[') && part.includes('](')) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          return (
            <a
              key={partIdx}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-secondary hover:underline cursor-pointer font-semibold"
            >
              {match[1]}
            </a>
          );
        }
      }
      return part;
    });

    return (
      <div key={lineIdx} className={line.trim() === '' ? 'h-2' : 'min-h-[1.25em]'}>
        {parsedLine}
      </div>
    );
  });
}

export function TerminalPanel() {
  const { state, dispatch, portfolioData } = useTabContext();
  const { isPanelOpen, activePanelTab } = state;
  const router = useRouter();

  const [panelHeight, setPanelHeight] = useState<string | number>(170); // default height to display greetings cleanly
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [hasExpanded, setHasExpanded] = useState<boolean>(false);

  const handleTerminalFocus = () => {
    if (!hasExpanded && !isMaximized) {
      setPanelHeight('32vh'); // Smoothly expands to a standard terminal ratio (32% viewport height)
      setHasExpanded(true);
    }
  };

  // --- Drag Resize Handler ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const container = e.currentTarget.parentElement;
    if (!container) return;
    const startHeight = container.offsetHeight; // get actual height in pixels
    const startY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(120, Math.min(window.innerHeight - 100, startHeight - deltaY));
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // --- Terminal State ---
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Welcome to Hitesh Chaudhari\'s Interactive Portfolio Shell.',
    'Type "help" to view a list of available professional commands.',
    'Type "neofetch" for visual system diagnostics.',
    '',
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [matrixActive, setMatrixActive] = useState(false);

  // --- AI Chat State ---
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'user' | 'agent';
    text: string;
    reasoning?: string[];
  }>>([
    {
      sender: 'agent',
      text: `Hello! I'm Hitesh's Agentic RAG Assistant. Since Hitesh builds intelligent systems and Agentic RAG frameworks (like his R&D work at Samsung!), I am equipped to answer any questions you have about his skills, experience, projects, or how to get in touch. Ask me anything!`,
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiReasoningSteps, setAiReasoningSteps] = useState<string[]>([]);

  // Refs for auto-scroll
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (activePanelTab === 'terminal') {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory, activePanelTab]);

  useEffect(() => {
    if (activePanelTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAiLoading, aiReasoningSteps, activePanelTab]);

  // Matrix screensaver canvas animation
  useEffect(() => {
    if (!matrixActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ypos: number[] = [];
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$@#%&';

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 200;
      const cols = Math.floor(canvas.width / 14);
      ypos = Array(cols).fill(0);
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.fillStyle = 'rgba(20, 20, 20, 0.08)'; // Void background fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'var(--accent-primary, #a6e3a1)'; // Primary theme accent
      ctx.font = '11px monospace';

      ypos.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        ctx.fillText(char, x, y);
        if (y > 100 + Math.random() * 10000) {
          ypos[i] = 0;
        } else {
          ypos[i] = y + 13;
        }
      });
    };

    const interval = setInterval(render, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [matrixActive]);

  // Keyboard shortcut listener: Ctrl + ` toggles panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_PANEL' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  if (!isPanelOpen) return null;

  // --- Theme Dynamic Changes ---
  const applyTheme = (themeName: string) => {
    const valid = ['catppuccin-mocha', 'midnight-void', 'matcha-earthy', 'catppuccin-latte', 'matcha-parchment'];
    let chosen = themeName.trim().toLowerCase();

    // Map shortcuts
    if (chosen === 'mocha') chosen = 'catppuccin-mocha';
    if (chosen === 'void') chosen = 'midnight-void';
    if (chosen === 'earthy') chosen = 'matcha-earthy';
    if (chosen === 'latte') chosen = 'catppuccin-latte';
    if (chosen === 'parchment') chosen = 'matcha-parchment';

    if (valid.includes(chosen)) {
      document.documentElement.setAttribute('data-theme', chosen);
      localStorage.setItem('portfolio-theme', chosen);
      return { success: true, theme: chosen };
    }
    return { success: false, theme: themeName };
  };

  // --- Terminal Command Executive ---
  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const primary = parts[0].toLowerCase();
    const args = parts.slice(1);

    const promptText = `visitor@hitesh-portfolio:~$ ${trimmed}`;
    let output: string[] = [];

    switch (primary) {
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;

      case 'help':
        output = [
          'Available professional commands:',
          '  neofetch    - Display developer system diagnostics & environment specs',
          '  about       - Display professional summary & background',
          '  projects    - View portfolio projects with descriptions and repository links',
          '  skills      - View technical stack & capabilities',
          '  experience  - View timeline of career, R&D projects & positions',
          '  contact     - Display emails, profiles, and phone coordinates',
          '  theme [t]   - Switch IDE theme (mocha, void, earthy, latte, parchment)',
          '  matrix      - Trigger a Canvas green falling character screen saver',
          '  clear       - Clear the terminal console',
        ];
        break;

      case 'neofetch': {
        const themeAttr = document.documentElement.getAttribute('data-theme') || 'catppuccin-mocha';
        output = [
          '  _   _   ___   _____   _____   ____    _   _     hitesh@portfolio-host',
          ' | | | | |_ _| |_   _| | ____| / ___|  | | | |    ---------------------',
          ' | |_| |  | |    | |   |  _|   \\___ \\  | |_| |    OS: Hitesh-OS v1.0.0 (Windows Client)',
          ' |  _  |  | |    | |   | |___   ___) | |  _  |    Host: VIT Vellore Academic-Net',
          ' |_| |_| |___|   |_|   |_____| |____/  |_| |_|    Uptime: 20 Years of Learning 🚀',
          '                                                  Shell: Custom Interactive Zsh/Bash',
          '                                                  Kernel: React 19.2.4 + Next.js 16.2.6',
          `                                                  Theme: ${themeAttr}`,
          '                                                  CPU: Curiosity Core (8 Cores @ 4.2GHz)',
          '                                                  Memory: 16 GB / 32 GB (Passion Allocated)',
          '                                                  Target: Full-Stack / AI-ML Engineering',
        ];
        break;
      }

      case 'about':
        output = [
          '--------------------------------------------------------------------------------',
          'Hitesh Chaudhari — CS Undergraduate at VIT Vellore.',
          'Building at the intersection of AI, data-driven systems, and scalable full-stack applications.',
          'Currently researching Agentic RAG frameworks and multi-source semantic routing as a',
          'Research Intern under Samsung PRISM R&D.',
          '--------------------------------------------------------------------------------',
        ];
        break;

      case 'projects':
        output.push('--- FEATURED PORTFOLIO PROJECTS ---');
        portfolioData.projects.forEach((proj, idx) => {
          output.push(`[${idx}] ${proj.title}`);
          output.push(`    Description: ${proj.description}`);
          output.push(`    Technologies: ${proj.tags.join(', ')}`);
          output.push(`    Repository: ${proj.link}`);
          output.push('');
        });
        break;

      case 'skills':
        output.push('--- TECHNICAL COMPETENCIES & TOOLKIT ---');
        portfolioData.skills.forEach((cat) => {
          output.push(`- ${cat.category}: ${cat.items.join(', ')}`);
        });
        break;

      case 'experience':
        output.push('--- PROFESSIONAL EXPERIENCES ---');
        portfolioData.experience.forEach((exp) => {
          output.push(`* ${exp.role} @ ${exp.company}`);
          output.push(`  Period: ${exp.period}`);
          exp.bullets.forEach((bullet) => {
            output.push(`    • ${bullet}`);
          });
          output.push('');
        });
        break;

      case 'contact':
        output = [
          '--- CONTACT COORDINATES ---',
          `Email:     ${portfolioData.socials.email}`,
          `Phone:     ${portfolioData.socials.phone || '8929074747'}`,
          `LinkedIn:  ${portfolioData.socials.linkedin}`,
          `GitHub:    ${portfolioData.socials.github}`,
          'Feel free to connect or send a formal proposal. Ready for internships and roles.',
        ];
        break;

      case 'theme': {
        if (args.length === 0) {
          output = [
            'Usage: theme [theme-name]',
            'Available themes: mocha, void, earthy, latte, parchment',
          ];
        } else {
          const res = applyTheme(args[0]);
          if (res.success) {
            output = [`Theme successfully updated to "${res.theme}".`];
          } else {
            output = [
              `Error: Theme "${res.theme}" is invalid.`,
              'Please choose from: mocha, void, earthy, latte, parchment',
            ];
          }
        }
        break;
      }

      case 'matrix':
        setMatrixActive(true);
        setTerminalInput('');
        return;

      default:
        output = [
          `Command not found: "${primary}".`,
          'Type "help" to view operational terminal functions.',
        ];
    }

    setTerminalHistory((prev) => [...prev, promptText, ...output, '']);
    setTerminalInput('');
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(terminalInput);
  };

  // Up/down arrow command history cycling
  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setTerminalInput(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setTerminalInput('');
      } else {
        setHistoryIndex(nextIdx);
        setTerminalInput(commandHistory[nextIdx]);
      }
    }
  };

  // --- RAG AI Conversational Brain ---
  const handleAiQuestion = async (question: string) => {
    if (!question.trim()) return;

    // Add user message
    setChatMessages((prev) => [...prev, { sender: 'user', text: question }]);
    setChatInput('');
    setIsAiLoading(true);

    const lowercaseQuery = question.toLowerCase();

    // RAG Reasoning simulation logs
    const steps = [
      `[Decomposing query: "${question}"]`,
      `[Routing: Query classified under topic "${
        lowercaseQuery.includes('samsung') || lowercaseQuery.includes('rag')
          ? 'Research Internships'
          : lowercaseQuery.includes('project')
          ? 'Technical Engineering'
          : lowercaseQuery.includes('gpa') || lowercaseQuery.includes('vit')
          ? 'Academics'
          : lowercaseQuery.includes('skills') || lowercaseQuery.includes('tech')
          ? 'Technical Toolkit'
          : 'Hiring/General Info'
      }"]`,
      `[Semantic Retrieval: Scanning content/info.md vector blocks...]`,
      `[Retrieval complete: 2 highly matching chunks loaded. Synthesis starting...]`,
    ];

    // Stream reasoning steps over 800ms
    setAiReasoningSteps([]);
    for (let i = 0; i < steps.length; i++) {
      await new Promise((r) => setTimeout(r, 150));
      setAiReasoningSteps((prev) => [...prev, steps[i]]);
    }

    let answer = `I'm Hitesh's AI agent! Feel free to ask me about his projects, skills, education (VIT), research (Samsung PRISM), or how to hire him. I'd love to tell you more!`;

    // Match exact details to maintain high professional standards
    if (lowercaseQuery.includes('samsung') || lowercaseQuery.includes('rag') || lowercaseQuery.includes('prism')) {
      answer = `Hitesh is currently working on an impressive **Samsung PRISM Research Project** focused on developing an **Agentic RAG framework**. This system decomposes complex queries and routes them across multiple domain-specific knowledge bases using semantic routing, vector databases (like Milvus/Chroma), and low-latency retrieval techniques to optimize Samsung device support workflows.`;
    } else if (lowercaseQuery.includes('project')) {
      const projLines = portfolioData.projects.map((proj, idx) => {
        return `${idx + 1}. **${proj.title}**: ${proj.description} *(Technologies: ${proj.tags.join(', ')})*`;
      }).join('\n\n');
      answer = `Hitesh has engineered several advanced, high-performance systems:\n\n${projLines}`;
    } else if (lowercaseQuery.includes('gpa') || lowercaseQuery.includes('vit') || lowercaseQuery.includes('cgpa') || lowercaseQuery.includes('grades') || lowercaseQuery.includes('education')) {
      answer = `Hitesh is completing his **Computer Science & Engineering** undergraduate degree at **VIT Vellore**, holding an exceptional CGPA of **8.89**. He is a top performer, successfully applying core Computer Science theories (algorithms, ML models, distributed systems) to high-impact live applications.`;
    } else if (lowercaseQuery.includes('skills') || lowercaseQuery.includes('tech') || lowercaseQuery.includes('stack') || lowercaseQuery.includes('languages')) {
      const skillsLines = portfolioData.skills.map((cat) => {
        return `- **${cat.category}**: ${cat.items.join(', ')}`;
      }).join('\n');
      answer = `Hitesh possesses a robust, enterprise-ready technical toolkit:\n\n${skillsLines}`;
    } else if (lowercaseQuery.includes('hire') || lowercaseQuery.includes('job') || lowercaseQuery.includes('contact') || lowercaseQuery.includes('email') || lowercaseQuery.includes('work') || lowercaseQuery.includes('phone') || lowercaseQuery.includes('opportunity')) {
      answer = `Hitesh is actively seeking **Software Engineering and AI/ML Engineering** internship and full-time roles. He is fully authorized to start immediately.
You can get in touch with him directly:
- **Email**: ${portfolioData.socials.email}
- **Phone**: ${portfolioData.socials.phone || '8929074747'}
- **LinkedIn**: [linkedin.com/in/hiteshyc/](${portfolioData.socials.linkedin})
- **GitHub**: [github.com/Hiteshyc](${portfolioData.socials.github})`;
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: 'agent', text: answer, reasoning: [...steps] },
    ]);
    setIsAiLoading(false);
    setAiReasoningSteps([]);
  };

  return (
    <div
      className={`border-t border-border bg-bg-sidebar select-none font-mono transition-all duration-200 overflow-hidden flex flex-col relative ${
        isMaximized ? 'h-[65vh]' : ''
      }`}
      style={{ height: isMaximized ? '65vh' : typeof panelHeight === 'number' ? `${panelHeight}px` : panelHeight }}
    >
      {/* Dynamic Top Drag Resize Bar */}
      {!isMaximized && (
        <div
          onMouseDown={handleMouseDown}
          className="h-[3px] w-full bg-border hover:bg-accent-primary cursor-ns-resize absolute top-0 left-0 right-0 z-50 transition-colors"
          title="Drag to resize panel height"
        />
      )}
      {/* Panel Tab Title Bar */}
      <div className="flex items-center justify-between h-9 px-3 bg-bg-tab border-b border-border shrink-0 text-xs">
        <div className="flex items-center gap-1.5 h-full">
          <button
            onClick={() => dispatch({ type: 'SET_PANEL_TAB', tab: 'problems' })}
            className={`px-3 py-2 h-full flex items-center gap-1.5 transition-colors relative border-b-2 ${
              activePanelTab === 'problems'
                ? 'text-text-primary border-accent-primary font-bold'
                : 'text-text-muted hover:text-text-primary border-transparent'
            }`}
          >
            <span>PROBLEMS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#ef4444]/15 text-[#ef4444] text-[10px] font-bold">
              1
            </span>
          </button>

          <button
            onClick={() => dispatch({ type: 'SET_PANEL_TAB', tab: 'terminal' })}
            className={`px-3 py-2 h-full flex items-center gap-1.5 transition-colors relative border-b-2 ${
              activePanelTab === 'terminal'
                ? 'text-text-primary border-accent-primary font-bold'
                : 'text-text-muted hover:text-text-primary border-transparent'
            }`}
          >
            <span>TERMINAL</span>
          </button>

          <button
            onClick={() => dispatch({ type: 'SET_PANEL_TAB', tab: 'chat' })}
            className={`px-3 py-2 h-full flex items-center gap-1.5 transition-colors relative border-b-2 ${
              activePanelTab === 'chat'
                ? 'text-text-primary border-accent-primary font-bold'
                : 'text-text-muted hover:text-text-primary border-transparent'
            }`}
          >
            <div className="relative flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green mr-1.5 animate-pulse" />
              <span>ASK HITESH (AI)</span>
            </div>
          </button>
        </div>

        {/* Panel Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
            title={isMaximized ? 'Minimize Height' : 'Maximize Height'}
          >
            {isMaximized ? (
              <Minimize2 size={13} strokeWidth={2.5} />
            ) : (
              <Maximize2 size={13} strokeWidth={2.5} />
            )}
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_PANEL_OPEN', open: false })}
            className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
            title="Close Panel"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Panel Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto bg-bg-editor p-4 relative flex flex-col">
        {/* --- PROBLEMS TAB VIEW --- */}
        {activePanelTab === 'problems' && (
          <div className="space-y-3.5 text-[12px] flex-1">
            <div className="text-text-muted text-[11px] border-b border-border pb-1.5 mb-2 font-semibold">
              Ready Checklist & Readiness Diagnostics
            </div>

            {/* Error Item: Hiring Status */}
            <div className="flex items-start gap-2.5 p-2 bg-[#ef4444]/6 border border-[#ef4444]/20 rounded-sm">
              <AlertCircle size={15} className="text-[#ef4444] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-text-primary flex items-center gap-2">
                  <span>Hiring Protocol Pending</span>
                  <span className="text-[10px] uppercase font-bold text-[#ef4444] tracking-wider">
                    Required Action
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Recruiter has not finalized a meeting or contract with Hitesh. Please execute
                  the `contact` command in the Terminal, visit the Ask AI tab, or click the button below to resolve.
                </p>
                <button
                  onClick={() => {
                    dispatch({ type: 'OPEN_TAB', tab: { id: 'contact', label: 'contact.jsx', path: '/contact', icon: 'jsx' } });
                    router.push('/contact');
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#ef4444] text-white text-[10px] font-bold rounded-sm hover:brightness-110 transition-all cursor-pointer"
                >
                  Initiate Contract / Contact Details
                </button>
              </div>
            </div>

            {/* Success Item: Samsung PRISM */}
            <div className="flex items-start gap-2.5 p-2 bg-[#a6e3a1]/6 border border-[#a6e3a1]/10 rounded-sm">
              <CheckCircle2 size={15} className="text-accent-green shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-text-primary flex items-center gap-2">
                  <span>Samsung PRISM R&D Module Online</span>
                  <span className="text-[10px] uppercase font-bold text-accent-green tracking-wider">
                    Success
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Research on Agentic RAG multi-source routing pipelines successfully integrated. Currently active in Samsung research laboratories.
                </p>
              </div>
            </div>

            {/* Success Item: VIT CGPA */}
            <div className="flex items-start gap-2.5 p-2 bg-[#a6e3a1]/6 border border-[#a6e3a1]/10 rounded-sm">
              <CheckCircle2 size={15} className="text-accent-green shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-text-primary flex items-center gap-2">
                  <span>Academics Verifiably Stable</span>
                  <span className="text-[10px] uppercase font-bold text-accent-green tracking-wider">
                    Success
                  </span>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  Computer Science undergraduate record verified at VIT Vellore. CGPA: 8.89 / 10.0.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- TERMINAL TAB VIEW --- */}
        {activePanelTab === 'terminal' && (
          <div
            onClick={handleTerminalFocus}
            className="flex-1 flex flex-col font-mono text-[12px] relative overflow-hidden select-text"
          >
            {matrixActive ? (
              <div className="absolute inset-0 z-30 bg-black flex flex-col">
                <div className="flex items-center justify-between p-2 bg-black border-b border-white/10 text-white text-[10px]">
                  <span>screensaver: matrix.sh</span>
                  <button
                    onClick={() => setMatrixActive(false)}
                    className="px-2 py-0.5 border border-white/20 hover:bg-white/10 rounded transition-colors text-white"
                  >
                    Close Screen Saver
                  </button>
                </div>
                <div className="flex-1 relative cursor-pointer" onClick={() => setMatrixActive(false)}>
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                </div>
              </div>
            ) : null}

            {/* Buffer History */}
            <div className="flex-1 overflow-y-auto space-y-1 text-text-primary">
              {terminalHistory.map((line, idx) => (
                <pre key={idx} className="whitespace-pre-wrap leading-relaxed select-text font-mono">
                  {line}
                </pre>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Command Input Form */}
            <form
              onSubmit={handleTerminalSubmit}
              className="flex items-center gap-1 shrink-0 border-t border-border/20 pt-2.5 mt-2 bg-bg-editor relative z-10"
            >
              <span className="text-accent-secondary shrink-0 font-bold">
                visitor@hitesh-portfolio:~$
              </span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                onFocus={handleTerminalFocus}
                className="flex-1 bg-transparent text-text-primary focus:outline-none font-mono caret-accent-primary select-text"
                placeholder="type help to begin..."
                autoFocus
              />
            </form>
          </div>
        )}

        {/* --- ASK HITESH AI TAB VIEW --- */}
        {activePanelTab === 'chat' && (
          <div className="flex-1 flex flex-col text-[12px] justify-between relative select-text">
            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 select-text max-h-[400px]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <span className="text-[10px] text-text-muted mb-1 font-semibold">
                    {msg.sender === 'user' ? 'RECRUITER' : 'AGENTIC RAG BOT'}
                  </span>
                  <div
                    className={`p-3 rounded-md leading-relaxed select-text ${
                      msg.sender === 'user'
                        ? 'bg-accent-primary text-bg-sidebar font-semibold'
                        : 'bg-bg-hover/40 border border-border text-text-primary'
                    }`}
                  >
                    {parseMarkdown(msg.text)}
                  </div>
                </div>
              ))}

              {/* Simulated Reasoning steps when loading */}
              {isAiLoading && (
                <div className="flex flex-col max-w-[85%] mr-auto items-start">
                  <span className="text-[10px] text-text-muted mb-1 font-semibold">
                    AGENTIC RAG BOT
                  </span>
                  <div className="p-3 bg-bg-hover/20 border border-border/50 text-text-muted rounded-md space-y-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent-teal rounded-full animate-ping" />
                      <span className="font-bold text-[10px] tracking-wider uppercase text-accent-teal">
                        Thinking Process (Agent RAG Routing)
                      </span>
                    </div>
                    <div className="font-mono text-[10px] space-y-1">
                      {aiReasoningSteps.map((step, i) => (
                        <div key={i} className="text-text-muted/80">
                          {step}
                        </div>
                      ))}
                      {aiReasoningSteps.length < 4 && (
                        <div className="text-text-muted animate-pulse">Running retrieval models...</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Suggesters */}
            {chatMessages.length === 1 && !isAiLoading && (
              <div className="mb-4 space-y-2">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                  Suggested queries to check alignment:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Tell me about your Samsung R&D project',
                    'What are your main projects?',
                    'What is your technical skill set?',
                    'How can I get in touch to hire you?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleAiQuestion(q)}
                      className="px-2.5 py-1 text-xs border border-border rounded-full hover:border-accent-secondary hover:bg-bg-hover text-text-secondary hover:text-text-primary transition-all cursor-pointer text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Submission bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAiQuestion(chatInput);
              }}
              className="flex items-center gap-2 bg-bg-tab border border-border rounded p-2 focus-within:border-accent-primary transition-colors shrink-0"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about Samsung research, VIT grades, full-stack, etc..."
                disabled={isAiLoading}
                className="flex-1 bg-transparent text-text-primary text-[12px] focus:outline-none font-mono disabled:opacity-50 select-text"
              />
              <button
                type="submit"
                disabled={isAiLoading || !chatInput.trim()}
                className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-hover disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer shrink-0"
                title="Send query"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
