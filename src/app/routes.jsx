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
import EmptyState from '../components/ui/EmptyState';
import { getPageTitle } from '../utils/routeHelpers';
import { navigateTo } from '../utils/navigation';

const pages = {
  '/home': HomePage, '/portfolio': PortfolioPage, '/cockpit': CockpitPage, '/status-report': StatusReportPage,
  '/riscos': RisksPage, '/pendencias': PendingItemsPage, '/gaps': GapsPage, '/times': TeamsPage,
  '/indicadores': IndicatorsPage, '/orbit': OrbitPage, '/configuracoes': SettingsPage, '/agf': AgfOverviewPage,
  '/agf/arvore': GateTreePage,
};


export function AppRoutes({ profile, onLoginSuccess, onLogout }) {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => { const sync = () => setPath(window.location.pathname); window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync); }, []);
  useEffect(() => {
    if (path === '/') navigateTo(profile ? '/home' : '/login');
    if (!profile && path !== '/login') navigateTo('/login');
    if (profile && path === '/login') navigateTo('/home');
  }, [path, profile]);

  const title = useMemo(() => getPageTitle(path), [path]);
  if (!profile || path === '/login') return <LoginPage onLoginSuccess={onLoginSuccess} />;
  const gateMatch = path.match(/^\/agf\/gate\/(\d)$/);
  const Page = gateMatch ? GatePage : pages[path];
  return <AppLayout title={title} profile={profile} onLogout={onLogout}>{Page ? <Page gateId={gateMatch?.[1]} /> : <EmptyState />}</AppLayout>;
}
