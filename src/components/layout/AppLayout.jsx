import { useState } from 'react';
import { appConfig } from '../../config/appConfig';
import Sidebar from './Sidebar';
import Header from './Header';
export default function AppLayout({ title, profile, onLogout, children }) { const [open,setOpen]=useState(false); return <div className="min-h-screen bg-slate-50 bg-cover bg-center bg-fixed bg-no-repeat flex" style={{ backgroundImage: `linear-gradient(rgba(248,250,252,.86), rgba(248,250,252,.86)), url('${appConfig.wallpaperUrl}')` }}><Sidebar isOpen={open} onClose={()=>setOpen(false)}/><div className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300"><Header title={title} profile={profile} onLogout={onLogout} onOpenSidebar={()=>setOpen(true)}/><main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main></div></div>; }
