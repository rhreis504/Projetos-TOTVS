import { useState } from 'react';
import { LayoutDashboard, Mail, Lock } from 'lucide-react';
import { appConfig } from '../../config/appConfig';
import ProfileCard from './ProfileCard';

const profiles = [ ['cliente','Eu sou Cliente','Building2'], ['totvs','Eu sou TOTVS','Layers'], ['parceiro','Eu sou Parceiro','Handshake'] ];
export default function LoginPage({ onLoginSuccess }) {
  const [selectedProfile, setSelectedProfile] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  function submit(e) { e.preventDefault(); if (!selectedProfile) return setError('Selecione um perfil de acesso.'); if (!email.trim()) return setError('Informe o e-mail corporativo.'); if (!password.trim()) return setError('Informe a senha.'); setError(''); onLoginSuccess(selectedProfile); window.dispatchEvent(new PopStateEvent('popstate')); }
  return <div className="min-h-screen bg-slate-900 bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center p-4 relative" style={{ backgroundImage: `linear-gradient(rgba(15,23,42,.42), rgba(15,23,42,.42)), url('${appConfig.wallpaperUrl}')` }}>
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-slate-900 p-8 text-center relative overflow-hidden"><div className="absolute inset-0 bg-blue-600 opacity-10" /><h1 className="text-3xl font-bold text-white relative z-10 flex items-center justify-center gap-2"><LayoutDashboard className="w-8 h-8 text-blue-400" />Adaptive One</h1><p className="text-slate-300 mt-2 text-sm relative z-10">Governança Inteligente</p></div>
      <div className="p-8"><div className="text-center mb-6"><h2 className="text-xl font-bold text-slate-800">Acesse sua jornada de implantação</h2><p className="text-sm text-slate-500 mt-1">Escolha seu perfil de acesso para continuar</p></div>
        <div className="grid grid-cols-3 gap-3 mb-8">{profiles.map(([id,title,icon]) => <ProfileCard key={id} id={id} title={title} icon={icon} selectedProfile={selectedProfile} onClick={setSelectedProfile} />)}</div>
        <form onSubmit={submit} className="space-y-4">{error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">{error}</div>}
          <label className="block"><span className="block text-sm font-medium text-slate-700 mb-1">E-mail corporativo</span><span className="relative block"><Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"/><input type="email" className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors" placeholder="seu.nome@empresa.com" value={email} onChange={e=>setEmail(e.target.value)} /></span></label>
          <label className="block"><span className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-slate-700">Senha</span><a href="#" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Esqueci minha senha</a></span><span className="relative block"><Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"/><input type="password" className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} /></span></label>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-6">Conectar</button>
        </form></div><div className="bg-slate-50 py-4 text-center border-t border-slate-100"><p className="text-xs text-slate-500">{appConfig.footer}</p></div></div></div>;
}
