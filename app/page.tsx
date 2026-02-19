"use client";
import React, { useState, useEffect } from 'react';
import { Users, Package, AlertTriangle, Building2, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONFIG } from './config';

export default function VisitorGate() {
  const [isBusinessHours, setIsBusinessHours] = useState(false);

  useEffect(() => {
    const checkHours = () => {
      const now = new Date();
      const day = now.getDay(); 
      const hour = now.getHours();
      let open = false;

      if (day >= 1 && day <= 5) { 
        open = hour >= SITE_CONFIG.hours.weekdays.open && hour < SITE_CONFIG.hours.weekdays.close; 
      } 
      else if (day === 6) { 
        open = hour >= SITE_CONFIG.hours.saturday.open && hour < SITE_CONFIG.hours.saturday.close; 
      } 
      else { 
        open = false; 
      }
      setIsBusinessHours(open);
    };

    checkHours();
    const interval = setInterval(checkHours, 60000);
    return () => clearInterval(interval);
  }, []);

  const officePhone = `tel:${SITE_CONFIG.officePhone}`; 
  const callCenterPhone = `tel:${SITE_CONFIG.emergencyPhone}`; 

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center font-sans selection:bg-blue-600">
      
      {/* BRANDED LOGO HEADER */}
      <div className="mt-4 mb-2 flex flex-col items-center w-full max-w-md text-center">
        <div className="relative w-full flex justify-center drop-shadow-[0_0_35px_rgba(59,130,246,0.3)]">
            <img 
              src="/Logo.jpg" 
              alt={SITE_CONFIG.brandName} 
              className="w-[92%] h-auto object-contain" 
            />
        </div>

        {/* REFINED PROPERTY WELCOME SECTION */}
        <div className="mt-6 mb-6 flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-2">
            Welcome To
          </span>
          <h1 className="text-xl font-black uppercase tracking-tight text-white italic leading-tight">
            {SITE_CONFIG.propertyName}
          </h1>
          <p className="text-xs font-medium text-slate-600 mt-2 tracking-wide uppercase">
            {SITE_CONFIG.propertyAddress}
          </p>
        </div>
        
        {/* STATUS BADGE */}
        <div className={`px-5 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 shadow-2xl ${isBusinessHours ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/40 text-slate-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
          {isBusinessHours ? 'System Active' : 'Secure After-Hours Mode'}
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        
        {/* AFTER-HOURS NOTICE (Only shows when closed) */}
        {!isBusinessHours && (
          <div className="bg-blue-600/5 border border-blue-500/20 p-5 rounded-[2rem] flex items-center gap-4 mb-2 shadow-[0_0_20px_rgba(59,130,246,0.1)] text-left">
            <div className="bg-blue-600/20 p-3 rounded-2xl text-blue-500 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <p className="text-[11px] font-bold text-slate-400 leading-snug uppercase tracking-tight">
              <span className="text-blue-500 block mb-1">Entry Assistance</span>
              Office is closed. Find the resident in the directory below to request gate access.
            </p>
          </div>
        )}
        
        {/* DIRECTORY BUTTON */}
        <Link href="/directory" className="group relative bg-gradient-to-b from-[#111] to-[#000] border border-blue-500/40 flex items-center justify-between p-6 rounded-[2rem] shadow-[0_15px_30px_-10px_rgba(59,130,246,0.3)] active:scale-[0.97] transition-all">
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white">
              <Users size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Directory</span>
          </div>
          <ChevronRight className="text-blue-500/40" size={24} />
        </Link>

        {/* CALL LEASING BUTTON */}
        {isBusinessHours ? (
          <a href={officePhone} className="bg-[#111] border border-white/5 flex items-center justify-between p-5 rounded-[2rem] active:scale-[0.97] transition-all">
            <div className="flex items-center gap-5">
              <div className="bg-white/5 p-3 rounded-2xl text-slate-400">
                <Building2 size={24} />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-100 uppercase">Call Leasing</span>
            </div>
          </a>
        ) : (
          <div className="bg-white/[0.02] border border-white/5 opacity-40 flex items-center justify-between p-5 rounded-[2rem]">
            <div className="flex items-center gap-5 text-left">
              <div className="bg-transparent p-3 rounded-2xl text-slate-700">
                <Clock size={24} />
              </div>
              <span className="text-lg font-bold text-slate-700 uppercase italic tracking-widest">Office Closed</span>
            </div>
          </div>
        )}

        {/* PACKAGES BUTTON */}
        <Link href="/packages" className="bg-[#111] border border-white/5 flex items-center justify-between p-5 rounded-[2rem] active:scale-[0.97] transition-all">
          <div className="flex items-center gap-5">
            <div className="bg-white/5 p-3 rounded-2xl text-slate-400">
              <Package size={24} />
            </div>
            <span className="text-lg font-bold text-slate-300 uppercase tracking-tight">Packages</span>
          </div>
          <ChevronRight className="text-slate-800" size={20} />
        </Link>

        {/* EMERGENCY BUTTON */}
        <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-red-950/10 border border-red-500/20 flex items-center justify-between p-5 rounded-[2rem] active:scale-[0.97] transition-all">
          <div className="flex items-center gap-5">
            <div className="bg-red-500/10 p-3 rounded-2xl text-red-500">
              <AlertTriangle size={24} />
            </div>
            <span className="text-lg font-bold text-red-600 uppercase tracking-tight">Emergency</span>
          </div>
        </a>

      </div>
      
      <footer className="mt-auto py-12 text-[8px] text-slate-800 font-black tracking-[0.8em] uppercase text-center">
        {SITE_CONFIG.footerText}
      </footer>
    </div>
  );
}
