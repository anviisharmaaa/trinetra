import type { PersonEntity } from '../../types';
import { riskBadgeClass } from '../../utils/entityMeta';
import { PersonAvatar } from '../ui/EntityImage';
import { personImage } from '../../config/imageAssets';

export function PersonHeader({ person }: { person: PersonEntity }) {
  return (
    <div className="row gap-3" style={{ borderBottom: '1px solid var(--border)', padding: '16px 20px', background: 'var(--bg-1)' }}>
      <PersonAvatar personId={person.id} name={person.name} src={personImage(person.id, person.name)} size={72} square />
      <div className="stack" style={{ flex: 1, minWidth: 0 }}>
        <div className="row gap-2">
          <span style={{ fontSize: 19, fontWeight: 700 }}>{person.name}</span>
          <span className={riskBadgeClass(person.riskLevel)}>{person.riskLevel ?? 'unknown'} RISK</span>
          {person.label && <span className="badge badge-info">{person.label}</span>}
        </div>
        <div className="row gap-3 text-secondary" style={{ fontSize: 12 }}>
          <span className="mono">{person.id}</span>
          {person.metadata.occupation && <span>{person.metadata.occupation}</span>}
          {person.metadata.identityConfidence !== undefined && (
            <span>Identity confidence: <strong className="text-cyan">{Math.round(person.metadata.identityConfidence * 100)}%</strong></span>
          )}
        </div>
        {person.metadata.aliases && person.metadata.aliases.length > 0 && (
          <div className="text-muted" style={{ fontSize: 11.5 }}>AKA: {person.metadata.aliases.join(', ')}</div>
        )}
      </div>
    </div>
  );
}
