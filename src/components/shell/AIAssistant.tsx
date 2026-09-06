import { useState } from 'react';
import { Sparkles, X, Maximize2, Minimize2, Send } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useInvestigationStore } from '../../store/investigationStore';
import { getEntityById } from '../../data';
import { mockDelay } from '../../utils/mockDelay';

interface Message {
  id: string;
  role: 'maya' | 'user';
  text: string;
}

function buildSuggestions(selectedEntityId: string | null): string[] {
  if (selectedEntityId) {
    const entity = getEntityById(selectedEntityId);
    return [
      `Show connections to ${entity?.name ?? selectedEntityId}`,
      `Summarize activity for ${entity?.name ?? selectedEntityId}`,
      'Flag anomalies in this network',
    ];
  }
  return ['What would you like to investigate?', 'Show high-risk entities in this case', 'Summarize recent alerts'];
}

function scriptedReply(input: string, selectedEntityId: string | null): string {
  const entity = selectedEntityId ? getEntityById(selectedEntityId) : undefined;
  const q = input.toLowerCase();
  if (q.includes('connection')) {
    return entity
      ? `${entity.name} has multiple linked entities in the current graph. Opening the network view centered on ${entity.id} would show direct and second-degree connections.`
      : 'Select an entity first, then ask me to show its connections.';
  }
  if (q.includes('summar')) {
    return entity
      ? `${entity.name} (${entity.id}) — risk level ${(entity as { riskLevel?: string }).riskLevel ?? 'unknown'}. Recent activity includes CCTV detections and financial transfers logged in the timeline.`
      : 'Open a case and select an entity so I can summarize its activity.';
  }
  if (q.includes('anomal') || q.includes('flag')) {
    return 'Two flagged transaction chains and one unresolved identity (UNKNOWN_07) are currently active in this case. Check the Alerts panel for details.';
  }
  if (q.includes('risk')) {
    return 'Arjun Malhotra (P-0042) and Vikram Singh Rathore (P-0046) are currently the highest-risk entities in this case.';
  }
  return "I can help you navigate entities, summarize activity, or surface anomalies. Try asking me to 'show connections' or 'summarize activity' for a selected entity.";
}

export function AIAssistant() {
  const open = useUIStore((s) => s.aiAssistantOpen);
  const expanded = useUIStore((s) => s.aiAssistantExpanded);
  const toggleOpen = useUIStore((s) => s.toggleAIAssistant);
  const setExpanded = useUIStore((s) => s.setAIAssistantExpanded);
  const selectedEntityId = useInvestigationStore((s) => s.selectedEntityId);

  const [messages, setMessages] = useState<Message[]>([
    { id: 'm0', role: 'maya', text: 'What would you like to investigate?' },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  async function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);
    await mockDelay(650);
    const reply = scriptedReply(text, selectedEntityId);
    setMessages((m) => [...m, { id: `a-${Date.now()}`, role: 'maya', text: reply }]);
    setThinking(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Open Maya AI Assistant"
        title="Maya — AI Assistant"
        style={{
          position: 'fixed', right: 20, bottom: 'calc(var(--bottomnav-height) + 16px)', zIndex: 40,
          width: 44, height: 44, borderRadius: '50%', background: 'var(--panel)', border: '1px solid var(--cyan-dim)',
          color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: 'var(--shadow-panel)', animation: 'pulseGlow 3s ease infinite',
        }}
      >
        <Sparkles size={20} />
      </button>
    );
  }

  const width = expanded ? 420 : 300;
  const height = expanded ? 520 : 340;

  return (
    <div
      className="panel fade-in"
      style={{
        position: 'fixed', right: 20, bottom: 'calc(var(--bottomnav-height) + 16px)', zIndex: 40,
        width, height, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-panel)',
      }}
    >
      <div className="panel-header">
        <div className="row gap-2">
          <Sparkles size={14} color="var(--cyan)" />
          <span className="section-title" style={{ color: 'var(--cyan)' }}>MAYA</span>
        </div>
        <div className="row gap-1">
          <button className="icon-btn" onClick={() => setExpanded(!expanded)} aria-label="Expand" type="button">
            {expanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button className="icon-btn" onClick={toggleOpen} aria-label="Close" type="button"><X size={14} /></button>
        </div>
      </div>
      <div className="stack gap-2" style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              background: m.role === 'user' ? 'var(--cyan-glow)' : 'var(--bg-2)',
              border: `1px solid ${m.role === 'user' ? 'var(--cyan-dim)' : 'var(--border)'}`,
              borderRadius: 4, padding: '6px 9px', fontSize: 12.5, lineHeight: 1.4,
            }}
          >
            {m.text}
          </div>
        ))}
        {thinking && <div className="text-muted mono blink" style={{ fontSize: 11 }}>analyzing…</div>}
      </div>
      <div className="stack gap-1" style={{ padding: 8, borderTop: '1px solid var(--border)' }}>
        {!expanded && messages.length < 3 && (
          <div className="stack gap-1" style={{ marginBottom: 4 }}>
            {buildSuggestions(selectedEntityId).slice(0, 2).map((s) => (
              <button key={s} type="button" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start', textTransform: 'none', fontWeight: 400 }} onClick={() => send(s)}>
                › {s}
              </button>
            ))}
          </div>
        )}
        <div className="row gap-1">
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder="Ask Maya…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(input); }}
          />
          <button type="button" className="btn btn-primary btn-sm" onClick={() => send(input)} aria-label="Send"><Send size={12} /></button>
        </div>
      </div>
    </div>
  );
}
