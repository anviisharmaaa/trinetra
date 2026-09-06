import type { EntityType } from '../types';

export const ENTITY_COLORS: Record<EntityType, string> = {
  person: '#48d8ff',
  vehicle: '#d7ad58',
  phone: '#53d39c',
  social: '#a78bfa',
  organization: '#e45c68',
  location: '#48a0ff',
  device: '#8298a3',
  document: '#d7e5eb',
  account: '#f0b429',
  incident: '#ff4d5e',
};

export const ENTITY_LABELS: Record<EntityType, string> = {
  person: 'Person',
  vehicle: 'Vehicle',
  phone: 'Phone',
  social: 'Social Profile',
  organization: 'Organization',
  location: 'Location',
  device: 'Device',
  document: 'Document',
  account: 'Account',
  incident: 'Incident',
};

export const RISK_COLORS: Record<string, string> = {
  critical: '#ff4d5e',
  high: '#e45c68',
  medium: '#d7ad58',
  low: '#53d39c',
  unknown: '#50616a',
};

export function riskBadgeClass(risk?: string): string {
  switch (risk) {
    case 'critical':
    case 'high':
      return 'badge badge-high';
    case 'medium':
      return 'badge badge-medium';
    case 'low':
      return 'badge badge-low';
    default:
      return 'badge badge-neutral';
  }
}

export function statusDotClass(status?: string): string {
  return `status-dot ${status ?? 'unknown'}`;
}
