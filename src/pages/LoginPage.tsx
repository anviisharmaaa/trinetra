import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ShieldAlert, ArrowRight, CreditCard } from 'lucide-react';
import { TrinetraGlobe } from '../components/auth/TrinetraGlobe';
import { useSessionStore } from '../store/sessionStore';
import { useSystemTime } from '../hooks/useSystemTime';
import trinetraIcon from '../assets/logos/trinetra-icon.png';

type Phase = 'idle' | 'authenticating' | 'granted';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useSessionStore((s) => s.login);
  const signup = useSessionStore((s) => s.signup);
  const authError = useSessionStore((s) => s.authError);
  const now = useSystemTime();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
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
    const ok = mode === 'login'
      ? await login(username, password)
      : await signup(displayName, username, password);
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

            <h2 className="auth-welcome">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p className="auth-welcome-sub">
              {mode === 'login' ? 'Sign in to continue to Trinetra' : 'Create a secure analyst account'}
            </p>

            {authError && (
              <div className="auth-error">
                <ShieldAlert size={14} style={{ marginTop: 1, flexShrink: 0 }} />
                <span>{authError}</span>
              </div>
            )}

            <div className="auth-field">
              {mode === 'signup' && (
                <div className="auth-field">
                  <label htmlFor="auth-display-name">Full name</label>
                  <div className="auth-input-wrap">
                    <User size={15} />
                    <input
                      id="auth-display-name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ananya Deshmukh"
                      autoComplete="name"
                      autoFocus
                      disabled={phase !== 'idle'}
                    />
                  </div>
                </div>
              )}
              <label htmlFor="auth-username">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={15} />
                <input
                  id="auth-username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="analyst@example.com"
                  autoComplete="email"
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
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
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

            {mode === 'login' && (
              <div className="auth-row-between">
                <span className="auth-link-muted">Session secured by Supabase</span>
                <button
                  type="button"
                  className="auth-link-muted"
                  onClick={() => setNotice('Password reset is not available yet.')}
                >
                  Forgot password?
                </button>
              </div>
            )}

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
                  {mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={15} />
                </>
              )}
              {phase === 'authenticating' && (
                <>
                  <span className="auth-spinner" /> Authenticating&hellip;
                </>
              )}
              {phase === 'granted' && 'Access granted'}
            </button>

            {mode === 'login' && <div className="auth-divider-row">
              <span>or</span>
            </div>}

            {mode === 'login' && (
              <button
                type="button"
                className="auth-btn-secondary"
                onClick={() => setNotice('Smart card authentication is not available.')}
              >
                <CreditCard size={15} />
                Sign in with Smart Card
              </button>
            )}

            <div className="auth-demo-hint">
              {mode === 'login' ? 'Use your Supabase account credentials.' : 'Email confirmation may be required.'}
            </div>

            <button
              type="button"
              className="auth-link-muted"
              onClick={() => {
                setMode((current) => current === 'login' ? 'signup' : 'login');
                setNotice(null);
              }}
              disabled={phase !== 'idle'}
            >
              {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
            </button>

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
