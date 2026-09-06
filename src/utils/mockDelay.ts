// Simulated network latency for the mock backend layer.
// Never resolve mock data instantly — a real analytical backend has cost.

export function mockDelay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface StagedStep {
  label: string;
  atMs: number;
}

/**
 * Runs a sequence of staged status updates (e.g. "SEARCHING SOURCES...",
 * "IDENTITY DATABASE...") while a mock operation resolves, calling `onStep`
 * for each stage. Mirrors the analysis pipeline UX described in the spec.
 */
export async function runStagedOperation(
  steps: StagedStep[],
  onStep?: (label: string, index: number, total: number) => void,
): Promise<void> {
  let elapsed = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    await mockDelay(step.atMs - elapsed);
    elapsed = step.atMs;
    onStep?.(step.label, i, steps.length);
  }
}

export const DEFAULT_ANALYSIS_STEPS: StagedStep[] = [
  { label: 'SEARCHING SOURCES...', atMs: 0 },
  { label: 'IDENTITY DATABASE...', atMs: 400 },
  { label: 'SOCIAL DATA...', atMs: 800 },
  { label: 'LOCATION RECORDS...', atMs: 1200 },
  { label: 'RELATIONSHIP GRAPH...', atMs: 1600 },
  { label: 'ANALYSIS COMPLETE', atMs: 2000 },
];
