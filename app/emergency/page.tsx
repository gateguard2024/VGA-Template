"use client";
import React, { useState } from 'react';
import { AlertTriangle, Phone, ArrowLeft, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from '../config';

// --- TWILIO BRIDGE MODAL (Red Theme for Emergency) ---
const EmergencyPhoneModal = ({ isOpen, onClose, onConfirm }: any) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1a0505] border border-red-500/20 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-red-500">Call Dispatch</h3>
            <p className="text-red-900 text-[10px] font-bold uppercase tracking-widest mt-1">After-Hours Assistance</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-red-500/50 hover:bg-white/10 transition"><X size={20}/></button>
        </div>
        
        <input 
          type="text" 
          placeholder="Your Full Name"
          className="w-full bg-black border border-red-500/20 p-5 rounded-2xl text-xl text-center font-black text-white outline-none mb-4 focus:border-red-500/50 transition-colors"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder="(770) 000-0000"
          className="w-full bg-black border border-red-500/20 p-5 rounded-2xl text-2xl text-center font-black text-white outline-none mb-6 focus:border-red-500/50 transition-colors"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button 
          onClick={() => onConfirm(name, number)}
          disabled={number.length < 10 || name.trim() === ''}
          className="w-full bg-red-600 py-5 rounded-2xl font-black uppercase italic text-sm disabled:opacity-30 text-white transition-opacity"
        >
          Initiate Dispatch Call
        </button>
      </div>
    </div>
  );
};

export default function EmergencyPage() {
  const router = useRouter();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const handleEmergencyCall = async (visitorName: string, visitorPhone: string) => {
    setIsEmergencyModalOpen(false);
    try {
      await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          visitorName: visitorName,
          visitorPhone: `+1${visitorPhone.replace(/\D/g, '')}`, 
          residentPhone: `+1${SITE_CONFIG.emergencyPhone}`, // Pulls the After-Hours number from config!
          residentName: "After-Hours Dispatch" // Logs specifically to Google Sheets
        })
      });
      alert("Call initiated! Answer your phone to connect to the After-Hours Call Center.");
    } catch (e) {
      alert("Error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center font-sans overflow-hidden">
      
      <EmergencyPhoneModal 
        isOpen={isEmergencyModalOpen} 
        onClose={() => setIsEmergencyModalOpen(false)} 
        onConfirm={handleEmergencyCall} 
      />

      <div className="w-full max-w-md p-6 flex flex-col flex-grow">
        
        {/* HEADER SECTION */}
        <header className="w-full flex items-center justify-between mb-8 pt-4">
          <button onClick={() => router.push('/')} className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:bg-white/10 transition">
            <ArrowLeft size={24} />
          </button>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">Emergency</span>
            <div className="text-[9px] font-bold text-slate-700 uppercase">{SITE_CONFIG.propertyName}</div>
          </div>
        </header>

        {/* 911 WARNING BOX */}
        <div className="w-full bg-red-950/20 border border-red-500/30 p-8 rounded-[2.5rem] mb-8 relative overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 rounded-full blur-3xl -mt-10"></div>
          
          <div className="flex justify-center mb-6 relative z-10">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-4 relative z-10">DIAL 911</h2>
          
          <p className="text-red-200/80 text-sm leading-relaxed font-medium relative z-10">
            If you are experiencing a medical emergency, fire, or an immediate threat to life or property safety, please call 911 immediately.
          </p>
        </div>

        {/* BUTTON LAYOUT */}
        <div className="w-full space-y-4">
          
          {/* AFTER-HOURS BUTTON */}
          <button 
            onClick={() => setIsEmergencyModalOpen(true)}
            className="w-full bg-[#1a0505] border border-red-500/50 p-5 rounded-[2.5rem] flex items-center justify-between group hover:bg-red-900/20 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                <Phone size={20} className="text-white" />
              </div>
              <div className="text-left">
                <span className="text-xl font-black uppercase italic tracking-tighter text-white block leading-none">After-Hours</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 mt-1 block">Property Emergencies</span>
              </div>
            </div>
            <ChevronRight size={20} className="text-red-500 group-hover:translate-x-1 transition-transform" />
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
