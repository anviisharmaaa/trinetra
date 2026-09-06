import { useInvestigationStore } from '../store/investigationStore';
import { getEntityById } from '../data';

/** Convenience hook returning the currently selected entity object (not just its id). */
export function useSelectedEntity() {
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId);
  return selectedEntityId ? getEntityById(selectedEntityId) : undefined;
}

export function useInvestigation() {
  return useInvestigationStore();
}
