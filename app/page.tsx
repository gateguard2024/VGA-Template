"use client";
import React from 'react';
import Link from 'next/link';
import { Users, Building2, Package, AlertTriangle, ChevronRight } from 'lucide-react';
import { SITE_CONFIG } from './config';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans items-center overflow-x-hidden">
      
      {/* 1. Header Banner with Your Specific Logo */}
      <div className="w-full max-w-lg relative px-4 pt-4">
        <div className="relative rounded-xl overflow-hidden h-44 border border-white/10 shadow-2xl bg-[#0a0a0a] flex items-center justify-center">
          <img 
            src="/Logo.jpg" 
            alt="Gate Guard Logo"
            className="h-32 w-auto object-contain z-10 drop-shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* 2. Welcome Section */}
      <div className="mt-10 text-center px-6">
        <p className="text-[10px] font-bold tracking-[0.5em] text-slate-500 mb-2 uppercase italic">Welcome To</p>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-1 leading-none">
          {SITE_CONFIG.propertyName}
        </h1>
        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-[0.3em]">
          {SITE_CONFIG.propertyAddress}
        </p>
      </div>

      {/* 3. System Status Indicator */}
      <div className="mt-8">
        <div className="bg-blue-900/20 border border-blue-500/20 px-5 py-2 rounded-full flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_#3b82f6]" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">System Active</span>
        </div>
      </div>

      {/* 4. Polished Action Buttons Layout */}
      <main className="w-full max-w-md px-6 mt-10 space-y-4 pb-12">
        
        {/* DIRECTORY - Blue Border & Haze */}
        <Link href="/directory" 
          className="flex items-center justify-between w-full bg-[#0a0a0a] border border-blue-500/40 p-5 rounded-[1.8rem] group 
                     shadow-[0_0_40px_rgba(37,99,235,0.1)] transition-all active:scale-95"
        >
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-3.5 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              <Users size={26} className="text-white" />
            </div>
            <span className="text-2xl font-black italic uppercase tracking-tighter">Directory</span>
          </div>
          <ChevronRight size={22} className="text-blue-500/40 group-hover:translate-x-2 transition-transform duration-300" />
        </Link>

        {/* CALL LEASING - Slate Border */}
        <button className="flex items-center justify-between w-full bg-[#0a0a0a] border border-white/10 p-5 rounded-[1.8rem] group active:scale-95 transition-all">
          <div className="flex items-center gap-5">
            <div className="bg-white/5 p-3.5 rounded-2xl">
              <Building2 size={26} className="text-slate-500" />
            </div>
            <span className="text-2xl font-black italic uppercase tracking-tighter text-slate-300">Call Leasing</span>
          </div>
          <ChevronRight size={22} className="text-white/10 group-hover:translate-x-2 transition-transform duration-300" />
        </button>

        {/* PACKAGES - Slate Border */}
        <button className="flex items-center justify-between w-full bg-[#0a0a0a] border border-white/10 p-5 rounded-[1.8rem] group active:scale-95 transition-all">
          <div className="flex items-center gap-5">
            <div className="bg-white/5 p-3.5 rounded-2xl">
              <Package size={26} className="text-slate-500" />
            </div>
            <span className="text-2xl font-black italic uppercase tracking-tighter text-slate-300">Packages</span>
          </div>
          <ChevronRight size={22} className="text-white/10 group-hover:translate-x-2 transition-transform duration-300" />
        </button>

        {/* EMERGENCY - Red Border & Haze */}
        <button className="flex items-center justify-between w-full bg-[#0a0a0a] border border-red-900/40 p-5 rounded-[1.8rem] group 
                     shadow-[0_0_30px_rgba(220,38,38,0.05)] active:scale-95 transition-all">
          <div className="flex items-center gap-5">
            <div className="bg-red-600/20 p-3.5 rounded-2xl text-red-500">
              <AlertTriangle size={26} />
            </div>
            <span className="text-2xl font-black italic uppercase tracking-tighter text-red-600/90">Emergency</span>
          </div>
          <ChevronRight size={22} className="text-red-900/40 group-hover:translate-x-2 transition-transform duration-300" />
        </button>

      </main>

      {/* Footer Branding */}
      <footer className="mt-auto py-8 opacity-10">
        <p className="text-[9px] font-black uppercase tracking-[0.6em]">Gate Guard Security Interface</p>
      </footer>
    </div>
  );
}
