import { useEffect, useMemo, useState } from 'react';
import LoginPage from '../components/login/LoginPage';
import AppLayout from '../components/layout/AppLayout';
import HomePage from '../pages/HomePage';
import PortfolioPage from '../pages/PortfolioPage';
import CockpitPage from '../pages/CockpitPage';
import StatusReportPage from '../pages/StatusReportPage';
import RisksPage from '../pages/RisksPage';
import PendingItemsPage from '../pages/PendingItemsPage';
import GapsPage from '../pages/GapsPage';
import TeamsPage from '../pages/TeamsPage';
import IndicatorsPage from '../pages/IndicatorsPage';
import OrbitPage from '../pages/OrbitPage';
import SettingsPage from '../pages/SettingsPage';
import AgfOverviewPage from '../pages/agf/AgfOverviewPage';
import GateTreePage from '../pages/agf/GateTreePage';
import GatePage from '../pages/agf/GatePage';
import Gate3Page from '../pages/agf/Gate3Page';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ProjectAgfJourneyPage from '../pages/agf/ProjectAgfJourneyPage';
import EmptyState from '../components/ui/EmptyState';
import { getPageTitle } from '../utils/routeHelpers';
import { navigateTo } from '../utils/navigation';
import { getCurrentAppPath, getRedirectedAppPath } from '../utils/basePath';

const pages = {
  '/home': HomePage, '/portfolio': PortfolioPage, '/cockpit': CockpitPage, '/status-report': StatusReportPage,
  '/riscos': RisksPage, '/pendencias': PendingItemsPage, '/gaps': GapsPage, '/times': TeamsPage,
  '/indicadores': IndicatorsPage, '/orbit': OrbitPage, '/configuracoes': SettingsPage, '/agf': AgfOverviewPage,
  '/agf/arvore': GateTreePage,
};


export function AppRoutes({ profile, onLoginSuccess, onLogout }) {
  const [path, setPath] = useState(getCurrentAppPath);
  useEffect(() => { const sync = () => setPath(getCurrentAppPath()); window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync); }, []);
  useEffect(() => {
    const redirectedPath = getRedirectedAppPath();
    if (redirectedPath && profile) return navigateTo(redirectedPath, { replace: true });
    if (path === '/') return navigateTo(profile ? '/home' : '/login', { replace: true });
    if (!profile && path !== '/login') return navigateTo('/login', { replace: true });
    if (profile && path === '/login') return navigateTo('/home', { replace: true });
  }, [path, profile]);

  const title = useMemo(() => getPageTitle(path), [path]);
  if (!profile || path === '/login') return <LoginPage onLoginSuccess={onLoginSuccess} />;
  const projectGate3Match = path.match(/^\/projetos\/([^/]+)\/agf\/gate\/3$/);
  const projectAgfMatch = path.match(/^\/projetos\/([^/]+)\/agf$/);
  const projectMatch = path.match(/^\/projetos\/([^/]+)$/);
  const gateMatch = path.match(/^\/agf\/gate\/(\d)$/);

  let content;
  if (projectGate3Match) content = <Gate3Page projectId={projectGate3Match[1]} />;
  else if (projectAgfMatch) content = <ProjectAgfJourneyPage projectId={projectAgfMatch[1]} />;
  else if (projectMatch) content = <ProjectDetailPage projectId={projectMatch[1]} />;
  else if (gateMatch?.[1] === '3') content = <Gate3Page />;
  else { const Page = gateMatch ? GatePage : pages[path]; content = Page ? <Page gateId={gateMatch?.[1]} /> : <EmptyState />; }
  return <AppLayout title={title} profile={profile} onLogout={onLogout}>{content}</AppLayout>;
}
