import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { EntityPicker } from './EntityPicker';
import { useCaseStore } from '../../store/caseStore';
import { useSessionStore } from '../../store/sessionStore';
import { useUIStore } from '../../store/uiStore';
import type { CasePriority } from '../../types';

const PRIORITIES: CasePriority[] = ['high', 'medium', 'low'];

export function NewCaseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createCase = useCaseStore((s) => s.createCase);
  const user = useSessionStore((s) => s.user);
  const pushToast = useUIStore((s) => s.pushToast);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CasePriority>('medium');
  const [victimIds, setVictimIds] = useState<string[]>([]);
  const [suspectIds, setSuspectIds] = useState<string[]>([]);
  const [relatedIds, setRelatedIds] = useState<string[]>([]);

  function reset() {
    setName('');
    setDescription('');
    setPriority('medium');
    setVictimIds([]);
    setSuspectIds([]);
    setRelatedIds([]);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const created = createCase({
      name: name.trim(),
      description: description.trim() || 'No description provided yet.',
      priority,
      investigatorLead: user?.displayName ?? 'Unassigned',
      victimPersonIds: victimIds,
      suspectPersonIds: suspectIds,
      relatedEntityIds: relatedIds,
    });
    pushToast(`${created.code} created.`, 'success');
    reset();
    onClose();
    navigate(`/cases/${created.id}`);
  }

  return (
    <Modal open={open} onClose={handleClose} title="NEW CASE">
      <form className="stack gap-3" style={{ width: 480, maxWidth: '100%' }} onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="new-case-name">Case name</label>
          <input
            id="new-case-name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Operation Grey Harbour"
            autoFocus
            required
          />
        </div>
        <div className="field">
          <label htmlFor="new-case-desc">Description</label>
          <textarea
            id="new-case-desc"
            className="input"
            style={{ minHeight: 72, resize: 'vertical', fontFamily: 'inherit' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short summary of what this case is investigating…"
          />
        </div>
        <div className="field">
          <label>Priority</label>
          <div className="row gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                className={`dash-priority-pill tone-${p === 'high' ? 'high' : p === 'medium' ? 'medium' : 'low'} ${priority === p ? 'is-selected' : ''}`}
                style={{ cursor: 'pointer', border: priority === p ? '1px solid currentColor' : undefined }}
                onClick={() => setPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="case-entities-section">
          <div className="system-label" style={{ marginBottom: 8 }}>Case Entities</div>

          <div className="field">
            <label>Victim</label>
            <EntityPicker
              selectedIds={victimIds}
              onChange={setVictimIds}
              types={['person']}
              multiple={false}
              addLabel="Add Victim"
              placeholder="Search victim by name or Person ID…"
            />
          </div>

          <div className="field">
            <label>Suspects</label>
            <EntityPicker
              selectedIds={suspectIds}
              onChange={setSuspectIds}
              types={['person']}
              multiple
              addLabel="Add Suspect"
              placeholder="Search suspect by name or Person ID…"
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>Other Related People / Entities</label>
            <EntityPicker
              selectedIds={relatedIds}
              onChange={setRelatedIds}
              multiple
              addLabel="Add Entity"
              placeholder="Search by name or ID…"
            />
          </div>
        </div>

        <div className="row gap-2" style={{ justifyContent: 'flex-end', marginTop: 6 }}>
          <button type="button" className="btn btn-ghost" onClick={handleClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={!name.trim()}>Create Case</button>
        </div>
      </form>
    </Modal>
  );
}
