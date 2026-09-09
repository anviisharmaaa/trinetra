import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useCaseStore } from '../../store/caseStore';
import { useEvidenceStore } from '../../store/evidenceStore';
import { CaseHeader } from './CaseHeader';
import { CaseModuleNav } from './CaseModuleNav';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';

export function CaseWorkspaceLayout() {
  const { caseId } = useParams();
  const { cases, fetchCases, status, setActiveCase, ensureCase, caseLookup } = useCaseStore();
  const loadEvidenceCase = useEvidenceStore((s) => s.loadCase);
  const unacknowledgedAlerts = useEvidenceStore((s) => s.alerts.filter((a) => !a.acknowledged).length);

  useEffect(() => {
    if (cases.length === 0 && status === 'idle') fetchCases();
  }, [cases.length, status, fetchCases]);

  useEffect(() => {
    if (caseId) {
      setActiveCase(caseId);
      loadEvidenceCase(caseId);
      // Falls back to the real LED case backend (Postgres `cases`) only if
      // caseId isn't a Supabase analyst case or a legacy demo case -- a
      // no-op for every case that already works today.
      ensureCase(caseId);
    }
  }, [caseId, setActiveCase, loadEvidenceCase, ensureCase]);

  const activeCase = cases.find((c) => c.id === caseId);
  const lookupStatus = caseId ? caseLookup[caseId] : undefined;

  if (status === 'loading' && !activeCase) return <LoadingState label="LOADING CASE WORKSPACE" />;
  if (!activeCase && status === 'ready') {
    // Wait for the per-case LED fallback lookup to actually conclude before
    // declaring the case missing -- it starts synchronously in the effect
    // above, so `lookupStatus` is 'loading' by the time this render happens
    // whenever a lookup is needed at all.
    if (lookupStatus === 'loading' || lookupStatus === undefined) return <LoadingState label="LOADING CASE WORKSPACE" />;
    if (lookupStatus === 'error') {
      return (
        <ErrorState
          title="CASE INTELLIGENCE UNAVAILABLE"
          message="Case intelligence could not be loaded."
          onRetry={() => caseId && ensureCase(caseId)}
        />
      );
    }
    return <ErrorState title="CASE NOT FOUND" message="This case does not exist or is no longer accessible." />;
  }
  if (!activeCase) return <LoadingState label="LOADING CASE WORKSPACE" />;

  return (
    <div className="stack case-workspace" style={{ height: '100%', minHeight: 0 }}>
      <CaseHeader activeCase={activeCase} />
      <CaseModuleNav caseId={activeCase.id} alertCount={unacknowledgedAlerts} />
      <div className="case-workspace-body" style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        <Outlet />
      </div>
    </div>
  );
}
