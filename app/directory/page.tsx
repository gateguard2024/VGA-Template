"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, ArrowLeft, Loader2, Lock, EyeOff, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONFIG } from '../config';

export default function SecureDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [callingId, setCallingId] = useState<string | null>(null);
  const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);

  // GPS Distance Check logic
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    // 1. Verify Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const dist = getDistance(
          position.coords.latitude, 
          position.coords.longitude, 
          SITE_CONFIG.location.lat, 
          SITE_CONFIG.location.lng
        );
        // Radius of 0.25 miles from 700 Rock Quarry Road
        setIsWithinRange(dist <= 0.25);
      }, () => setIsWithinRange(false));
    }

    // 2. Fetch Resident List (Using Brivo API with fallback Dummy Data)
    async function fetchResidents() {
      try {
        const response = await fetch('/api/brivo');
        const data = await response.json();
        setResidents(Array.isArray(data) ? data : (data?.data || []));
      } catch (e) { 
        console.error("Directory Load Error", e); 
      } finally { 
        setLoading(false); 
      }
    }
    fetchResidents();
  }, []);

  // REQUIREMENT: 3+ characters to reveal data
  const filteredResidents = useMemo(() => {
    if (searchTerm.length < 3) return [];
    return residents.filter((res: any) => 
      res?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [residents, searchTerm]);

  // REQUIREMENT: Total Call Privacy via RingCentral
  const handlePrivacyCall = async (res: any) => {
    const visitorNum = prompt("To be connected, please enter your mobile number:");
    
    if (!visitorNum || visitorNum.length < 10) {
      alert("A valid 10-digit mobile number is required to bridge the call.");
      return;
    }

    setCallingId(res.id);
    try {
      const response = await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          residentPhone: res.phoneNumber,
          visitorPhone: visitorNum 
        })
      });
      
      if (response.ok) {
        alert("System connecting... Your phone will ring in a moment. Answer it to be bridged to the resident securely.");
      } else {
        throw new Error("Bridge failed");
      }
    } catch (e) {
      alert("The secure bridge is currently busy. Please try again.");
    } finally {
      setCallingId(null);
    }
  };

  // Geofence Lock Screen
  if (isWithinRange === false) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col items-center justify-center text-center font-sans">
        <Lock size={48} className="text-red-600 mb-6" />
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">On-Site Access Only</h2>
        <p className="text-slate-500 mt-4 text-sm leading-relaxed max-w-xs">
          For security, the directory is only accessible when you are physically at {SITE_CONFIG.propertyName}.
        </p>
        <Link href="/" className="mt-8 text-blue-500 font-bold uppercase text-xs tracking-[0.3em]">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center font-sans">
      <header className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl text-slate-400"><ArrowLeft size={24} /></Link>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Eagles Landing</span>
          <div className="flex items-center justify-end gap-1 text-[9px] font-bold text-slate-600 uppercase">
            <ShieldCheck size={10} /> Privacy Protected
          </div>
        </div>
      </header>

      <div className="w-full max-w-md relative mb-6">
        <Search className="absolute left-4 top-5 text-slate-600" size={20} />
        <input 
          type="text" 
          placeholder="Search Last Name..." 
          className="w-full bg-[#111] border border-white/5 p-5 pl-12 rounded-2xl text-slate-200 outline-none focus:border-blue-500/50 font-bold placeholder:text-slate-800"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="text-[9px] text-slate-700 mt-4 font-black uppercase tracking-[0.2em] text-center">Enter 3+ letters to reveal</p>
      </div>

      {loading || isWithinRange === null ? (
        <div className="flex flex-col items-center mt-12 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <span className="text-[9px] font-black uppercase text-slate-700 tracking-widest">Checking Location...</span>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-3">
          {filteredResidents.map((res: any) => (
            <div key={res.id} className="bg-[#0f0f0f] border border-white/5 p-5 rounded-[1.8rem] flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 font-black text-sm">
                  {res.lastName?.[0]}
                </div>
                <div>
                  {/* REQUIREMENT: Show only Last Name and First Initial */}
                  <p className="text-lg font-black text-slate-200 uppercase tracking-tighter italic">
                    {res.firstName?.[0]}. {res.lastName}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-700 uppercase tracking-widest">
                    <EyeOff size={10} /> Number Masked
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handlePrivacyCall(res)}
                disabled={callingId === res.id}
                className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                {callingId === res.id ? <Loader2 className="animate-spin" size={20} /> : <Phone size={20} fill="currentColor" />}
              </button>
            </div>
          ))}

          {searchTerm.length >= 3 && filteredResidents.length === 0 && (
            <div className="text-center py-20 bg-white/[0.01] rounded-[2.5rem] border border-dashed border-white/5">
              <p className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">No Matching Resident</p>
            </div>
          )}
        </div>
      )}
      
      <footer className="mt-auto py-10 flex items-center gap-2 opacity-20">
        <MapPin size={12} className="text-blue-500" />
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Site Auth Active</span>
      </footer>
    </div>
  );
}
