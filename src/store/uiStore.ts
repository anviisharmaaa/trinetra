import { create } from 'zustand';
import { loadJSON, saveJSON } from '../utils/localStorage';

export type SidebarMode = 'expanded' | 'compact' | 'hidden';
export type ModalType = 'command-palette' | 'shortcuts' | null;

interface UIState {
  sidebarMode: SidebarMode;
  rightPanelOpen: boolean;
  aiAssistantOpen: boolean;
  aiAssistantExpanded: boolean;
  commandPaletteOpen: boolean;
  activeModal: ModalType;
  density: 'compact' | 'comfortable';
  toasts: { id: string; message: string; tone: 'info' | 'success' | 'warning' | 'danger' }[];

  setSidebarMode: (mode: SidebarMode) => void;
  cycleSidebarNarrower: () => void;
  cycleSidebarWider: () => void;
  toggleSidebar: () => void;
  setRightPanelOpen: (open: boolean) => void;
  toggleAIAssistant: () => void;
  setAIAssistantExpanded: (v: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  setActiveModal: (m: ModalType) => void;
  pushToast: (message: string, tone?: 'info' | 'success' | 'warning' | 'danger') => void;
  dismissToast: (id: string) => void;
}

const persistedSidebar = loadJSON<SidebarMode>('ui.sidebarState', 'expanded');
const persistedDensity = loadJSON<'compact' | 'comfortable'>('ui.density', 'compact');

export const useUIStore = create<UIState>((set, get) => ({
  sidebarMode: persistedSidebar,
  rightPanelOpen: false,
  aiAssistantOpen: false,
  aiAssistantExpanded: false,
  commandPaletteOpen: false,
  activeModal: null,
  density: persistedDensity,
  toasts: [],

  setSidebarMode: (mode) => {
    saveJSON('ui.sidebarState', mode);
    set({ sidebarMode: mode });
  },
  cycleSidebarNarrower: () => {
    const order: SidebarMode[] = ['expanded', 'compact', 'hidden'];
    const idx = order.indexOf(get().sidebarMode);
    const next = order[Math.min(idx + 1, order.length - 1)];
    get().setSidebarMode(next);
  },
  cycleSidebarWider: () => {
    const order: SidebarMode[] = ['expanded', 'compact', 'hidden'];
    const idx = order.indexOf(get().sidebarMode);
    const next = order[Math.max(idx - 1, 0)];
    get().setSidebarMode(next);
  },
  toggleSidebar: () => {
    const current = get().sidebarMode;
    get().setSidebarMode(current === 'hidden' ? 'expanded' : 'hidden');
  },
  setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
  toggleAIAssistant: () => set((s) => ({ aiAssistantOpen: !s.aiAssistantOpen })),
  setAIAssistantExpanded: (v) => set({ aiAssistantExpanded: v }),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  setActiveModal: (m) => set({ activeModal: m }),
  pushToast: (message, tone = 'info') =>
    set((s) => ({ toasts: [...s.toasts, { id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, message, tone }] })),
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
