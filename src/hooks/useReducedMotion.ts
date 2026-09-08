import { useEffect, useState } from 'react';

/** Tracks the `prefers-reduced-motion` media query live, so any component
 *  driving its own animation loop (e.g. the login globe) can react if the
 *  analyst changes the OS setting mid-session, not just at mount. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}
