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
    <div className="min-h-screen bg-[#02040a] text-white p-6 flex flex-col items-center font-sans">
      
      {/* BRANDED LOGO HEADER - SCALED FOR MOBILE */}
      <div className="mt-6 mb-8 flex flex-col items-center w-full max-w-[280px]">
        <div className="w-full relative drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            {/* max-h-40 keeps it from taking over the whole screen */}
            <img 
              src="/Logo.jpg" 
              alt="Gate Guard Logo" 
              className="w-full h-auto max-h-40 object-contain mx-auto" 
            />
        </div>
        
        <div className={`mt-6 px-5 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 shadow-2xl ${isBusinessHours ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-slate-800 bg-slate-900/50 text-slate-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`}></div>
          {isBusinessHours ? 'System Active' : 'Secure After-Hours'}
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        
        {/* BUTTON: DIRECTORY */}
        <Link href="/directory" className="group relative bg-gradient-to-br from-[#0f172a] to-[#020617] border border-blue-500/40 flex items-center justify-between p-6 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(59,130,246,0.4)] active:scale-[0.97] transition-all">
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400">
              <Users size={28} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight uppercase italic">Directory</span>
          </div>
          <ShieldCheck className="text-blue-500/20" size={24} />
        </Link>

        {/* BUTTON: CALL LEASING */}
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
          <div className="bg-white/5 border border-white/5 opacity-40 flex items-center justify-between p-5 rounded-[2rem]">
            <div className="flex items-center gap-5">
              <div className="bg-transparent p-3 rounded-2xl text-slate-600">
                <Clock size={24} />
              </div>
              <span className="text-lg font-bold text-slate-500 uppercase italic">Office Closed</span>
            </div>
          </div>
        )}

        {/* SECONDARY ROW */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-[#111] border border-white/5 flex items-center justify-between p-5 rounded-[2rem] active:scale-[0.97] transition-all">
            <div className="flex items-center gap-5">
              <div className="bg-white/5 p-3 rounded-2xl text-slate-400">
                <Package size={24} />
              </div>
              <span className="text-lg font-bold text-slate-200 uppercase tracking-tight">Packages</span>
            </div>
          </a>

          <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-red-950/10 border border-red-500/20 flex items-center justify-between p-5 rounded-[2rem] active:scale-[0.97] transition-all">
            <div className="flex items-center gap-5">
              <div className="bg-red-500/10 p-3 rounded-2xl text-red-500">
                <AlertTriangle size={24} />
              </div>
              <span className="text-lg font-bold text-red-500 uppercase tracking-tight">Emergency</span>
            </div>
          </a>
        </div>

      </div>
      
      <footer className="mt-auto py-10 text-[9px] text-slate-800 font-black tracking-[0.6em] uppercase text-center">
        Gate Guard Security
      </footer>
    </div>
  );
}
