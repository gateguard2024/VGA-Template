"use client";
import React from 'react';
import { Package, MapPin, Phone, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PackageInstructions() {
  const officePhone = "770-525-6055";
  
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center font-sans">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl text-slate-400">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Delivery Portal</span>
          <span className="text-xs font-bold text-slate-500">700 Rock Quarry Rd</span>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Hero Icon */}
        <div className="flex justify-center py-4">
          <div className="bg-blue-600/20 p-6 rounded-[2.5rem] shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <Package size={64} className="text-blue-500" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-center uppercase italic tracking-tighter">Delivery<br/>Instructions</h1>

        {/* Instruction Cards */}
        <div className="space-y-3">
          <div className="bg-[#111] border border-white/5 p-5 rounded-3xl flex items-start gap-4">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500 mt-1">
              <MapPin size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-200 uppercase text-sm tracking-wide">Drop-off Point</p>
              <p className="text-slate-400 text-sm leading-relaxed">Please deliver all packages to the **Leasing Office** during business hours.</p>
            </div>
          </div>

          <div className="bg-[#111] border border-white/5 p-5 rounded-3xl flex items-start gap-4">
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500 mt-1">
              <Clock size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-200 uppercase text-sm tracking-wide">Office Hours</p>
              <p className="text-slate-400 text-sm italic">M-F: 10am - 6pm | Sat: 10am - 5pm</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <p className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Need Gate Access?</p>
          <a 
            href={`tel:${officePhone}`} 
            className="bg-blue-600 flex items-center justify-center gap-3 p-6 rounded-[2rem] text-white shadow-[0_15px_30px_-10px_rgba(37,99,235,0.4)] active:scale-95 transition-all"
          >
            <Phone size={24} fill="currentColor" />
            <span className="text-xl font-black uppercase tracking-tight">Call for Access</span>
          </a>
        </div>
      </div>

      <footer className="mt-auto py-10 flex items-center gap-2 opacity-30">
        <ShieldCheck size={14} className="text-blue-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Gate Guard Secure</span>
      </footer>
    </div>
  );
}
