import { useUIStore } from '../store/uiStore';

export function useSidebar() {
  const sidebarMode = useUIStore((s) => s.sidebarMode);
  const setSidebarMode = useUIStore((s) => s.setSidebarMode);
  const cycleSidebarNarrower = useUIStore((s) => s.cycleSidebarNarrower);
  const cycleSidebarWider = useUIStore((s) => s.cycleSidebarWider);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  return { sidebarMode, setSidebarMode, cycleSidebarNarrower, cycleSidebarWider, toggleSidebar };
}
