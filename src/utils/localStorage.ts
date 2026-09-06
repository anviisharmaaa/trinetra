// Only frontend UI concerns are persisted here. Never real credentials.
const PREFIX = 'trinetra.';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage unavailable — silently ignore, UI state just won't persist
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}

// Session-only variants (cleared when the browser tab closes) — used when the
// analyst does not check "keep me signed in" on the login screen.
export function loadSessionJSON<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveSessionJSON<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

export function removeSessionKey(key: string): void {
  try {
    sessionStorage.removeItem(PREFIX + key);
  } catch {
    /* noop */
  }
}
