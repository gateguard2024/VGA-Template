"use client";
import React, { useState, useEffect } from 'react';
import { Users, Phone, Package, AlertTriangle, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from './config';

// --- TWILIO BRIDGE MODAL (For Leasing Office) ---
const LeasingPhoneModal = ({ isOpen, onClose, onConfirm }: any) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-500">Call Leasing Office</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Visitor Registration</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-500 hover:bg-white/10"><X size={20}/></button>
        </div>
        
        <input 
          type="text" 
          placeholder="Full Name"
          className="w-full bg-black border border-white/10 p-4 rounded-2xl text-lg text-center font-bold text-white outline-none mb-3 focus:border-blue-500/50"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <input 
          type="email" 
          placeholder="Email Address"
          className="w-full bg-black border border-white/10 p-4 rounded-2xl text-lg text-center font-bold text-white outline-none mb-3 focus:border-blue-500/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type="tel" 
          placeholder="Mobile Number"
          className="w-full bg-black border border-white/10 p-4 rounded-2xl text-lg text-center font-bold text-white outline-none mb-3 focus:border-blue-500/50"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />

        <select
          className="w-full bg-black border border-white/10 p-4 rounded-2xl text-lg text-center font-bold text-slate-300 outline-none mb-6 focus:border-blue-500/50 appearance-none"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="" disabled>Select Reason for Visit</option>
          <option value="Interest in Leasing">Interest in Leasing</option>
          <option value="Package / Delivery Courier">Package / Delivery Courier</option>
          <option value="Current Resident Support">Current Resident Support</option>
          <option value="Maintenance / Vendor">Maintenance / Vendor</option>
          <option value="General Inquiry">General Inquiry</option>
        </select>

        <button 
          onClick={() => onConfirm(name, number, email, reason)}
          disabled={number.length < 10 || name.trim() === '' || email.trim() === '' || reason === ''}
          className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase italic text-sm disabled:opacity-30 text-white transition-opacity"
        >
          Initiate Secure Call
        </button>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [isLeasingModalOpen, setIsLeasingModalOpen] = useState(false);
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);

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

  const handleLeasingCall = async (visitorName: string, visitorPhone: string, email: string, reason: string) => {
    setIsLeasingModalOpen(false);
    try {
      await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          visitorName,
          visitorPhone: `+1${visitorPhone.replace(/\D/g, '')}`, 
          residentPhone: `+1${SITE_CONFIG.officePhone}`, 
          residentName: "Leasing Office",
          email,        // NEW: Sending email to switchboard
          reason        // NEW: Sending reason to switchboard
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

      <div className="w-full max-w-md p-6 flex flex-col items-center flex-grow pt-12">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Welcome To</p>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">
            {SITE_CONFIG.propertyName}
          </h1>
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            {SITE_CONFIG.propertyAddress}
          </p>
        </div>

        {/* SYSTEM ACTIVE PILL */}
        <div className="w-full flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500">System Active</span>
          </div>
        </div>

        {/* BUTTON LAYOUT */}
        <div className="w-full space-y-4">
          
          <button onClick={() => router.push('/directory')} className="w-full bg-[#0a0a0a] border border-blue-500/40 p-5 rounded-[2.5rem] flex items-center justify-between group hover:bg-blue-900/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <Users size={20} className="text-white" />
              </div>
              <span className="text-xl font-black uppercase italic tracking-tighter text-white">Directory</span>
            </div>
            <ChevronRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
          </button>

          <button onClick={() => isOfficeOpen ? setIsLeasingModalOpen(true) : null} className={`w-full bg-[#0a0a0a] border p-5 rounded-[2.5rem] flex items-center justify-between transition-all ${!isOfficeOpen ? 'border-red-900/30 opacity-50 cursor-not-allowed' : 'border-slate-500/40 hover:bg-white/5 cursor-pointer'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <Phone size={20} className={isOfficeOpen ? "text-slate-300" : "text-slate-600"} />
              </div>
              <div className="text-left">
                <span className="text-xl font-black uppercase italic tracking-tighter text-white block leading-none">Call Leasing</span>
                {!isOfficeOpen && <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-1 block">Office Closed</span>}
              </div>
            </div>
            {isOfficeOpen && <ChevronRight size={20} className="text-slate-600" />}
          </button>

          <button onClick={() => router.push('/packages')} className="w-full bg-[#0a0a0a] border border-slate-500/40 p-5 rounded-[2.5rem] flex items-center justify-between hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <Package size={20} className="text-slate-300" />
              </div>
              <span className="text-xl font-black uppercase italic tracking-tighter text-white">Packages</span>
            </div>
            <ChevronRight size={20} className="text-slate-600" />
          </button>

          <button onClick={() => router.push('/emergency')} className="w-full bg-[#1a0505] border border-red-500/50 p-5 rounded-[2.5rem] flex items-center justify-between hover:bg-red-950/40 transition-all mt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <span className="text-xl font-black uppercase italic tracking-tighter text-red-500">Emergency</span>
            </div>
            <ChevronRight size={20} className="text-red-900" />
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
