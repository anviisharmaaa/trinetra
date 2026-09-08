import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { useInvestigationStore } from '../store/investigationStore';

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || el.isContentEditable;
}

export function useKeyboardShortcuts(caseId: string | undefined) {
  const navigate = useNavigate();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);
  const closeCommandPalette = useUIStore((s) => s.closeCommandPalette);
  const activeModal = useUIStore((s) => s.activeModal);
  const setActiveModal = useUIStore((s) => s.setActiveModal);
  const commandPaletteOpen = useUIStore((s) => s.commandPaletteOpen);
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCommandPalette();
        return;
      }
      if (mod && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
        return;
      }
      if (e.key === 'Escape') {
        if (commandPaletteOpen) closeCommandPalette();
        else if (activeModal) setActiveModal(null);
        return;
      }

      if (isTypingTarget(e.target) || mod || e.altKey) return;
      if (!caseId) return;

      switch (e.key.toLowerCase()) {
        case 'g':
          navigate(`/cases/${caseId}/network`);
          break;
        case 'c':
          navigate(`/cases/${caseId}/cctv`);
          break;
        case 'p':
          if (selectedEntityId) navigate(`/cases/${caseId}/person/${selectedEntityId}`);
          break;
        case 'm':
          navigate(`/cases/${caseId}/location`);
          break;
        case 't':
          navigate(`/cases/${caseId}/timeline`);
          break;
        default:
          break;
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [caseId, navigate, toggleSidebar, openCommandPalette, closeCommandPalette, activeModal, setActiveModal, commandPaletteOpen, selectedEntityId]);
}
