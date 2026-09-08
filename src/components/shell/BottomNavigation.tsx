// Pure branding footer. Module-to-module navigation now happens via the
// horizontal CaseModuleNav tab bar inside the case workspace, so this no
// longer duplicates that navigation — it only carries the platform footer
// line, matching the reference UI's plain footer style.
export function BottomNavigation() {
  return (
    <footer
      className="row"
      style={{
        height: 'var(--bottomnav-height)', borderTop: '1px solid var(--border)', background: 'var(--bg-1)',
        justifyContent: 'center', padding: '0 16px',
      }}
    >
      <span className="mono text-muted" style={{ fontSize: 9.5, letterSpacing: '0.12em', textAlign: 'center' }}>
        TRINETRA · INTELLIGENCE PLATFORM — SIMULATION MODE • FRONTEND DEMO ENVIRONMENT &nbsp;|&nbsp; INTELLIGENCE • SECURITY • IMPACT &nbsp;—&nbsp; A SAFER INDIA TOGETHER 🇮🇳
      </span>
    </footer>
  );
}
