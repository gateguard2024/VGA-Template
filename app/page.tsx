"use client";
import React, { useState, useEffect } from 'react';
import { Users, Package, AlertTriangle, Building2, Clock, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center font-sans overflow-x-hidden">
      
      {/* Dynamic Status Header */}
      <div className={`w-full max-w-md mb-8 px-5 py-3 rounded-2xl flex items-center justify-between shadow-sm border ${isBusinessHours ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Status</p>
          <p className={`text-sm font-bold ${isBusinessHours ? 'text-emerald-700' : 'text-amber-700'}`}>
            Office is {isBusinessHours ? 'Open' : 'Closed'}
          </p>
        </div>
        <div className={`w-3 h-3 rounded-full ${isBusinessHours ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></div>
      </div>

      <header className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Gate<br/>Access</h1>
        <p className="text-slate-400 font-bold text-[11px] mt-3 tracking-widest uppercase">700 Rock Quarry Road</p>
      </header>

      <div className="w-full max-w-md space-y-5">
        
        {/* SECTION: OFFICE CALLING */}
        <div className="space-y-3">
          {isBusinessHours ? (
            <a href={officePhone} className="bg-blue-600 flex items-center justify-between p-6 rounded-[2rem] text-white shadow-xl shadow-blue-200 active:scale-[0.98] transition-all">
              <span className="text-xl font-bold">Call Leasing Office</span>
              <div className="bg-white/20 p-3 rounded-2xl"><Building2 /></div>
            </a>
          ) : (
            <div className="bg-white border-2 border-slate-200 flex items-center justify-between p-6 rounded-[2rem] text-slate-400 shadow-sm">
              <div className="text-left">
                <span className="text-xl font-bold block leading-none">Office Closed</span>
                <span className="text-[10px] font-extrabold uppercase mt-2 block opacity-50 tracking-wider">Reopens at 10:00 AM</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-300"><Clock /></div>
            </div>
          )}
        </div>

        {/* SECTION: DIRECTORY (Separated with more margin) */}
        <div className="pt-2">
          <Link href="/directory" className="bg-slate-900 flex items-center justify-between p-6 rounded-[2rem] text-white shadow-2xl active:scale-[0.98] transition-all">
            <span className="text-xl font-bold">Resident Directory</span>
            <div className="bg-white/10 p-3 rounded-2xl text-white/70"><Users /></div>
          </Link>
        </div>

        {/* SECTION: SERVICE BUTTONS */}
        <div className="grid grid-cols-1 gap-4 pt-2">
          <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-emerald-600 flex items-center justify-between p-6 rounded-[2rem] text-white shadow-lg active:scale-[0.98] transition-all">
            <span className="text-xl font-bold">Packages</span>
            <div className="bg-white/20 p-3 rounded-2xl"><Package /></div>
          </a>

          <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-red-600 flex items-center justify-between p-6 rounded-[2rem] text-white shadow-lg shadow-red-100 active:scale-[0.98] transition-all">
            <span className="text-xl font-bold">Emergency</span>
            <div className="bg-white/20 p-3 rounded-2xl"><AlertTriangle /></div>
          </a>
        </div>

      </div>
      
      <footer className="mt-auto py-10 text-[10px] text-slate-300 font-bold tracking-[0.4em] uppercase text-center">
        Powered by VGA Smart-Gate
      </footer>
    </div>
  );
}
