import type { Case } from '../types';

// Deterministic, presentation-only risk score derived from case metadata.
// Not persisted in mock data — computed on the fly so every case (including
// ones added later) automatically gets a plausible Risk Assessment tile
// without requiring a data-model migration.
function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const PRIORITY_BASE: Record<Case['priority'], number> = {
  critical: 88,
  high: 72,
  medium: 48,
  low: 22,
};

export interface RiskAssessment {
  score: number;
  label: 'CRITICAL RISK' | 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK';
  delta: number;
}

export function computeCaseRisk(activeCase: Case): RiskAssessment {
  const seed = hashSeed(activeCase.id);
  const base = PRIORITY_BASE[activeCase.priority];
  const jitter = (seed % 9) - 4; // -4..+4
  const statusAdj = activeCase.status === 'closed' ? -20 : activeCase.status === 'monitoring' ? -6 : 0;
  const score = Math.max(4, Math.min(98, base + jitter + statusAdj));
  const delta = ((seed >> 3) % 13) - 5; // -5..+7

  let label: RiskAssessment['label'] = 'LOW RISK';
  if (score >= 75) label = 'CRITICAL RISK';
  else if (score >= 55) label = 'HIGH RISK';
  else if (score >= 32) label = 'MEDIUM RISK';

  return { score, label, delta };
}
