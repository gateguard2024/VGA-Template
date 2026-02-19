"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, ArrowLeft, Loader2, Lock, EyeOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { SITE_CONFIG } from '../config';

export default function SecureDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [callingId, setCallingId] = useState<string | null>(null);

  useEffect(() => {
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

  const filteredResidents = useMemo(() => {
    // SECURITY: Requires 3+ characters to reveal any data
    if (searchTerm.length < 3) return [];
    return residents.filter((res: any) => 
      res?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [residents, searchTerm]);

  const handlePrivacyCall = async (res: any) => {
    setCallingId(res.id);
    try {
      const response = await fetch('/api/call', {
        method: 'POST',
        body: JSON.stringify({ residentPhone: res.phoneNumber })
      });
      if (response.ok) alert("Privacy Mode: The system is now bridging your call through the main gate line.");
    } catch (e) {
      alert("System Busy. Please try again.");
    } finally {
      setCallingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center font-sans">
      <header className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl text-slate-400"><ArrowLeft size={24} /></Link>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Secure Search</span>
          <div className="text-[9px] font-bold text-slate-600 uppercase">Call Masking Active</div>
        </div>
      </header>

      <div className="w-full max-w-md relative mb-6">
        <Search className="absolute left-4 top-5 text-slate-600" size={20} />
        <input 
          type="text" 
          placeholder="Search by Last Name..." 
          className="w-full bg-[#111] border border-white/5 p-5 pl-12 rounded-2xl text-slate-200 outline-none focus:border-blue-500/50 font-bold placeholder:text-slate-800"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <p className="text-[9px] text-slate-700 mt-4 font-black uppercase tracking-[0.2em] text-center">Enter 3+ letters to verify resident</p>
      </div>

      {loading ? (
        <Loader2 className="animate-spin text-blue-600 mt-12" size={40} />
      ) : (
        <div className="w-full max-w-md space-y-3">
          {filteredResidents.map((res: any) => (
            <div key={res.id} className="bg-[#0f0f0f] border border-white/5 p-5 rounded-[1.8rem] flex justify-between items-center animate-in fade-in">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 font-black text-sm">{res.lastName?.[0]}</div>
                <div>
                  <p className="text-lg font-black text-slate-200 uppercase tracking-tighter italic">
                    {res.firstName?.[0]}. {res.lastName}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-700 uppercase tracking-widest"><EyeOff size={10} /> Caller ID Protected</div>
                </div>
              </div>
              
              <button 
                onClick={() => handlePrivacyCall(res)}
                disabled={callingId === res.id}
                className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg active:scale-90 transition-all disabled:opacity-50"
              >
                {callingId === res.id ? <Loader2 className="animate-spin" size={20} /> : <Phone size={20} fill="currentColor" />}
              </button>
            </div>
          ))}
        </div>
      )}
      
      <footer className="mt-auto py-10 flex items-center gap-2 opacity-10">
        <ShieldCheck size={14} className="text-blue-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.5em]">{SITE_CONFIG.brandName} V2.0</span>
      </footer>
    </div>
  );
}
