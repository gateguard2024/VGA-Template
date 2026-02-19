"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, ArrowLeft, Loader2, Lock, EyeOff, ShieldCheck, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONFIG } from '../config';

// --- NEW STYLISH MODAL COMPONENT ---
const VisitorPhoneModal = ({ isOpen, onClose, onConfirm, residentName }: any) => {
  const [number, setNumber] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-blue-500">Connect to Resident</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Calling {residentName}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-500 hover:text-white"><X size={20}/></button>
        </div>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          To protect resident privacy, the system will bridge this call. Please enter your mobile number to receive the connection.
        </p>

        <input 
          type="tel" 
          placeholder="(770) 000-0000"
          className="w-full bg-black border border-white/5 p-5 rounded-2xl text-2xl text-center font-black tracking-widest text-white outline-none focus:border-blue-500/50 transition-all mb-6"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />

        <button 
          onClick={() => onConfirm(number)}
          disabled={number.length < 10}
          className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-[0.2em] italic text-sm hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-30"
        >
          Initiate Secure Call
        </button>
      </div>
    </div>
  );
};

export default function SecureDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [callingId, setCallingId] = useState<string | null>(null);
  const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  // GPS Logic
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 39
