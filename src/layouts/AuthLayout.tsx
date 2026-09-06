import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-0)' }}>
      <Outlet />
    </div>
  );
}
