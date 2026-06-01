'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  type Tab,
  type TabState,
  type TabAction,
  tabReducer,
  HOME_TAB,
  ALL_TABS,
  getTabByPath,
} from './tabs';
import { type PortfolioData } from './parseInfo';

interface TabContextValue {
  state: TabState;
  dispatch: React.Dispatch<TabAction>;
  portfolioData: PortfolioData;
}

const TabContext = createContext<TabContextValue | null>(null);

export function useTabContext(): TabContextValue {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error('useTabContext must be used within TabProvider');
  return ctx;
}

function getInitialState(): TabState {
  return {
    openTabs: [HOME_TAB],
    activeTabId: 'home',
    isPanelOpen: true,
    activePanelTab: 'terminal',
  };
}

export function TabProvider({
  children,
  portfolioData,
}: {
  children: ReactNode;
  portfolioData: PortfolioData;
}) {
  const [state, dispatch] = useReducer(tabReducer, undefined, getInitialState);
  const isHydrated = useRef(false);
  const skipNextSave = useRef(false);
  const pathname = usePathname();

  // Restore from sessionStorage on mount — single RESTORE dispatch (no flash)
  useEffect(() => {
    try {
      const savedTabs = sessionStorage.getItem('openTabs');
      const savedActive = sessionStorage.getItem('activeTabId');
      const savedPanelOpen = sessionStorage.getItem('isPanelOpen');
      const savedPanelTab = sessionStorage.getItem('activePanelTab');

      if (savedTabs) {
        const parsed: Tab[] = JSON.parse(savedTabs);
        const validTabs = parsed.filter((t) =>
          ALL_TABS.some((at) => at.id === t.id)
        );
        if (validTabs.length > 0) {
          const activeId =
            savedActive && validTabs.some((t) => t.id === savedActive)
              ? savedActive
              : validTabs[0].id;
          skipNextSave.current = true; // Prevent saving the restored state back immediately
          dispatch({ type: 'RESTORE', tabs: validTabs, activeId });
        }
      }

      // Check mobile screen width client-side
      const isMobile = window.innerWidth < 768;

      if (savedPanelOpen === 'false' || (savedPanelOpen === null && isMobile)) {
        dispatch({ type: 'SET_PANEL_OPEN', open: false });
      } else {
        dispatch({ type: 'SET_PANEL_OPEN', open: true });
      }

      if (savedPanelTab === 'terminal' || savedPanelTab === 'problems' || savedPanelTab === 'chat') {
        dispatch({ type: 'SET_PANEL_TAB', tab: savedPanelTab });
      }
    } catch {
      // sessionStorage unavailable or corrupted — use defaults
    }
    isHydrated.current = true;
  }, []);

  // Pathname sync: auto-open a tab when navigating via <Link> from page content
  useEffect(() => {
    if (!isHydrated.current) return;
    const tab = getTabByPath(pathname);
    if (tab) {
      dispatch({ type: 'OPEN_TAB', tab });
    }
  }, [pathname]);

  // Persist to sessionStorage on every state change
  useEffect(() => {
    if (!isHydrated.current) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    try {
      sessionStorage.setItem('openTabs', JSON.stringify(state.openTabs));
      sessionStorage.setItem('activeTabId', state.activeTabId ?? '');
      sessionStorage.setItem('isPanelOpen', String(state.isPanelOpen));
      sessionStorage.setItem('activePanelTab', state.activePanelTab);
    } catch {
      // sessionStorage unavailable
    }
  }, [state]);

  return (
    <TabContext.Provider value={{ state, dispatch, portfolioData }}>
      {children}
    </TabContext.Provider>
  );
}
