import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bell, Check } from 'lucide-react';
import { useEvidenceStore } from '../store/evidenceStore';
import { useInvestigationStore } from '../store/investigationStore';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { getEntityById } from '../data';
import type { Alert } from '../types';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';

const SEVERITY_BADGE: Record<Alert['severity'], string> = {
  critical: 'badge-high', high: 'badge-high', medium: 'badge-medium', low: 'badge-low',
};

export function AlertsPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { status, alerts, loadCase, acknowledgeAlert } = useEvidenceStore();
  const selectEntity = useInvestigationStore((s) => s.selectEntity);
  const [filter, setFilter] = useState<'all' | 'unacknowledged'>('all');

  useEffect(() => { if (caseId) loadCase(caseId); }, [caseId, loadCase]);

  if (status === 'loading' || status === 'idle') return <LoadingState label="SYNCING ALERT FEED" />;
  if (status === 'error') return <ErrorState title="ALERT FEED UNAVAILABLE" message="Unable to load alerts for this case." onRetry={() => caseId && loadCase(caseId)} />;

  const visible = filter === 'all' ? alerts : alerts.filter((a) => !a.acknowledged);

  return (
    <div className="stack" style={{ padding: 16, height: '100%' }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="row gap-2">
          <button type="button" className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>ALL ({alerts.length})</button>
          <button type="button" className={`tab ${filter === 'unacknowledged' ? 'active' : ''}`} onClick={() => setFilter('unacknowledged')}>
            UNACKNOWLEDGED ({alerts.filter((a) => !a.acknowledged).length})
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={<Bell size={28} />} title="No alerts to show" hint="All clear — no alerts match the current filter." />
      ) : (
        <div className="scroll-region stack gap-2">
          {visible.map((a) => (
            <div key={a.id} className="panel" style={{ padding: 14, opacity: a.acknowledged ? 0.6 : 1 }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="row gap-2">
                  <span className={`badge ${SEVERITY_BADGE[a.severity]}`}>{a.severity.toUpperCase()}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</span>
                </div>
                <span className="text-muted mono" style={{ fontSize: 10.5 }}>{formatRelativeTime(a.timestamp)}</span>
              </div>
              <div className="text-secondary" style={{ fontSize: 12, margin: '6px 0' }}>{a.description}</div>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                  {a.entityIds.map((id) => {
                    const ent = getEntityById(id);
                    return (
                      <button
                        key={id}
                        type="button"
                        className="badge badge-info"
                        style={{ border: 'none', cursor: 'pointer' }}
                        onClick={() => { selectEntity(id); if (ent?.type === 'person') navigate(`/cases/${caseId}/person/${id}`); }}
                      >
                        {ent?.name ?? id}
                      </button>
                    );
                  })}
                  <span className="text-muted mono" style={{ fontSize: 10 }}>SOURCE: {a.source} · {formatDateTime(a.timestamp)}</span>
                </div>
                {!a.acknowledged && (
                  <button type="button" className="btn btn-sm" onClick={() => acknowledgeAlert(a.id)}>
                    <Check size={12} style={{ marginRight: 4, verticalAlign: -2 }} />ACKNOWLEDGE
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
