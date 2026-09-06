import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';
import { ShieldQuestion } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-0)' }}>
      <EmptyState
        icon={<ShieldQuestion size={32} />}
        title="ROUTE NOT FOUND"
        hint="The requested workspace path does not exist."
        action={<Link to="/cases" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>RETURN TO CASES</Link>}
      />
    </div>
  );
}
