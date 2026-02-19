"use client";
import React, { useState, useEffect } from 'react';
import { Users, Package, AlertTriangle, Building2, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function VisitorGate() {
  const [isBusinessHours, setIsBusinessHours] = useState(false);

  useEffect(() => {
    const checkHours = () => {
      const now = new Date();
      const day = now.getDay(); 
      const hour = now.getHours();

      let open = false;
      if (day >= 1 && day <= 5) {
        open = hour >= 10 && hour < 18; // M-F 10-6
      } else if (day === 6) {
        open = hour >= 10 && hour < 17; // Sat 10-5
      } else {
        open = false; // Sun closed
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
    <div className="min-h-screen bg-[#020617] text-white p-6 flex flex-col items-center font-sans selection:bg-blue-500">
      
      {/* BRANDED LOGO HEADER */}
      <div className="mt-10 mb-12 flex flex-col items-center">
        <div className="w-48 h-48 mb-2 relative drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            {/* UPDATED FILENAME TO Logo.jpg */}
            <img src="/Logo.jpg" alt="Gate Guard Logo" className="w-full h-full object-contain" />
        </div>
        
        <div className={`mt-4 px-5 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-2xl ${isBusinessHours ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/50 text-slate-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
          {isBusinessHours ? 'System Status: Active' : 'After-Hours Secure Mode'}
        </div>
      </div>

      <div className="w-full max-w-md space-y-5">
        
        {/* BUTTON: DIRECTORY (Primary Blue Branded) */}
        <Link href="/directory" className="group relative bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-400/30 flex items-center justify-between p-6 rounded-[2rem] shadow-[0_10px_30px_-10px_rgba(30,64,175,0.5)] active:scale-[0.97] transition-all overflow-hidden">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-black/20 p-3 rounded-2xl">
              <Users size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight uppercase">Directory</span>
          </div>
          <ShieldCheck className="text-white/40 relative z-10" size={24} />
        </Link>

        {/* BUTTON: CALL LEASING */}
        {isBusinessHours ? (
          <a href={officePhone} className="bg-[#1e293b]/50 border border-white/10 backdrop-blur-md flex items-center justify-between p-6 rounded-[2rem] active:scale-[0.97] transition-all">
            <div className="flex items-center gap-5">
              <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-400">
                <Building2 size={28} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-100">Call Leasing Office</span>
            </div>
          </a>
        ) : (
          <div className="bg-slate-900/30 border border-white/5 opacity-50 flex items-center justify-between p-6 rounded-[2rem]">
            <div className="flex items-center gap-5">
              <div className="bg-slate-800 p-3 rounded-2xl text-slate-600">
                <Clock size={28} />
              </div>
              <div>
                <span className="text-xl font-bold block leading-none text-slate-500">Office Closed</span>
                <span className="text-[10px] font-black uppercase mt-1.5 block tracking-widest text-slate-600">Reopens at 10 AM</span>
              </div>
            </div>
          </div>
        )}

        {/* BUTTON: PACKAGES */}
        <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-[#1e293b]/50 border border-white/10 backdrop-blur-md flex items-center justify-between p-6 rounded-[2rem] active:scale-[0.97] transition-all">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500">
              <Package size={28} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-100">Package Delivery</span>
          </div>
        </a>

        {/* BUTTON: EMERGENCY */}
        <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-red-950/20 border border-red-500/30 flex items-center justify-between p-6 rounded-[2rem] active:scale-[0.97] transition-all">
          <div className="flex items-center gap-5">
            <div className="bg-red-500/10 p-3 rounded-2xl text-red-500">
              <AlertTriangle size={28} />
            </div>
            <span className="text-xl font-bold tracking-tight text-red-500">Emergency</span>
          </div>
        </a>

      </div>
      
      <footer className="mt-auto py-12 text-[10px] text-slate-700 font-black tracking-[0.5em] uppercase text-center opacity-50">
        Gate Guard Security Interface
      </footer>
    </div>
  );
}
