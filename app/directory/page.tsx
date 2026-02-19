"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, ArrowLeft, Loader2, ShieldCheck, MapPin, Lock, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONFIG } from '../config';

export default function Directory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);

  // GPS Distance Logic
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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const dist = getDistance(position.coords.latitude, position.coords.longitude, SITE_CONFIG.location.lat, SITE_CONFIG.location.lng);
        setIsWithinRange(dist <= SITE_CONFIG.location.radius);
      }, () => setIsWithinRange(false));
    }

    async function fetchResidents() {
      try {
        const response = await fetch('/api/brivo');
        const data = await response.json();
        setResidents(Array.isArray(data) ? data : (data?.data || []));
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    }
    fetchResidents();
  }, []);

  // SECURITY LOGIC: Search-to-Reveal
  const filteredResidents = useMemo(() => {
    // Requirement 1: Type in first 3-4 letters (Setting to 3 for better UX)
    if (searchTerm.length < 3) return [];
    
    return residents.filter((res: any) => 
      res?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [residents, searchTerm]);

  if (isWithinRange === false) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col items-center justify-center font-sans text-center">
        <Lock size={48} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-black uppercase italic italic tracking-tighter">On-Site Access Only</h2>
        <p className="text-slate-500 mt-4 text-sm leading-relaxed max-w-xs">For resident privacy, this directory is only accessible from the {SITE_CONFIG.propertyName} entry gate.</p>
        <Link href="/" className="mt-8 text-blue-500 font-bold uppercase text-xs tracking-widest">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center font-sans">
      <header className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl text-slate-400"><ArrowLeft size={24} /></Link>
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Secure Portal</span>
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-600 uppercase tracking-tighter">Privacy Mode Active</div>
        </div>
      </header>

      <div className="w-full max-w-md relative mb-6">
        <Search className="absolute left-4 top-5 text-slate-600" size={20} />
        <input 
          type="text" 
          placeholder="Search by Last Name..." 
          className="w-full bg-[#111] border border-white/5 p-5 pl-12 rounded-2xl text-slate-200 outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-800"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center p-12"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : (
        <div className="w-full max-w-md space-y-3">
          {filteredResidents.map((res: any, idx: number) => (
            <div key={res.id || idx} className="bg-[#0f0f0f] border border-white/5 p-5 rounded-[1.8rem] flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-4 text-left">
                <div className="w-11 h-11 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 font-black text-sm">
                  {res.lastName?.[0]}
                </div>
                <div>
                  {/* Requirement 2: Show only Last Name and First Initial */}
                  <p className="text-lg font-black text-slate-200 uppercase tracking-tighter italic italic">
                    {res.firstName ? `${res.firstName[0]}. ` : ""}{res.lastName}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-700 uppercase tracking-widest">
                    <EyeOff size={10} /> Phone Hidden
                  </div>
                </div>
              </div>
              
              {/* Requirement 3: Allow call but hide number from UI */}
              <a 
                href={`tel:${res.phoneNumber || SITE_CONFIG.officePhone}`} 
                className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg active:scale-90 transition-all"
              >
                <Phone size={20} fill="currentColor" />
              </a>
            </div>
          ))}

          {searchTerm.length > 0 && searchTerm.length < 3 && (
            <div className="text-center py-10 opacity-30">
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Enter 3+ letters to search</p>
            </div>
          )}

          {searchTerm.length >= 3 && filteredResidents.length === 0 && (
            <div className="text-center py-20 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5">
              <p className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">No Matching Resident Found</p>
            </div>
          )}
        </div>
      )}
      
      <footer className="mt-auto py-10 flex items-center gap-2 opacity-10">
        <ShieldCheck size={14} className="text-blue-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.5em]">{SITE_CONFIG.brandName} Secure Interface</span>
      </footer>
    </div>
  );
}
