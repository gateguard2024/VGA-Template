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
    const checkIsOpen
