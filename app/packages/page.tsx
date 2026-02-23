"use client";
import React, { useState, useEffect } from 'react';
import { Package, Phone, Users, ArrowLeft, X, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from '../config';

// --- TWILIO BRIDGE MODAL (For Leasing Office) ---
const LeasingPhoneModal = ({ isOpen, onClose, onConfirm }: any) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-500">Call Leasing Office</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Secure Connection</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-500"><X size={20}/></button>
        </div>
        
        <input 
          type="text" 
          placeholder="Driver / Courier Name"
          className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xl text-center font-black text-white outline-none mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder="Mobile Number"
          className="w-full bg-black border border-white/10 p-5 rounded-2xl text-2xl text-center font-black text-white outline-none mb-6"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button 
          onClick={() => onConfirm(name, number)}
          disabled={number.length < 10 || name.trim() === ''}
          className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase italic text-sm disabled:opacity-30 text-white transition-opacity"
        >
          Initiate Secure Call
        </button>
      </div>
    </div>
  );
};

export default function PackagesPage() {
  const router = useRouter();
  const [isLeasingModalOpen, setIsLeasingModalOpen] = useState(false);
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);

  // Intelligently check your specific Config hours
  useEffect(() => {
    const checkIsOpen = () => {
      const now = new Date();
      const day = now.getDay(); 
      const hour = now.getHours();
      
      const { hours } = SITE_CONFIG;

      if (day === 0) return !hours.sunday.closed; 
      if (day === 6) return hour >= hours.saturday.open && hour < hours.saturday.close;
      return hour >= hours.weekdays.open && hour < hours.weekdays.close;
    };
    
    setIsOfficeOpen(checkIsOpen());
  }, []);

  const handleLeasingCall = async (visitorName: string, visitorPhone: string) => {
    setIsLeasingModalOpen(false);
    try {
      await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          visitorName: visitorName,
          visitorPhone: `+1${visitorPhone.replace(/\D/g, '')}`, 
          residentPhone: `+1${SITE_CONFIG.officePhone}`, 
          residentName: "Leasing Office (Delivery)" 
        })
      });
      alert("Call initiated! Answer your phone to connect to the Leasing Office.");
    } catch (e) {
      alert("Error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center font-sans overflow-hidden">
      
      <LeasingPhoneModal 
        isOpen={isLeasingModalOpen} 
        onClose={() => setIsLeasingModalOpen(false)} 
        onConfirm={handleLeasingCall} 
      />

      <div className="w-full max-w-md p-6 flex flex-col flex-grow">
        
        {/* HEADER SECTION */}
        <header className="w-full flex items-center justify-between mb-8 pt-4">
          <button onClick={() => router.push('/')} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:bg-white/10 transition">
            <ArrowLeft size={24} />
          </button>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Deliveries</span>
            <div className="text-[9px] font-bold text-slate-700 uppercase">{SITE_CONFIG.propertyName}</div>
          </div>
        </header>

        {/* INSTRUCTIONS BOX */}
        <div className="w-full bg-[#0a0a0a] border border-blue-500/20 p-6 rounded-[2.5rem] mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-3 mb-4">
            <Info size={20} className="text-blue-500" />
            <h2 className="text-lg font-black uppercase italic tracking-tighter text-white">Delivery Protocol</h2>
          </div>
          
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            {SITE_CONFIG.deliveryInstructions}
          </p>
        </div>

        {/* BUTTON LAYOUT */}
        <div className="w-full space-y-4">
          
          {/* 1. CALL LEASING BUTTON */}
          <button 
            onClick={() => isOfficeOpen ? setIsLeasingModalOpen(true) : null}
            className={`w-full bg-[#0a0a0a] border p-5 rounded-[2.5rem] flex items-center justify-between transition-all ${!isOfficeOpen ? 'border-red-900/30 opacity-50 cursor-not-allowed' : 'border-slate-500/40 hover:bg-white/5 cursor-pointer'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <Phone size={20} className={isOfficeOpen ? "text-slate-300" : "text-slate-600"} />
              </div>
              <div className="text-left">
                <span className="text-xl font-black uppercase italic tracking-tighter text-white block leading-none">Call Office</span>
                {!isOfficeOpen && <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-1 block">Office Closed</span>}
                {isOfficeOpen && <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1 block">Assistance</span>}
              </div>
            </div>
            {isOfficeOpen && <ChevronRight size={20} className="text-slate-600" />}
          </button>

          {/* 2. DIRECTORY BUTTON */}
          <button 
            onClick={() => router.push('/directory')}
            className="w-full bg-[#0a0a0a] border border-blue-500/40 p-5 rounded-[2.5rem] flex items-center justify-between group hover:bg-blue-900/10 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <Users size={20} className="text-white" />
              </div>
              <div className="text-left">
                <span className="text-xl font-black uppercase italic tracking-tighter text-white block leading-none">Find Resident</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1 block">Directory Search</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

        <footer className="mt-auto py-8 opacity-20 flex items-center justify-center gap-2">
          <ShieldCheck size={12} className="text-white" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em]">{SITE_CONFIG.footerText}</span>
        </footer>

      </div>
    </div>
  );
}
