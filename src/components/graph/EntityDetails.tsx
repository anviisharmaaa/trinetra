import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Building2, Clock, FolderLock, MapPin, User } from 'lucide-react';
import type { Entity, Evidence, Relationship, TimelineEvent } from '../../types';
import { entityService } from '../../services/entityService';
import { timelineService } from '../../services/timelineService';
import { evidenceService } from '../../services/evidenceService';
import { riskBadgeClass, ENTITY_LABELS } from '../../utils/entityMeta';
import { PersonAvatar, LocationThumb } from '../ui/EntityImage';
import { personImage, locationImage } from '../../config/imageAssets';
import { formatRelativeTime } from '../../utils/formatters';
import { LoadingState } from '../ui/LoadingState';

/**
 * The persistent right-hand panel for Network Analysis. Always reflects
 * whichever entity is centered/selected — the analyst never has to leave
 * the graph to read a subject's profile, connections, recent activity, or
 * the evidence that names them.
 */
export function EntityDetails({ entity, onSelectEntity }: { entity: Entity; onSelectEntity: (id: string) => void }) {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [related, setRelated] = useState<{ entity: Entity; relationship: Relationship }[] | null>(null);
  const [activity, setActivity] = useState<TimelineEvent[] | null>(null);
  const [evidence, setEvidence] = useState<Evidence[] | null>(null);

  useEffect(() => {
    setRelated(null);
    setActivity(null);
    setEvidence(null);
    entityService.getRelatedEntities(entity.id).then(setRelated);
    if (caseId) {
      timelineService.listByCase(caseId, { entityId: entity.id }).then((evs) => {
        setActivity([...evs].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 4));
      });
      evidenceService.listByCase(caseId).then((all) => {
        setEvidence(all.filter((e) => e.entityIds.includes(entity.id)).slice(0, 4));
      });
    }
  }, [entity.id, caseId]);

  const risk = (entity as { riskLevel?: string }).riskLevel;
  const grouped = related?.reduce<Record<string, number>>((acc, r) => {
    acc[r.entity.type] = (acc[r.entity.type] ?? 0) + 1;
    return acc;
  }, {});
  // An entity can be linked to the center by more than one relationship
  // (e.g. both "associated" and "called") — collapse those down to one row
  // per entity (keeping the strongest link) so DIRECT LINKS never shows the
  // same name twice.
  const directLinks = related?.reduce<{ entity: Entity; relationship: Relationship }[]>((acc, r) => {
    const existing = acc.find((x) => x.entity.id === r.entity.id);
    if (!existing) acc.push(r);
    else if (r.relationship.strength > existing.relationship.strength) Object.assign(existing, r);
    return acc;
  }, []);

  return (
    <div className="stack gap-3">
      <div className="row gap-2">
        {entity.type === 'location' ? (
          <LocationThumb
            locationId={entity.id}
            name={entity.name}
            category={(entity as { metadata: { category?: string } }).metadata.category}
            src={locationImage(entity.id, entity.name)}
            style={{ width: 44, height: 44 }}
          />
        ) : entity.type === 'person' ? (
          <PersonAvatar personId={entity.id} name={entity.name} src={personImage(entity.id, entity.name)} size={44} />
        ) : (
          <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--cyan-glow)', border: '1px solid var(--cyan-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {entity.type === 'organization' ? <Building2 size={18} color="var(--cyan)" /> : <User size={18} color="var(--cyan)" />}
          </div>
        )}
        <div className="stack" style={{ minWidth: 0 }}>
          <span className="system-label">{ENTITY_LABELS[entity.type]}</span>
          <span style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entity.name}</span>
        </div>
      </div>

      <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
        {risk && <span className={riskBadgeClass(risk)}>{risk} RISK</span>}
        {entity.confidence !== undefined && <span className="badge badge-info">{Math.round(entity.confidence * 100)}% CONFIDENCE</span>}
      </div>

      <div className="text-muted mono" style={{ fontSize: 11 }}>{entity.id}</div>

      <div>
        <div className="system-label" style={{ marginBottom: 6 }}>CONNECTIONS ({related?.length ?? '…'})</div>
        {related === null ? (
          <LoadingState label="LOADING" />
        ) : grouped && Object.keys(grouped).length > 0 ? (
          <div className="stack gap-1">
            {Object.entries(grouped).map(([type, count]) => (
              <div key={type} className="row" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
                <span>{ENTITY_LABELS[type as keyof typeof ENTITY_LABELS]}</span>
                <span className="text-cyan mono">{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-muted" style={{ fontSize: 12 }}>No connections found.</span>
        )}
      </div>

      {directLinks && directLinks.length > 0 && (
        <div>
          <div className="system-label" style={{ marginBottom: 6 }}>DIRECT LINKS</div>
          <div className="stack gap-1">
            {directLinks.slice(0, 6).map((r) => (
              <button
                key={r.entity.id}
                type="button"
                className="row gap-2"
                style={{ background: 'none', border: 'none', color: 'inherit', textAlign: 'left', cursor: 'pointer', padding: '4px 0', fontSize: 12 }}
                onClick={() => onSelectEntity(r.entity.id)}
              >
                <ArrowRight size={11} color="var(--text-muted)" />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.entity.name}</span>
                <span className="text-muted" style={{ fontSize: 10 }}>{r.relationship.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="row gap-1 system-label" style={{ marginBottom: 6 }}><Clock size={11} /> RECENT ACTIVITY</div>
        {activity === null ? <LoadingState label="LOADING" /> : activity.length === 0 ? (
          <span className="text-muted" style={{ fontSize: 12 }}>No recorded activity.</span>
        ) : (
          <div className="stack gap-2">
            {activity.map((ev) => (
              <button
                key={ev.id}
                type="button"
                className="stack"
                style={{ borderLeft: '2px solid var(--border-active)', paddingLeft: 8, background: 'none', textAlign: 'left', cursor: 'pointer', color: 'inherit' }}
                onClick={() => navigate(`/cases/${caseId}/timeline`)}
              >
                <span style={{ fontSize: 12 }}>{ev.title}</span>
                <span className="text-muted mono" style={{ fontSize: 10 }}>{formatRelativeTime(ev.timestamp)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="row gap-1 system-label" style={{ marginBottom: 6 }}><FolderLock size={11} /> RELATED EVIDENCE</div>
        {evidence === null ? <LoadingState label="LOADING" /> : evidence.length === 0 ? (
          <span className="text-muted" style={{ fontSize: 12 }}>No linked evidence.</span>
        ) : (
          <div className="stack gap-2">
            {evidence.map((e) => (
              <button
                key={e.id}
                type="button"
                className="row gap-2"
                style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: 0, color: 'inherit' }}
                onClick={() => navigate(`/cases/${caseId}/evidence`)}
              >
                <span style={{ flex: 1, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</span>
                <span className="text-muted mono" style={{ fontSize: 9.5 }}>{e.type.toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="row gap-2" style={{ marginTop: 4 }}>
        {entity.type === 'person' && (
          <button className="btn btn-primary btn-sm" type="button" onClick={() => navigate(`/cases/${caseId}/person/${entity.id}`)}>VIEW PROFILE</button>
        )}
        {entity.type === 'location' && (
          <button className="btn btn-primary btn-sm" type="button" onClick={() => navigate(`/cases/${caseId}/location`)}><MapPin size={12} /> VIEW ON MAP</button>
        )}
      </div>
    </div>
  );
}
