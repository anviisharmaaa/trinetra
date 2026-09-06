import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, ShieldAlert, ArrowRight, CreditCard } from 'lucide-react';
import { TrinetraGlobe } from '../components/auth/TrinetraGlobe';
import { useSessionStore } from '../store/sessionStore';
import { useSystemTime } from '../hooks/useSystemTime';
import trinetraIcon from '../assets/logos/trinetra-icon.png';

type Phase = 'idle' | 'authenticating' | 'granted';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useSessionStore((s) => s.login);
  const authError = useSessionStore((s) => s.authError);
  const now = useSystemTime();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [phase, setPhase] = useState<Phase>('idle');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2600);
    return () => clearTimeout(t);
  }, [notice]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (phase !== 'idle') return;
    setPhase('authenticating');
    const ok = await login(username, password, remember);
    if (ok) {
      setPhase('granted');
      setTimeout(() => navigate('/cases'), 620);
    } else {
      setPhase('idle');
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-globe-layer" data-interactive="true">
        <TrinetraGlobe />
      </div>

      <header className="auth-topbar">
        <div className="auth-wordmark">TRINETRA</div>
        <nav className="auth-nav">
          <span className="auth-nav-link">INTELLIGENCE</span>
          <span className="auth-nav-link">SECURITY</span>
          <span className="auth-nav-link">IMPACT</span>
          <div className="auth-status-cluster">
            <span className="auth-status-dot" />
            <span className="auth-status-text">SYSTEM STATUS &middot; NOMINAL</span>
            <span className="auth-clock">{now.toLocaleTimeString('en-IN', { hour12: false })}</span>
          </div>
        </nav>
      </header>

      <div className="auth-content">
        <div className="auth-left">
          <h1 className="auth-heading">
            <span>A clearer</span>
            <span>picture for</span>
            <span>a safer tomorrow.</span>
          </h1>
          <p className="auth-subheading">Intelligence. Security. Relentless.</p>
          <div className="auth-rule" />
          <p className="auth-supporting">
            Connecting people, data and possibilities to strengthen a safer India.
          </p>
        </div>

        <div className="auth-right">
          <form className="auth-card" onSubmit={handleSubmit} noValidate>
            <div className="auth-card-brand">
              <img src={trinetraIcon} alt="Trinetra" className="auth-card-icon" />
              <div className="auth-card-wordmark">TRINETRA</div>
              <div className="auth-card-subtitle">INTELLIGENCE PLATFORM</div>
            </div>

            <h2 className="auth-welcome">Welcome back</h2>
            <p className="auth-welcome-sub">Sign in to continue to Trinetra</p>

            {authError && (
              <div className="auth-error">
                <ShieldAlert size={14} style={{ marginTop: 1, flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="auth-username">Username</label>
              <div className="auth-input-wrap">
                <User size={15} />
                <input
                  id="auth-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="analyst.username"
                  autoComplete="username"
                  autoFocus
                  disabled={phase !== 'idle'}
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={15} />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  autoComplete="current-password"
                  disabled={phase !== 'idle'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="auth-row-between">
              <label className="auth-checkbox">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Keep me signed in
              </label>
              <button
                type="button"
                className="auth-link-muted"
                onClick={() => setNotice('Password reset is not available in this demo environment.')}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className={
                'auth-btn-primary' +
                (phase === 'authenticating' ? ' is-loading' : '') +
                (phase === 'granted' ? ' is-success' : '')
              }
              disabled={phase !== 'idle'}
            >
              {phase === 'idle' && (
                <>
                  Sign in <ArrowRight size={15} />
                </>
              )}
              {phase === 'authenticating' && (
                <>
                  <span className="auth-spinner" /> Authenticating&hellip;
                </>
              )}
              {phase === 'granted' && 'Access granted'}
            </button>

            <div className="auth-divider-row">
              <span>or</span>
            </div>

            <button
              type="button"
              className="auth-btn-secondary"
              onClick={() => setNotice('Smart card authentication is not available in this demo environment.')}
            >
              <CreditCard size={15} />
              Sign in with Smart Card
            </button>

            <div className="auth-demo-hint">
              Demo access &mdash; <b>demo</b> / <b>demo</b>
            </div>

            <div className="auth-card-footer">
              <button type="button" onClick={() => setNotice('Security notices are not available in this demo environment.')}>
                Security Notice
              </button>
              <span>|</span>
              <button type="button" onClick={() => setNotice('Privacy information is not available in this demo environment.')}>
                Privacy
              </button>
              <span>|</span>
              <button type="button" onClick={() => setNotice('Help is not available in this demo environment.')}>
                Help
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="auth-footer-left">
        <span className="auth-footer-label">BUILT FOR A SAFER INDIA</span>
        <div className="auth-tricolor">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="auth-footer-right">
        <div className="auth-sim-tag">SIMULATION ENVIRONMENT</div>
        <div className="auth-version">VERSION 2.0.1</div>
      </div>

      <div className={'auth-notice' + (notice ? ' is-visible' : '')}>{notice}</div>
    </div>
  );
}
