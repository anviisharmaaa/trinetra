import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  /**
   * Sizing — pick ONE strategy per column:
   *  - `width`: a fixed, non-growing track (px or %). Use for content whose
   *    size never depends on viewport width (a thumbnail, an icon column).
   *  - `minWidth` + `flex`: a flexible `minmax(minWidth, flexfr)` track —
   *    the column never shrinks below `minWidth`, but grows to share any
   *    extra room proportionally to `flex`. This is the right choice for
   *    almost every text column (names, charges, titles, dates, badges):
   *    it guarantees a column can never be squeezed to unreadable
   *    word-per-line wrapping, while still using extra space when available
   *    instead of every column being forced equally wide.
   * If neither is given, the column defaults to `minmax(80px, 1fr)`.
   */
  width?: string;
  minWidth?: number;
  flex?: number;
  /** Right-align numeric/short columns (confidence %, counts). */
  align?: 'left' | 'right' | 'center';
  /** Cell never wraps and truncates with an ellipsis (+ native title tooltip carrying the full value) instead — for stable, single-line content like IDs/dates that only needs this as a last resort at extreme widths. */
  truncate?: boolean;
  /** Extra className applied to this column's cell (e.g. `"mono"`), for both header and body cells. */
  cellClassName?: string;
  /** Full value to show in the native title tooltip when `truncate` is set and `render` doesn't return a plain string. */
  titleValue?: (row: T) => string;
}

function trackFor<T>(col: Column<T>): string {
  if (col.width) return col.width;
  const min = col.minWidth ?? 80;
  const flex = col.flex ?? 1;
  return `minmax(${min}px, ${flex}fr)`;
}

/**
 * A CSS-Grid table primitive (not a native `<table>`): the header row and
 * every body row share the exact same `grid-template-columns` string built
 * from the same column definitions, so header/body alignment can never
 * drift. Columns are sized via `minmax(minWidth, flexFr)` so they can never
 * be crushed below a readable width — if the sum of a table's column
 * minimums genuinely exceeds the space available (a very narrow viewport),
 * the table itself scrolls horizontally *within its own container* rather
 * than wrapping every word onto its own line or overflowing the page.
 */
export function DataTable<T extends { id: string }>({
  columns, rows, selectedId, onRowClick, emptyLabel = 'NO RECORDS FOUND', emptyHint,
}: {
  columns: Column<T>[];
  rows: T[];
  selectedId?: string | null;
  onRowClick?: (row: T) => void;
  emptyLabel?: string;
  emptyHint?: string;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortDir, columns]);

  if (rows.length === 0) {
    return <EmptyState title={emptyLabel} hint={emptyHint} />;
  }

  const gridTemplateColumns = columns.map(trackFor).join(' ');

  function cellStyle(col: Column<T>): CSSProperties {
    return {
      textAlign: col.align ?? 'left',
      ...(col.truncate ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : undefined),
    };
  }

  function titleFor(col: Column<T>, row: T): string | undefined {
    if (!col.truncate) return undefined;
    if (col.titleValue) return col.titleValue(row);
    const rendered = col.render(row);
    return typeof rendered === 'string' || typeof rendered === 'number' ? String(rendered) : undefined;
  }

  return (
    <div className="gtable-container">
      <div className="gtable" role="table">
        <div className="gtable-row gtable-header" role="row" style={{ gridTemplateColumns }}>
          {columns.map((col) => (
            <div
              key={col.key}
              role="columnheader"
              className={`gtable-cell ${col.cellClassName ?? ''}`}
              style={cellStyle(col)}
              onClick={() => {
                if (!col.sortValue) return;
                if (sortKey === col.key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                else { setSortKey(col.key); setSortDir('asc'); }
              }}
            >
              {col.header}{sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
            </div>
          ))}
        </div>
        <div className="gtable-body" role="rowgroup">
          {sorted.map((row) => (
            <div
              key={row.id}
              role="row"
              className={`gtable-row gtable-body-row ${row.id === selectedId ? 'selected' : ''}`}
              style={{ gridTemplateColumns }}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <div key={col.key} role="cell" className={`gtable-cell ${col.cellClassName ?? ''}`} style={cellStyle(col)} title={titleFor(col, row)}>
                  {col.render(row)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
