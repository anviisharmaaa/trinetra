import { useNavigate } from 'react-router-dom';
import { DASHBOARD_ACTIVITY } from '../../data/dashboard/activity';
import { useCaseStore } from '../../store/caseStore';
import { formatRelativeTime } from '../../utils/formatters';

export function RecentActivityPanel() {
  const navigate = useNavigate();
  const cases = useCaseStore((s) => s.cases);

  function openCase(code?: string) {
    if (!code) return;
    const match = cases.find((c) => c.code === code);
    if (match) navigate(`/cases/${match.id}`);
  }

  return (
    <div className="dash-panel">
      <div className="dash-panel-header">Recent Activity</div>
      <div className="dash-activity-list">
        {DASHBOARD_ACTIVITY.map((item) => (
          <button
            key={item.id}
            type="button"
            className="dash-activity-row"
            onClick={() => openCase(item.caseCode)}
            disabled={!item.caseCode || !cases.some((c) => c.code === item.caseCode)}
          >
            <span className="dash-activity-time">{formatRelativeTime(item.timestamp)}</span>
            <span className={`dash-activity-dot tone-${item.tone}`} />
            <span className="dash-activity-message">{item.message}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
