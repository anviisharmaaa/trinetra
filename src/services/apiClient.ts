// Thin fetch wrapper for the real TRINETRA backend API (server/index.js),
// which serves the ingested Master Dataset from PostgreSQL. Every call here
// is scoped/paginated on the server — the 100k-person dataset is never
// pulled into the browser in bulk.
const API_BASE: string =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_BASE_URL || 'http://localhost:4000';

export class ApiUnavailableError extends Error {}

export async function apiGet<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`);
  } catch (err) {
    throw new ApiUnavailableError(`TRINETRA API unreachable at ${API_BASE}: ${(err as Error).message}`);
  }
  if (res.status === 404) {
    throw new NotFoundError(path);
  }
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export class NotFoundError extends Error {}
