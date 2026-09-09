import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Panel } from '../ui/Panel';
import { EmptyState } from '../ui/EmptyState';
import { titleCase } from '../../utils/formatters';
import type { PersonRecordRow } from '../../services/personService';

// Plumbing fields every domain table carries that aren't worth repeating in
// the expanded detail view (already implied by context, or FK noise).
const HIDDEN_FIELDS = new Set(['person_id']);

function fieldLabel(key: string): string {
  return titleCase(key);
}

function fieldValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

export interface RecordListPanelProps {
  title: string;
  icon?: ReactNode;
  records: PersonRecordRow[];
  /** Row-unique field used as the React key / expand-toggle id. */
  idField: string;
  /** Field(s) to build the compact row's primary label from, in priority order — first non-empty wins. */
  titleFields: string[];
  /** Additional fields joined with " · " as a secondary line under the title. */
  subtitleFields?: string[];
  /** A date-like field shown at the row's right edge. */
  dateField?: string;
  emptyHint?: string;
}

/**
 * Generic, data-driven panel for the ~18 Master Dataset sub-resource tables
 * (transactions, calls, cctv, criminal records, ...). Rather than hand-build
 * a bespoke layout per domain, every row renders a compact summary line
 * (built from a couple of chosen fields) that expands to every column
 * Postgres returned for that record — so Person View surfaces 100% of the
 * real data for every category without 18 one-off components to maintain.
 */
export function RecordListPanel({
  title, icon, records, idField, titleFields, subtitleFields = [], dateField, emptyHint,
}: RecordListPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const panelTitle = icon ? (
    <span className="row gap-2" style={{ alignItems: 'center' }}>
      {icon}
      <span className="section-title">{title} ({records.length})</span>
    </span>
  ) : (
    `${title} (${records.length})`
  );

  if (records.length === 0) {
    return (
      <Panel title={panelTitle}>
        <EmptyState title="No records" hint={emptyHint ?? `No ${title.toLowerCase()} on file for this person.`} />
      </Panel>
    );
  }

  function primaryLabel(row: PersonRecordRow): string {
    for (const f of titleFields) {
      if (row[f] !== null && row[f] !== undefined && row[f] !== '') return String(row[f]);
    }
    return String(row[idField] ?? 'Record');
  }
  function secondaryLabel(row: PersonRecordRow): string {
    return subtitleFields
      .map((f) => row[f])
      .filter((v) => v !== null && v !== undefined && v !== '')
      .join(' · ');
  }

  return (
    <Panel title={panelTitle} noPadding>
      <div className="stack" style={{ maxHeight: 340, overflowY: 'auto' }}>
        {records.map((row, i) => {
          const id = String(row[idField] ?? `${title}-${i}`);
          const isOpen = expandedId === id;
          const secondary = secondaryLabel(row);
          return (
            <div key={id} style={{ borderBottom: '1px solid var(--border)' }}>
              <button
                type="button"
                className="row gap-2"
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', color: 'inherit' }}
                onClick={() => setExpandedId(isOpen ? null : id)}
                aria-expanded={isOpen}
              >
                {isOpen ? <ChevronDown size={12} style={{ flexShrink: 0 }} /> : <ChevronRight size={12} style={{ flexShrink: 0 }} />}
                <div className="stack" style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {primaryLabel(row)}
                  </span>
                  {secondary && <span className="text-muted" style={{ fontSize: 11 }}>{secondary}</span>}
                </div>
                {dateField && row[dateField] != null && row[dateField] !== '' && (
                  <span className="text-muted mono" style={{ fontSize: 10.5, flexShrink: 0 }}>{String(row[dateField])}</span>
                )}
              </button>
              {isOpen && (
                <div className="stack gap-1" style={{ padding: '2px 12px 10px 30px' }}>
                  {Object.entries(row)
                    .filter(([k]) => !HIDDEN_FIELDS.has(k))
                    .map(([k, v]) => (
                      <div key={k} className="row" style={{ justifyContent: 'space-between', gap: 12, fontSize: 11 }}>
                        <span className="text-muted">{fieldLabel(k)}</span>
                        <span style={{ textAlign: 'right', overflowWrap: 'anywhere' }}>{fieldValue(v)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
