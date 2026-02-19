"use client";
import React, { useState, useEffect } from 'react';
import { Users, Package, AlertTriangle, Building2, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function VisitorGate() {
  const [isBusinessHours, setIsBusinessHours] = useState(false);

  useEffect(() => {
    const checkHours = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sun, 1-5 = M-F, 6 = Sat
      const hour = now.getHours();

      let open = false;
      // M-F 10am to 6pm
      if (day >= 1 && day <= 5) {
        open = hour >= 10 && hour < 18;
      } 
      // Sat 10am to 5pm
      else if (day === 6) {
        open = hour >= 10 && hour < 17;
      } 
      // Sun Closed
      else {
        open = false;
      }
      
      setIsBusinessHours(open);
    };
    
    checkHours();
    const interval = setInterval(checkHours, 60000);
    return () => clearInterval(interval);
  }, []);

  const officePhone = "tel:7705256055"; 
  const callCenterPhone = "tel:5550999"; 

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center font-sans selection:bg-blue-600">
      
      {/* BRANDED LOGO HEADER - FULL WIDTH ALIGNMENT */}
      <div className="mt-4 mb-4 flex flex-col items-center w-full max-w-md text-center">
        <div className="relative w-full flex justify-center drop-shadow-[0_0_35px_rgba(59,130,246,0.3)]">
            <img 
              src="/Logo.jpg" 
              alt="Gate Guard Logo" 
              className="w-[92%] h-auto object-contain" 
            />
        </div>
        
        <div className={`mt-4 px-5 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2 shadow-2xl ${isBusinessHours ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/40 text-slate-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
          {isBusinessHours ? 'System Active' : 'Secure After-Hours Mode'}
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">

        {/* AFTER-HOURS NOTICE (Only shows when closed) */}
        {!isBusinessHours && (
          <div className="bg-blue-600/5 border border-blue-500/20 p-5 rounded-[2rem] flex items-center gap-4 mb-2 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <div className="bg-blue-600/20 p-3 rounded-2xl text-blue-500 shrink-0">
              <ShieldCheck size={24} />
            </div>
            <p className="text-xs font-bold text-slate-300 leading-snug uppercase tracking-tight">
              <span className="text-blue-400 block mb-1">Entry Assistance</span>
              Office is closed. Please find the resident in the directory below to request gate access.
            </p>
          </div>
        )}
        
        {/* 1. DIRECTORY BUTTON */}
        <Link href="/directory" className="group relative bg-gradient-to-b from-[#111] to-[#000] border border-blue-500/40 flex items-center justify-between p-6 rounded-[2rem] shadow-[0_15px_30px_-10px_rgba(59,130,246,0.3)] active:scale-[0.97] transition-all">
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.4)] text-white">
              <Users size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Directory</span>
          </div>
          <ChevronRight className="text-blue-500/40" size={24} />
        </Link>

        {/* 2. CALL LEASING BUTTON */}
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
            <div className="flex items-center gap-5">
              <div className="bg-transparent p-3 rounded-2xl text-slate-700">
                <Clock size={24} />
              </div>
              <span className="text-lg font-bold text-slate-600 uppercase italic">Office Closed</span>
            </div>
          </div>
        )}
