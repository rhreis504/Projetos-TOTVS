import { useEffect, useState } from 'react';
import { getAccessProfile, saveAccessProfile, clearAccessProfile } from '../utils/authStorage';
import { AppRoutes } from './routes';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => { setProfile(getAccessProfile()); setIsInitializing(false); }, []);

  function handleLoginSuccess(selectedProfile) { saveAccessProfile(selectedProfile); setProfile(selectedProfile); window.history.pushState({}, '', '/home'); }
  function handleLogout() { clearAccessProfile(); setProfile(null); window.history.pushState({}, '', '/login'); window.dispatchEvent(new PopStateEvent('popstate')); }

  if (isInitializing) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" /></div>;
  return <AppRoutes profile={profile} onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />;
}
