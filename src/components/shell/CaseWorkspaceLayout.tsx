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
  const { cases, fetchCases, status, setActiveCase } = useCaseStore();
  const loadEvidenceCase = useEvidenceStore((s) => s.loadCase);
  const unacknowledgedAlerts = useEvidenceStore((s) => s.alerts.filter((a) => !a.acknowledged).length);

  useEffect(() => {
    if (cases.length === 0 && status === 'idle') fetchCases();
  }, [cases.length, status, fetchCases]);

  useEffect(() => {
    if (caseId) {
      setActiveCase(caseId);
      loadEvidenceCase(caseId);
    }
  }, [caseId, setActiveCase, loadEvidenceCase]);

  const activeCase = cases.find((c) => c.id === caseId);

  if (status === 'loading' && !activeCase) return <LoadingState label="LOADING CASE WORKSPACE" />;
  if (!activeCase && status === 'ready') return <ErrorState title="CASE NOT FOUND" message="This case does not exist or is no longer accessible." />;
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
