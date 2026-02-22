"use client";
import React, { useState, useEffect } from 'react';
import { Users, Phone, Package, AlertTriangle, ChevronRight, X, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from './config';

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
          placeholder="Your Full Name"
          className="w-full bg-black border border-white/10 p-5 rounded-2xl text-xl text-center font-black text-white outline-none mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder="(770) 000-0000"
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

export default function LandingPage() {
  const router = useRouter();
  const [isLeasingModalOpen, setIsLeasingModalOpen] = useState(false);
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);

  // Intelligently check your specific Config hours
  useEffect(() => {
    const checkIsOpen = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday, 6 is Saturday
      const hour = now.getHours();
      
      const { hours } = SITE_CONFIG;

      if (day === 0) return !hours.sunday.closed; // Sunday check
      
      if (day === 6) { // Saturday check
        return hour >= hours.saturday.open && hour < hours.saturday.close;
      }
      
      // Weekday check (1-5)
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
          residentPhone: `+1${SITE_CONFIG.officePhone}`, // Grabs from config and formats for Twilio
          residentName: "Leasing Office" 
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
          <p className="
