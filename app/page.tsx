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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 flex flex-col items-center font-sans">
      
      {/* BRANDED LOGO HEADER */}
      <div className="mt-8 mb-12 flex flex-col items-center">
        <div className="w-32 h-32 mb-4 relative">
            {/* Replace /logo.png with your actual uploaded path */}
            <img src="/Logo.jpg" alt="Gate Guard Logo" className="w-full h-full object-contain" />
        </div>
        <div className={`px-4 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${isBusinessHours ? 'border-blue-500/50 text-blue-400' : 'border-slate-700 text-slate-500'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isBusinessHours ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'}`}></div>
          {isBusinessHours ? 'Secure Entry: Active' : 'After-Hours Mode'}
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        
        {/* BUTTON: DIRECTORY (High Contrast / Most Important) */}
        <Link href="/directory" className="group relative bg-gradient-to-b from-[#1a1a1a] to-[#000000] border border-blue-500/30 flex items-center justify-between p-6 rounded-2xl shadow-[0_0_20px_rgba(0,112,243,0.1)] active:scale-[0.98] transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500 group-active:bg-blue-500 group-active:text-white transition-colors">
              <Users size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">Resident Directory</span>
          </div>
          <ShieldCheck className="text-blue-500/30" size={20} />
        </Link>

        {/* BUTTON: CALL LEASING */}
        {isBusinessHours ? (
          <a href={officePhone} className="bg-[#111] border border-white/5 flex items-center justify-between p-6 rounded-2xl active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-white/5 p-3 rounded-xl text-slate-300">
                <Building2 size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-200">Call Leasing Office</span>
            </div>
          </a>
        ) : (
          <div className="bg-[#0f0f0f] border border-white/5 opacity-40 flex items-center justify-between p-6 rounded-2xl grayscale">
            <div className="flex items-center gap-4">
              <div className="bg-white/5 p-3 rounded-xl">
                <Clock size={24} />
              </div>
              <div>
                <span className="text-xl font-bold block leading-none text-slate-400">Office Closed</span>
                <span className="text-[10px] font-bold uppercase mt-1 block tracking-wider">Opens at 10 AM</span>
              </div>
            </div>
          </div>
        )}

        {/* GRID FOR SECONDARY OPTIONS */}
        <div className="grid grid-cols-1 gap-4">
          <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-[#111] border border-white/5 flex items-center justify-between p-6 rounded-2xl active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-white/5 p-3 rounded-xl text-slate-300">
                <Package size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-200">Packages</span>
            </div>
          </a>

          <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-[#111] border border-red-500/20 flex items-center justify-between p-6 rounded-2xl active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-red-500/10 p-3 rounded-xl text-red-500 font-bold">
                <AlertTriangle size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-red-500">Emergency</span>
            </div>
          </a>
        </div>

      </div>
      
      <footer className="mt-auto py-10 text-[9px] text-slate-600 font-bold tracking-[0.5em] uppercase text-center">
        Protected by Gate Guard Security
      </footer>
    </div>
  );
}
