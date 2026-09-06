import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AtSign, Users, Activity } from 'lucide-react';
import { socialMediaService } from '../services/socialMediaService';
import { Panel } from '../components/ui/Panel';
import { SearchInput } from '../components/ui/SearchInput';
import { LoadingState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/EmptyState';
import { useInvestigationStore } from '../store/investigationStore';
import { getEntityById } from '../data';
import type { SocialProfile, SocialConnection, SocialActivity } from '../types';
import { formatRelativeTime } from '../utils/formatters';
import { PersonAvatar } from '../components/ui/EntityImage';
import { personImage } from '../config/imageAssets';

export function SocialMediaPage() {
  const { caseId } = useParams();
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId);
  const [profiles, setProfiles] = useState<SocialProfile[] | null>(null);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<SocialProfile | null>(null);
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [activity, setActivity] = useState<SocialActivity[]>([]);

  useEffect(() => {
    if (!caseId) return;
    setProfiles(null);
    setSelected(null);
    socialMediaService.listByCase(caseId).then((all) => {
      setProfiles(all);
      const forEntity = selectedEntityId ? all.find((p) => p.entityId === selectedEntityId) : undefined;
      setSelected(forEntity ?? all[0] ?? null);
    });
  }, [caseId, selectedEntityId]);

  useEffect(() => {
    if (!selected) return;
    socialMediaService.getConnections(selected.id).then(setConnections);
    socialMediaService.getActivity(selected.id).then(setActivity);
  }, [selected]);

  const filtered = profiles?.filter((p) => !query || p.displayName.toLowerCase().includes(query.toLowerCase()) || p.handle.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="split-3">
      <div className="stack" style={{ padding: 10 }}>
        <SearchInput value={query} onChange={setQuery} placeholder="Search profiles…" />
        <div className="stack gap-1" style={{ marginTop: 10 }}>
          {profiles === null && <LoadingState label="LOADING PROFILES" />}
          {filtered?.map((p) => {
            const owner = p.entityId ? getEntityById(p.entityId) : undefined;
            return (
              <button
                key={p.id}
                type="button"
                className="row gap-2"
                style={{ background: selected?.id === p.id ? 'var(--cyan-glow)' : 'none', border: '1px solid ' + (selected?.id === p.id ? 'var(--cyan-dim)' : 'transparent'), borderRadius: 4, padding: 8, cursor: 'pointer', color: 'inherit', textAlign: 'left' }}
                onClick={() => setSelected(p)}
              >
                {owner ? (
                  <PersonAvatar personId={owner.id} name={owner.name} src={personImage(owner.id, owner.name)} size={24} />
                ) : (
                  <AtSign size={14} color="var(--cyan)" />
                )}
                <div className="stack" style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.displayName}</span>
                  <span className="text-muted" style={{ fontSize: 10.5 }}>{p.platform} · {p.handle}{owner ? ` · ${owner.name}` : ''}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="scroll-region" style={{ padding: 16 }}>
        {!selected && <EmptyState title="NO PROFILE SELECTED" hint="Select a social profile to view details." />}
        {selected && (
          <div className="stack gap-3">
            <Panel title="PROFILE OVERVIEW">
              {(() => {
                const owner = selected.entityId ? getEntityById(selected.entityId) : undefined;
                return (
                  <div className="row gap-3" style={{ alignItems: 'center', marginBottom: 12 }}>
                    {owner ? (
                      <PersonAvatar personId={owner.id} name={owner.name} src={personImage(owner.id, owner.name)} size={44} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--cyan-glow)', border: '1px solid var(--cyan-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <AtSign size={18} color="var(--cyan)" />
                      </div>
                    )}
                    <div className="stack" style={{ gap: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{selected.displayName}</span>
                      <span className="text-muted" style={{ fontSize: 11 }}>{selected.platform} · {selected.handle}</span>
                    </div>
                  </div>
                );
              })()}
              <div className="row gap-4" style={{ marginBottom: 10 }}>
                <div className="stack"><span className="value-large">{selected.followers}</span><span className="system-label">Followers</span></div>
                <div className="stack"><span className="value-large">{selected.following}</span><span className="system-label">Following</span></div>
                <div className="stack"><span className="value-large">{Math.round((selected.riskScore ?? 0) * 100)}%</span><span className="system-label">Risk Score</span></div>
              </div>
              {selected.bio && <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{selected.bio}</p>}
              <div className="text-muted" style={{ fontSize: 11 }}>Last active {formatRelativeTime(selected.lastActive)}</div>
            </Panel>
            <Panel title="ACTIVITY TIMELINE" actions={<Activity size={13} color="var(--text-muted)" />}>
              {activity.length === 0 ? <span className="text-muted" style={{ fontSize: 12 }}>No recent activity.</span> : (
                <div className="stack gap-2">
                  {activity.map((a) => (
                    <div key={a.id} className="stack" style={{ borderLeft: '2px solid var(--border-active)', paddingLeft: 8 }}>
                      <span style={{ fontSize: 12 }}>{a.content}</span>
                      <span className="text-muted mono" style={{ fontSize: 10 }}>{formatRelativeTime(a.timestamp)} · {a.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </div>
        )}
      </div>

      <div className="stack" style={{ padding: 12 }}>
        <div className="system-label" style={{ marginBottom: 8 }}><Users size={12} style={{ verticalAlign: -2 }} /> CONNECTIONS</div>
        {connections.length === 0 && <span className="text-muted" style={{ fontSize: 12 }}>No linked profiles.</span>}
        <div className="stack gap-2">
          {connections.map((c) => (
            <div key={c.id} className="panel" style={{ padding: 8 }}>
              <div className="row" style={{ justifyContent: 'space-between', fontSize: 12 }}>
                <span>{c.type.replace('_', ' ')}</span>
                <span className="text-cyan">{Math.round(c.strength * 100)}%</span>
              </div>
              <div className="text-muted" style={{ fontSize: 10.5 }}>{c.interactionCount} interactions</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
