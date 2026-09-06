import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { documentService } from '../services/documentService';
import { LoadingState } from '../components/ui/LoadingState';
import type { DocumentEntity, OcrEntity } from '../types';
import { useInvestigationStore } from '../store/investigationStore';
import { EntityImage } from '../components/ui/EntityImage';
import { documentImage } from '../config/imageAssets';

function DocumentThumb({ doc }: { doc: DocumentEntity }) {
  return (
    <EntityImage
      src={documentImage(doc.id, doc.metadata.fileName)}
      alt={doc.metadata.fileName}
      style={{ width: 24, height: 32, borderRadius: 2, flexShrink: 0 }}
      fallback={
        <div style={{ width: 24, height: 32, borderRadius: 2, flexShrink: 0, background: 'var(--bg-1)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={12} color="var(--cyan)" />
        </div>
      }
    />
  );
}

export function DocumentsPage() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const selectEntity = useInvestigationStore((s) => s.selectEntity);
  const [documents, setDocuments] = useState<DocumentEntity[] | null>(null);
  const [active, setActive] = useState<DocumentEntity | null>(null);
  const [ocr, setOcr] = useState<OcrEntity[]>([]);
  const [hoveredOcr, setHoveredOcr] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    documentService.listByCase(caseId).then((docs) => {
      setDocuments(docs);
      setActive(docs[0] ?? null);
    });
  }, [caseId]);

  useEffect(() => {
    if (!active) return;
    documentService.getOcrEntities(active.id).then(setOcr);
  }, [active]);

  if (documents === null) return <LoadingState label="INDEXING DOCUMENTS" />;

  return (
    <div className="split-3">
      <div className="stack" style={{ padding: 10 }}>
        <div className="system-label" style={{ marginBottom: 8 }}>DOCUMENTS</div>
        <div className="stack gap-1">
          {documents.map((d) => (
            <button
              key={d.id}
              type="button"
              className="row gap-2"
              style={{ background: active?.id === d.id ? 'var(--cyan-glow)' : 'none', border: '1px solid ' + (active?.id === d.id ? 'var(--cyan-dim)' : 'transparent'), borderRadius: 4, padding: 8, cursor: 'pointer', color: 'inherit', textAlign: 'left' }}
              onClick={() => setActive(d)}
            >
              <DocumentThumb doc={d} />
              <div className="stack" style={{ minWidth: 0 }}>
                <span style={{ fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.metadata.fileName}</span>
                <span className="text-muted" style={{ fontSize: 10 }}>{d.metadata.fileType} · {d.metadata.pages}p</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 12, minWidth: 0 }}>
        {!active ? <span className="text-muted" style={{ fontSize: 12 }}>Select a document.</span> : (
          <div style={{ position: 'relative', height: '100%', background: '#0d1520', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div className="row" style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', justifyContent: 'space-between' }}>
              <span className="mono" style={{ fontSize: 11 }}>{active.metadata.fileName}</span>
              <span className="text-muted" style={{ fontSize: 10.5 }}>PAGE 1 / {active.metadata.pages}</span>
            </div>
            <div style={{ position: 'relative', margin: 20, height: 'calc(100% - 80px)', background: '#111a26', border: '1px dashed var(--border)' }}>
              {ocr.filter((o) => o.page === 1).map((o) => (
                <div
                  key={o.id}
                  onMouseEnter={() => setHoveredOcr(o.id)}
                  onMouseLeave={() => setHoveredOcr(null)}
                  style={{
                    position: 'absolute', left: `${o.boundingBox.x * 100}%`, top: `${o.boundingBox.y * 100}%`,
                    width: `${o.boundingBox.width * 100}%`, height: `${o.boundingBox.height * 100}%`,
                    background: hoveredOcr === o.id ? 'rgba(72,216,255,0.25)' : 'rgba(72,216,255,0.12)',
                    border: '1px solid var(--cyan-dim)', cursor: 'pointer',
                  }}
                  title={o.text}
                />
              ))}
              <span className="text-muted" style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 9.5 }}>SIMULATED DOCUMENT RENDER — OCR REGIONS HIGHLIGHTED</span>
            </div>
          </div>
        )}
      </div>

      <div className="scroll-region" style={{ padding: 12 }}>
        <div className="system-label" style={{ marginBottom: 8 }}>EXTRACTED ENTITIES</div>
        <div className="stack gap-1">
          {ocr.map((o) => (
            <button
              key={o.id}
              type="button"
              className="row"
              style={{ justifyContent: 'space-between', background: hoveredOcr === o.id ? 'var(--panel-hover)' : 'none', border: 'none', padding: '6px 4px', cursor: o.linkedEntityId ? 'pointer' : 'default', color: 'inherit', width: '100%', textAlign: 'left' }}
              onMouseEnter={() => setHoveredOcr(o.id)}
              onMouseLeave={() => setHoveredOcr(null)}
              onClick={() => {
                if (o.linkedEntityId) {
                  selectEntity(o.linkedEntityId);
                  if (o.entityType === 'PERSON') navigate(`/cases/${caseId}/person/${o.linkedEntityId}`);
                }
              }}
            >
              <div className="stack">
                <span style={{ fontSize: 12 }}>{o.text}</span>
                <span className="text-muted" style={{ fontSize: 10 }}>{o.entityType} · p.{o.page}</span>
              </div>
              <span className="badge badge-info">{Math.round(o.confidence * 100)}%</span>
            </button>
          ))}
          {ocr.length === 0 && <span className="text-muted" style={{ fontSize: 12 }}>No entities extracted from this document.</span>}
        </div>
      </div>
    </div>
  );
}
