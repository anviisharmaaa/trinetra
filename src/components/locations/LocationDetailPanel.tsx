import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera as CameraIcon, MapPin } from 'lucide-react';
import type { Camera, Entity, LocationEntity, Relationship } from '../../types';
import { entityService } from '../../services/entityService';
import { useInvestigationStore } from '../../store/investigationStore';
import { LocationThumb, FramePlaceholder } from '../ui/EntityImage';
import { locationImage, cctvFrameImage } from '../../config/imageAssets';
import { riskBadgeClass, ENTITY_LABELS } from '../../utils/entityMeta';
import { Tabs } from '../ui/Tabs';
import { LoadingState } from '../ui/LoadingState';
import { formatDateTime, formatRelativeTime, titleCase } from '../../utils/formatters';
import { categoryLabel, type LocationStats } from './locationMeta';

const TABS = [
  { key: 'overview', label: 'OVERVIEW' },
  { key: 'activity', label: 'ACTIVITY' },
  { key: 'cctv', label: 'CCTV' },
  { key: 'related', label: 'RELATED' },
  { key: 'intelligence', label: 'INTELLIGENCE' },
];

export function LocationDetailPanel({ location, stats, nearbyCameras }: { location: LocationEntity; stats: LocationStats; nearbyCameras: Camera[] }) {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const { selectCamera } = useInvestigationStore();
  const [tab, setTab] = useState('overview');
  const [related, setRelated] = useState<{ entity: Entity; relationship: Relationship }[] | null>(null);

  useEffect(() => {
    setRelated(null);
    setTab('overview');
    entityService.getRelatedEntities(location.id).then(setRelated);
  }, [location.id]);

  const eventsByType = stats.events.reduce<Record<string, number>>((acc, e) => {
    acc[e.eventType] = (acc[e.eventType] ?? 0) + 1;
    return acc;
  }, {});
  const maxTypeCount = Math.max(1, ...Object.values(eventsByType));

  return (
    <div className="stack gap-3">
      <div className="row gap-2">
        <LocationThumb
          locationId={location.id}
          name={location.name}
          category={location.metadata.category}
          src={locationImage(location.id, location.name)}
          style={{ width: 56, height: 56 }}
        />
        <div className="stack" style={{ minWidth: 0, gap: 2 }}>
          <span className="system-label">{categoryLabel(location.metadata.category)}</span>
          <span style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location.name}</span>
          <span className="text-muted" style={{ fontSize: 11 }}>{location.metadata.city}</span>
        </div>
      </div>

      <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
        <span className={riskBadgeClass(stats.computedRisk)}>{stats.computedRisk.toUpperCase()} RISK</span>
        <span className="badge badge-info">{stats.eventCount} EVENT{stats.eventCount === 1 ? '' : 'S'}</span>
      </div>

      <div className="stack gap-1" style={{ fontSize: 12 }}>
        <span className="text-secondary">{location.metadata.address}</span>
        <span className="text-muted mono" style={{ fontSize: 10.5 }}>
          {location.metadata.coordinates.lat.toFixed(4)}, {location.metadata.coordinates.lng.toFixed(4)}
        </span>
      </div>

      <div className="row gap-3" style={{ fontSize: 11 }}>
        <div className="stack" style={{ gap: 1 }}>
          <span className="text-muted mono" style={{ fontSize: 9.5 }}>FIRST SEEN</span>
          <span>{stats.firstSeen ? formatDateTime(stats.firstSeen) : '—'}</span>
        </div>
        <div className="stack" style={{ gap: 1 }}>
          <span className="text-muted mono" style={{ fontSize: 9.5 }}>LAST ACTIVITY</span>
          <span>{stats.lastActivity ? formatRelativeTime(stats.lastActivity) : '—'}</span>
        </div>
        <div className="stack" style={{ gap: 1 }}>
          <span className="text-muted mono" style={{ fontSize: 9.5 }}>RELATED ENTITIES</span>
          <span>{related?.length ?? '…'}</span>
        </div>
      </div>

      <Tabs items={TABS} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="stack gap-2" style={{ fontSize: 12.5 }}>
          <span className="text-secondary">
            {location.name} is a {categoryLabel(location.metadata.category).toLowerCase()} location with {stats.eventCount} recorded
            event{stats.eventCount === 1 ? '' : 's'}, {nearbyCameras.length} nearby camera{nearbyCameras.length === 1 ? '' : 's'}, and{' '}
            {related?.length ?? 0} linked entit{related?.length === 1 ? 'y' : 'ies'}.
          </span>
          <button className="btn btn-primary btn-sm" type="button" style={{ alignSelf: 'flex-start' }} onClick={() => navigate(`/cases/${caseId}/network`)}>
            <MapPin size={12} /> VIEW IN NETWORK
          </button>
        </div>
      )}

      {tab === 'activity' && (
        stats.events.length === 0 ? <span className="text-muted" style={{ fontSize: 12 }}>No recorded events at this location.</span> : (
          <div className="stack gap-2">
            {[...stats.events].reverse().map((ev) => (
              <div key={ev.id} className="stack" style={{ borderLeft: '2px solid var(--border-active)', paddingLeft: 8, gap: 1 }}>
                <span style={{ fontSize: 12 }}>{ev.title}</span>
                <span className="text-muted mono" style={{ fontSize: 10 }}>{formatDateTime(ev.timestamp)} · {titleCase(ev.eventType)}</span>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'cctv' && (
        nearbyCameras.length === 0 ? <span className="text-muted" style={{ fontSize: 12 }}>No cameras registered here.</span> : (
          <div className="stack gap-2">
            {nearbyCameras.map((c) => (
              <button
                key={c.id}
                type="button"
                className="row gap-2"
                style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: 6, cursor: 'pointer', color: 'inherit', textAlign: 'left' }}
                onClick={() => { selectCamera(c.id); navigate(`/cases/${caseId}/cctv?camera=${c.id}`); }}
              >
                <div style={{ width: 44, height: 32, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                  <FramePlaceholder src={cctvFrameImage(c.id)} label={c.code} compact />
                </div>
                <span className="stack" style={{ minWidth: 0, gap: 1, flex: 1 }}>
                  <span style={{ fontSize: 12 }}>{c.code}</span>
                  <span className="text-muted" style={{ fontSize: 10 }}>{c.coverage}</span>
                </span>
                <span className={`status-dot ${c.status}`} />
              </button>
            ))}
          </div>
        )
      )}

      {tab === 'related' && (
        related === null ? <LoadingState label="LOADING" /> : related.length === 0 ? (
          <span className="text-muted" style={{ fontSize: 12 }}>No related entities found.</span>
        ) : (
          <div className="stack gap-1">
            {related.map((r) => (
              <div key={r.entity.id} className="row gap-2" style={{ justifyContent: 'space-between', fontSize: 12, padding: '4px 0' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.entity.name}</span>
                <span className="text-muted" style={{ fontSize: 10, flexShrink: 0 }}>{ENTITY_LABELS[r.entity.type]}</span>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'intelligence' && (
        <div className="stack gap-3">
          <div>
            <div className="system-label" style={{ marginBottom: 6 }}>RISK ASSESSMENT</div>
            <span className="text-secondary" style={{ fontSize: 12 }}>
              Flagged <strong>{stats.computedRisk.toUpperCase()}</strong> based
              on location category ({categoryLabel(location.metadata.category).toLowerCase()}) and {stats.eventCount} recorded event{stats.eventCount === 1 ? '' : 's'}
              {stats.events.some((e) => e.importance === 'high') ? ', including high-importance activity' : ''}.
            </span>
          </div>
          <div>
            <div className="system-label" style={{ marginBottom: 6 }}><CameraIcon size={11} /> EVENT TYPE BREAKDOWN</div>
            {Object.keys(eventsByType).length === 0 ? (
              <span className="text-muted" style={{ fontSize: 12 }}>No events to analyze.</span>
            ) : (
              <div className="stack gap-1">
                {Object.entries(eventsByType).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                  <div key={type} className="row gap-2" style={{ alignItems: 'center' }}>
                    <span style={{ fontSize: 11, width: 72, flexShrink: 0 }}>{titleCase(type)}</span>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-0)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${(count / maxTypeCount) * 100}%`, height: '100%', background: 'var(--cyan)' }} />
                    </div>
                    <span className="text-muted mono" style={{ fontSize: 10, width: 16, textAlign: 'right' }}>{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
