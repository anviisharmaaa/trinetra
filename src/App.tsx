import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthLayout } from './layouts/AuthLayout';
import { AppShell } from './components/shell/AppShell';
import { CaseWorkspaceLayout } from './components/shell/CaseWorkspaceLayout';
import { ProtectedRoute } from './app/ProtectedRoute';
import { useSessionStore } from './store/sessionStore';

import { LoginPage } from './pages/LoginPage';
import { CasesPage } from './pages/CasesPage';
import { CaseDashboardPage } from './pages/CaseDashboardPage';
import { NetworkAnalysisPage } from './pages/NetworkAnalysisPage';
import { PersonDossierPage } from './pages/PersonDossierPage';
import { SocialMediaPage } from './pages/SocialMediaPage';
import { CallRecordsPage } from './pages/CallRecordsPage';
import { CriminalRecordsPage } from './pages/CriminalRecordsPage';
import { CCTVPage } from './pages/CCTVPage';
import { FaceRecognitionPage } from './pages/FaceRecognitionPage';
import { LocationPage } from './pages/LocationPage';
import { FinancialPage } from './pages/FinancialPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ForensicsPage } from './pages/ForensicsPage';
import { EvidencePage } from './pages/EvidencePage';
import { ReportsPage } from './pages/ReportsPage';
import { TimelinePage } from './pages/TimelinePage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const restoreSession = useSessionStore((s) => s.restoreSession);
  useEffect(() => { restoreSession(); }, [restoreSession]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:caseId" element={<CaseWorkspaceLayout />}>
            <Route index element={<CaseDashboardPage />} />
            <Route path="network" element={<NetworkAnalysisPage />} />
            <Route path="person/:personId" element={<PersonDossierPage />} />
            <Route path="social-media" element={<SocialMediaPage />} />
            <Route path="call-records" element={<CallRecordsPage />} />
            <Route path="criminal-records" element={<CriminalRecordsPage />} />
            <Route path="cctv" element={<CCTVPage />} />
            <Route path="face-recognition" element={<FaceRecognitionPage />} />
            <Route path="location" element={<LocationPage />} />
            <Route path="financial" element={<FinancialPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="forensics" element={<ForensicsPage />} />
            <Route path="evidence" element={<EvidencePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="alerts" element={<AlertsPage />} />
          </Route>
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/cases" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
