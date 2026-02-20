"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, Building2, Package, AlertTriangle, ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from './config';

export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    console.log("NAV_ATTEMPT:", path); // Forces a log entry
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 font-sans">
      {/* Logo Header */}
      <div className="w-full max-w-lg mb-10">
        <div className="rounded-xl h-44 border border-white/10 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
          <img src="/Logo.jpg" alt="Logo" className="h-32 object-contain" />
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">{SITE_CONFIG.propertyName}</h1>
        <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px] mt-2">{SITE_CONFIG.propertyAddress}</p>
      </div>

      <main className="w-full max-w-md space-y-4">
        {/* DIRECTORY BUTTON */}
        <button 
          onClick={() => handleNavigation('/directory')}
          className="flex items-center justify-between w-full bg-[#0a0a0a] border border-blue-500/30 p-5 rounded-[1.8rem] active:scale-95 transition-all shadow-[0_0_20px_rgba(37,99,235,0.1)]"
        >
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-3.5 rounded-2xl shadow-lg"><Users size={26} /></div>
            <span className="text-2xl font-black italic uppercase tracking-tighter">Directory</span>
          </div>
          <ChevronRight size={22} className="text-blue-500/40" />
        </button>

        {/* EMERGENCY BUTTON (Direct Dial) */}
        <a 
          href={`tel:${SITE_CONFIG.emergencyPhone}`}
          className="flex items-center justify-between w-full bg-[#0a0a0a] border border-red-900/30 p-5 rounded-[1.8rem] active:scale-95 transition-all"
        >
          <div className="flex items-center gap-5">
            <div className="bg-red-600/10 p-3.5 rounded-2xl text-red-500"><AlertTriangle size={26} /></div>
            <span className="text-2xl font-black italic uppercase tracking-tighter text-red-600/80">Emergency</span>
          </div>
          <ChevronRight size={22} className="text-red-900/40" />
        </a>
      </main>
    </div>
  );
}
