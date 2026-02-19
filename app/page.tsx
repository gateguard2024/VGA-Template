"use client";
import React, { useState, useEffect } from 'react';
import { Phone, Users, Package, AlertTriangle, Building2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function VisitorGate() {
  const [isBusinessHours, setIsBusinessHours] = useState(false);

  useEffect(() => {
    const checkHours = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sun, 1-5 = M-F, 6 = Sat
      const hour = now.getHours();

      let open = false;

      if (day >= 1 && day <= 5) {
        // Mon-Fri: 10am to 6pm
        open = hour >= 10 && hour < 18;
      } else if (day === 6) {
        // Sat: 10am to 5pm
        open = hour >= 10 && hour < 17;
      } else {
        // Sun: Closed
        open = false;
      }
      
      setIsBusinessHours(open);
    };
    
    checkHours();
    // Re-check every minute in case someone is on the page when the office opens/closes
    const interval = setInterval(checkHours, 60000);
    return () => clearInterval(interval);
  }, []);

  const officePhone = "tel:7705256055"; 
  const callCenterPhone = "tel:5550999"; // Replace with your actual Call Center #

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center font-sans">
      {/* Status Badge */}
      <div className={`mb-6 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${isBusinessHours ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
        <div className={`w-2 h-2 rounded-full ${isBusinessHours ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
        Office Status: {isBusinessHours ? 'Open' : 'Closed'}
      </div>

      <header className="mb-10 text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Gate Access</h1>
        <p className="text-slate-500 font-medium text-sm">700 Rock Quarry Road</p>
      </header>

      <div className="w-full max-w-md space-y-4">
        
        {/* BUTTON 1: CALL LEASING */}
        {isBusinessHours ? (
          <a href={officePhone} className="bg-blue-600 flex items-center justify-between p-6 rounded-3xl text-white shadow-xl active:scale-95 transition-all">
            <span className="text-xl font-bold">Call Leasing Office</span>
            <div className="bg-white/20 p-3 rounded-2xl"><Building2 /></div>
          </a>
        ) : (
          <button 
            onClick={() => alert("The Leasing Office is currently closed. For immediate assistance, please use the Emergency or Package options below.")}
            className="bg-white border-2 border-slate-200 flex items-center justify-between p-6 rounded-3xl text-slate-400 w-full cursor-not-allowed shadow-sm"
          >
            <div className="text-left">
              <span className="text-xl font-bold block leading-none">Office Closed</span>
              <span className="text-[10px] font-bold uppercase mt-1 block opacity-60">Opens at 10:00 AM</span>
            </div>
            <div className="bg-slate-100 p-3 rounded-2xl text-slate-300"><Clock /></div>
          </button>
        )}

        {/* BUTTON 2: DIRECTORY */}
        <Link href="/directory" className="bg-slate-900 flex items-center justify-between p-6 rounded-3xl text-white shadow-xl active:scale-95 transition-all">
          <span className="text-xl font-bold">Resident Directory</span>
          <div className="bg-white/10 p-3 rounded-2xl"><Users /></div>
        </Link>

        {/* BUTTON 3: PACKAGES */}
        <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-emerald-600 flex items-center justify-between p-6 rounded-3xl text-white shadow-xl active:scale-95 transition-all">
          <span className="text-xl font-bold">Packages / Deliveries</span>
          <div className="bg-white/20 p-3 rounded-2xl"><Package /></div>
        </a>

        {/* BUTTON 4: EMERGENCY */}
        <a href={isBusinessHours ? officePhone : callCenterPhone} className="bg-red-600 flex items-center justify-between p-6 rounded-3xl text-white shadow-xl active:scale-95 transition-all">
          <span className="text-xl font-bold">Emergency / After Hours</span>
          <div className="bg-white/20 p-3 rounded-2xl"><AlertTriangle /></div>
        </a>

      </div>
      
      <footer className="mt-auto py-8 text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
        Visitor Management System
      </footer>
    </div>
  );
}
