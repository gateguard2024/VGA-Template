"use client";
import React from 'react';
import Link from 'next/link';
import { Search, Phone, ShieldAlert, MapPin, ShieldCheck, ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from './config';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="p-8 pt-12 flex flex-col items-center text-center relative z-10">
        <div className="bg-blue-600/10 p-3 rounded-2xl mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
          <ShieldCheck className="text-blue-500" size={32} />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">
          {SITE_CONFIG.propertyName.split(' ')[0]} <br/>
          <span className="text-blue-600">{SITE_CONFIG.propertyName.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">
          Secure Visitor Interface
        </p>
      </header>

      {/* Main Actions */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-4 w-full max-w-md mx-auto relative z-10">
        
        {/* Primary Directory Button with Blue Haze */}
        <Link 
          href="/directory" 
          className="w-full bg-blue-600 py-7 rounded-[2.2rem] flex items-center justify-between px-8 
                     group transition-all active:scale-95
                     shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)]"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-2 rounded-xl"><Search size={24} /></div>
            <div className="text-left">
              <span className="block text-xs font-black uppercase tracking-widest opacity-60">Resident</span>
              <span className="text-lg font-black uppercase italic tracking-tighter">Directory</span>
            </div>
          </div>
          <ChevronRight className="opacity-40 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Emergency Button with Blue Haze */}
        <button 
          className="w-full bg-[#0f0f0f] border border-white/5 py-7 rounded-[2.2rem] flex items-center justify-between px-8
                     group transition-all active:scale-95
                     shadow-[0_0_20px_rgba(37,99,235,0.15)] hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-600/10 p-2 rounded-xl text-blue-500"><ShieldAlert size={24} /></div>
            <div className="text-left">
              <span className="block text-xs font-black uppercase tracking-widest opacity-40">Contact</span>
              <span className="text-lg font-black uppercase italic tracking-tighter text-slate-300">Office / Emergency</span>
            </div>
          </div>
          <ChevronRight className="opacity-20 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">700 Rock Quarry Road</span>
          </div>
          <div className="bg-blue-500/5 px-4 py-1.5 rounded-full border border-blue-500/10">
            <span className="text-[9px] font-black uppercase tracking-tighter text-blue-400/60">Geo-Fence Authentication Active</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-10 flex flex-col items-center opacity-20 relative z-10">
        <span className="text-[8px] font-black uppercase tracking-[0.6em] mb-1">Eagles Landing Portal</span>
        <span className="text-[8px] font-medium uppercase tracking-[0.2em]">Privacy Shield V2.4.0</span>
      </footer>
    </div>
  );
}
