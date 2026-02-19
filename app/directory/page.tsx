"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, ArrowLeft, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function Directory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function fetchResidents() {
      try {
        const response = await fetch('/api/brivo');
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        
        // Comprehensive check for data structure
        if (Array.isArray(data)) {
          setResidents(data);
        } else if (data?.data && Array.isArray(data.data)) {
          setResidents(data.data);
        } else {
          setResidents([]);
        }
      } catch (e) {
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchResidents();
  }, []);

  // useMemo prevents unnecessary re-renders that can cause errors
  const filteredResidents = useMemo(() => {
    if (!Array.isArray(residents)) return [];
    return residents.filter((res: any) => {
      const last = res?.lastName || "";
      return last.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [residents, searchTerm]);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center font-sans">
      
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl text-slate-400 active:scale-90 transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Resident List</span>
          <span className="text-[10px] font-bold text-slate-600">Privacy Mode Active</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-md relative mb-6">
        <Search className="absolute left-4 top-4 text-slate-600" size={20} />
        <input 
          type="text" 
          placeholder="Search Last Name..." 
          className="w-full bg-[#111] border border-white/5 p-4 pl-12 rounded-2xl text-slate-200 outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-slate-800"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center p-12 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 animate-pulse">Syncing Gate Database</span>
        </div>
      ) : hasError ? (
        <div className="w-full max-w-md bg-red-950/10 border border-red-500/20 p-8 rounded-[2rem] text-center">
          <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
          <p className="text-sm font-bold text-red-500 uppercase">Connection Error</p>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed italic">Unable to reach the Brivo server. Please return to the home screen and use "Call Leasing".</p>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-3">
          {filteredResidents.map((res: any, idx: number) => (
            <div key={res.id || idx} className="bg-[#0f0f0f] border border-white/5 p-5 rounded-[1.8rem] flex justify-between items-center active:bg-blue-600/5 active:border-blue-500/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 font-black text-sm border border-blue-500/10">
                  {res.lastName?.[0] || 'R'}
                </div>
                <div>
                  <p className="text-lg font-black text-slate-200 uppercase tracking-tighter italic">
                    {res.firstName ? `${res.firstName[0]}. ` : ""}{res.lastName || "Resident"}
                  </p>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Secure Entry Access</p>
                </div>
              </div>
              
              <a 
                href={`tel:${res.phoneNumber || '7705256055'}`} 
                className="bg-blue-600 p-4 rounded-2xl text-white shadow-[0_5px_15px_rgba(37,99,235,0.3)] active:scale-95 transition-all"
              >
                <Phone size={20} fill="currentColor" />
              </a>
            </div>
          ))}

          {filteredResidents.length === 0 && (
            <div className="text-center py-20 opacity-40">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No Matching Residents</p>
            </div>
          )}
        </div>
      )}

      <footer className="mt-auto py-10 flex items-center gap-2 opacity-10">
        <ShieldCheck size={14} className="text-blue-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.5em]">Gate Guard Interface</span>
      </footer>
    </div>
  );
}
