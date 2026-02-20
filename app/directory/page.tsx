"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, ArrowLeft, Loader2, Lock, EyeOff, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONFIG } from '../config';

// --- STYLISH PHONE BRIDGE MODAL ---
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
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
            <X size={20}/>
          </button>
        </div>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          To protect resident privacy, the system will bridge this call. Enter your mobile number to receive the secure connection.
        </p>
        <input 
          type="tel" 
          placeholder="(770) 000-0000"
          className="w-full bg-black border border-white/10 p-5 rounded-2xl text-2xl text-center font-black tracking-widest text-white outline-none focus:border-blue-500/50 transition-all mb-6"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button 
          onClick={() => onConfirm(number)}
          disabled={number.length < 10}
          className="w-full bg-blue-600 py-5 rounded-2xl font-black uppercase tracking-[0.2em] italic text-sm hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-30 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    const pinwheelTimer = setTimeout(() => {
      if (isWithinRange === null) setIsWithinRange(false);
    }, 8000);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(pinwheelTimer);
          const dist = getDistance(position.coords.latitude, position.coords.longitude, SITE_CONFIG.location.lat, SITE_CONFIG.location.lng);
          setIsWithinRange(dist <= SITE_CONFIG.location.radius);
        },
        () => {
          clearTimeout(pinwheelTimer);
          setIsWithinRange(false);
        },
        { enableHighAccuracy: true, timeout: 7000 }
      );
    } else {
      clearTimeout(pinwheelTimer);
      setIsWithinRange(false);
    }

    async function fetchResidents() {
      try {
        const response = await fetch('/api/brivo', { cache: 'no-store' });
        const data = await response.json();
        setResidents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchResidents();
    return () => clearTimeout(pinwheelTimer);
  }, []);

  const filteredResidents = useMemo(() => {
    if (searchTerm.length < 3) return [];
    return residents.filter((res: any) => 
      res?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res?.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [residents, searchTerm]);

  const triggerCallModal = (res: any) => {
    setSelectedResident(res);
    setIsModalOpen(true);
  };

  const handlePrivacyCall = async (visitorPhone: string) => {
    setIsModalOpen(false);
    setCallingId(selectedResident.id);
    try {
      await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ residentPhone: selectedResident.phoneNumber, visitorPhone })
      });
      alert("Bridge active. Your phone will ring shortly.");
    } catch (e) {
      alert("Error. Try again.");
    } finally {
      setCallingId(null);
    }
  };

  if (isWithinRange === null) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Validating Site Access...</p>
      </div>
    );
  }

  if (isWithinRange === false) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center text-center">
        <Lock size={48} className="text-red-600 mb-6" />
        <h2 className="text-2xl font-black uppercase italic">Access Denied</h2>
        <p className="text-slate-500 mt-4 text-sm uppercase font-bold italic">On-Site Proximity Required</p>
        <button onClick={() => setIsWithinRange(true)} className="mt-12 text-[8px] text-slate-800 font-black uppercase tracking-[0.3em] border border-white/5 px-4 py-2 rounded-full">Developer Bypass</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center font-sans overflow-hidden">
      <VisitorPhoneModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handlePrivacyCall} residentName={selectedResident ? `${selectedResident.firstName?.[0]}. ${selectedResident.lastName}` : ''} />
      <header className="w-full max-w-md flex items-center justify-between mb-8 pt-4">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl text-slate-400 active:scale-90 shadow-lg"><ArrowLeft size={24} /></Link>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Secure Link</span>
          <div className="text-[9px] font-bold text-slate-700 uppercase">Portal Active</div>
        </div>
      </header>
      <div className="w-full max-w-md relative mb-12">
        <Search className="absolute left-4 top-5 text-slate-700" size={20} />
        <input type="text" placeholder="Search Residents..." className="w-full bg-[#0a0a0a] border border-white/5 p-5 pl-12 rounded-2xl text-slate-200 outline-none focus:border-blue-500/30 font-bold placeholder:text-slate-800 shadow-[0_0_30px_rgba(37,99,235,0.05)]" onChange={(e) => setSearchTerm(e.target.value)} />
        <p className="text-[9px] text-slate-800 mt-4 font-black uppercase tracking-[0.2em] text-center italic">Type 3+ letters (Try 'Ada' for Cheryl Adams)</p>
      </div>
      <div className="w-full max-w-md space-y-3">
        {loading ? (
          <div className="flex flex-col items-center mt-12 gap-4">
            <Loader2 className="animate-spin text-blue-600/40" size={30} />
            <span className="text-[9px] font-black uppercase text-slate-800 tracking-[0.3em]">Syncing Directory...</span>
          </div>
        ) : filteredResidents.map((res: any) => (
          <div key={res.id} className="bg-[#0a0a0a] border border-white/5 p-5 rounded-[2rem] flex justify-between items-center transition-all animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 font-black text-sm border border-blue-500/20">{res.lastName?.[0]}</div>
              <div><p className="text-lg font-black text-slate-200 uppercase tracking-tighter italic">{res.firstName} {res.lastName}</p></div>
            </div>
            <button onClick={() => triggerCallModal(res)} disabled={callingId === res.id} className="bg-blue-600 p-4 rounded-2xl text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 disabled:opacity-50">
              {callingId === res.id ? <Loader2 className="animate-spin" size={20} /> : <Phone size={20} fill="currentColor" />}
            </button>
          </div>
        ))}
      </div>
      <footer className="mt-auto py-8 opacity-20 flex items-center justify-center gap-2"><ShieldCheck size={12} className="text-blue-500" /><span className="text-[8px] font-black uppercase tracking-[0.5em]">{SITE_CONFIG.brandName} Secure Interface</span></footer>
    </div>
  );
}
