import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, ListTree, EyeOff, Crosshair, MapPin, Clock } from 'lucide-react';
import { useGraphStore } from '../../store/graphStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { getEntityById } from '../../data';

export function GraphContextMenu({ x, y, nodeId, onClose }: { x: number; y: number; nodeId: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { caseId } = useParams();
  const expandEntity = useGraphStore((s) => s.expandEntity);
  const hideEntity = useGraphStore((s) => s.hideEntity);
  const selectEntity = useInvestigationStore((s) => s.selectEntity);
  const selectLocation = useInvestigationStore((s) => s.selectLocation);
  const entity = getEntityById(nodeId);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [onClose]);

  const locationId = entity && entity.type !== 'location'
    ? (entity.metadata as { locationIds?: string[] }).locationIds?.[0]
    : entity?.id;

  const items = [
    { icon: <Eye size={13} />, label: 'VIEW DETAILS', onClick: () => selectEntity(nodeId) },
    { icon: <ListTree size={13} />, label: 'EXPAND CONNECTIONS', onClick: () => expandEntity(nodeId) },
    { icon: <EyeOff size={13} />, label: 'HIDE ENTITY', onClick: () => hideEntity(nodeId) },
    { icon: <Crosshair size={13} />, label: 'FOCUS NETWORK', onClick: () => selectEntity(nodeId) },
    ...(locationId ? [{ icon: <MapPin size={13} />, label: 'SHOW ON MAP', onClick: () => { selectLocation(locationId); navigate(`/cases/${caseId}/location`); } }] : []),
    { icon: <Clock size={13} />, label: 'VIEW TIMELINE', onClick: () => { selectEntity(nodeId); navigate(`/cases/${caseId}/timeline`); } },
  ];

  return (
    <div
      ref={ref}
      className="panel fade-in"
      style={{ position: 'absolute', left: x, top: y, zIndex: 30, minWidth: 190, padding: 4 }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className="row gap-2"
          style={{ width: '100%', background: 'none', border: 'none', padding: '7px 10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 11.5, fontWeight: 600 }}
          onClick={() => { item.onClick(); onClose(); }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
        >
          {item.icon}{item.label}
        </button>
      ))}
    </div>
  );
}
