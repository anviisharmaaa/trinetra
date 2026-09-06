import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { financialService } from '../services/financialService';
import { getEntityById } from '../data';
import { Panel } from '../components/ui/Panel';
import { LoadingState } from '../components/ui/LoadingState';
import type { AccountEntity, Transaction } from '../types';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { PersonAvatar } from '../components/ui/EntityImage';
import { personImage } from '../config/imageAssets';

export function FinancialPage() {
  const { caseId } = useParams();
  const [accounts, setAccounts] = useState<AccountEntity[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    if (!caseId) return;
    financialService.listAccountsForCase(caseId).then(setAccounts);
    financialService.listTransactions(caseId).then(setTransactions);
  }, [caseId]);

  if (accounts === null) return <LoadingState label="ANALYZING FINANCIAL RECORDS" />;

  const visibleTx = selectedAccount ? transactions.filter((t) => t.fromAccountId === selectedAccount || t.toAccountId === selectedAccount) : transactions;
  const flaggedCount = transactions.filter((t) => t.flagged).length;
  const totalMoved = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="split-3">
      <div className="stack" style={{ padding: 10 }}>
        <div className="system-label" style={{ marginBottom: 8 }}>ACCOUNTS</div>
        <div className="stack gap-1">
          <button
            type="button"
            className="row"
            style={{ background: !selectedAccount ? 'var(--cyan-glow)' : 'none', border: 'none', textAlign: 'left', padding: '6px 4px', cursor: 'pointer', color: 'inherit', fontSize: 12 }}
            onClick={() => setSelectedAccount(null)}
          >
            ALL ACCOUNTS
          </button>
          {accounts.map((a) => {
            const owner = a.metadata.ownerId ? getEntityById(a.metadata.ownerId) : undefined;
            return (
              <button
                key={a.id}
                type="button"
                className="stack"
                style={{ background: selectedAccount === a.id ? 'var(--cyan-glow)' : 'none', border: '1px solid ' + (selectedAccount === a.id ? 'var(--cyan-dim)' : 'transparent'), borderRadius: 4, padding: 8, cursor: 'pointer', color: 'inherit', textAlign: 'left' }}
                onClick={() => setSelectedAccount(a.id)}
              >
                <div className="row gap-2" style={{ alignItems: 'center' }}>
                  {owner && <PersonAvatar personId={owner.id} name={owner.name} src={personImage(owner.id, owner.name)} size={22} />}
                  <span style={{ fontSize: 12 }}>{owner?.name ?? a.name}</span>
                </div>
                <span className="text-muted" style={{ fontSize: 10 }}>{a.metadata.bankName}</span>
                {a.metadata.balance !== undefined && <span className="text-cyan mono" style={{ fontSize: 11 }}>{formatCurrency(a.metadata.balance)}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="scroll-region" style={{ padding: 12 }}>
        <div className="row gap-3" style={{ marginBottom: 12 }}>
          <div className="panel" style={{ padding: 10, flex: 1 }}>
            <span className="value-large">{formatCurrency(totalMoved)}</span>
            <div className="system-label">Total Moved</div>
          </div>
          <div className="panel" style={{ padding: 10, flex: 1 }}>
            <span className="value-large text-danger">{flaggedCount}</span>
            <div className="system-label">Flagged Transfers</div>
          </div>
          <div className="panel" style={{ padding: 10, flex: 1 }}>
            <span className="value-large">{accounts.length}</span>
            <div className="system-label">Linked Accounts</div>
          </div>
        </div>
        <Panel title="TRANSACTIONS" noPadding>
          <table className="data-table">
            <thead><tr><th>Date</th><th>From</th><th>To</th><th>Amount</th><th>Mode</th><th>Flag</th></tr></thead>
            <tbody>
              {visibleTx.map((t) => (
                <tr key={t.id} className={selectedTx?.id === t.id ? 'selected' : ''} onClick={() => setSelectedTx(t)}>
                  <td className="mono">{formatDateTime(t.timestamp)}</td>
                  <td>{getEntityById(t.fromAccountId)?.name ?? t.fromAccountId}</td>
                  <td>{getEntityById(t.toAccountId)?.name ?? t.toAccountId}</td>
                  <td className="mono">{formatCurrency(t.amount)}</td>
                  <td><span className="badge badge-neutral">{t.mode}</span></td>
                  <td>{t.flagged && <span className="badge badge-high">FLAGGED</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="stack" style={{ padding: 12 }}>
        <div className="system-label" style={{ marginBottom: 8 }}>TRANSACTION DETAILS</div>
        {!selectedTx ? <span className="text-muted" style={{ fontSize: 12 }}>Select a transaction.</span> : (
          <div className="stack gap-2">
            <Detail label="FROM" value={getEntityById(selectedTx.fromAccountId)?.name ?? selectedTx.fromAccountId} />
            <Detail label="TO" value={getEntityById(selectedTx.toAccountId)?.name ?? selectedTx.toAccountId} />
            <Detail label="AMOUNT" value={formatCurrency(selectedTx.amount)} />
            <Detail label="MODE" value={selectedTx.mode} />
            <Detail label="DATE" value={formatDateTime(selectedTx.timestamp)} />
            <Detail label="NARRATION" value={selectedTx.narration ?? '—'} />
            {selectedTx.flagged && <div className="badge badge-high" style={{ width: 'fit-content' }}>FLAGGED FOR REVIEW</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="stack" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: 6 }}>
      <span className="system-label">{label}</span>
      <span style={{ fontSize: 13 }}>{value}</span>
    </div>
  );
}
