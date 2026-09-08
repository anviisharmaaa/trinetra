import { useEffect } from 'react';
import type { RefObject } from 'react';

/** Fires `onOutside` on any pointerdown that lands outside every ref in `refs`.
 *  Used to dismiss popovers/menus/dropdowns (filter panel, sort menu,
 *  notifications, user menu, card overflow menu) consistently. */
export function useClickOutside(refs: RefObject<HTMLElement | null>[], onOutside: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    function handler(e: PointerEvent) {
      const target = e.target as Node;
      const inside = refs.some((r) => r.current && r.current.contains(target));
      if (!inside) onOutside();
    }
    document.addEventListener('pointerdown', handler, true);
    return () => document.removeEventListener('pointerdown', handler, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onOutside]);
}
