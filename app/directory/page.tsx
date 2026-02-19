"use client";
import React, { useState, useEffect } from 'react';
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
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        
        // Ensure we only set residents if data is an actual array
        if (data && Array.isArray(data)) {
          setResidents(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setResidents(data.data); // Handles Brivo's nested structure
        } else {
          setResidents([]);
        }
      } catch (e) {
        console.error("Directory sync error:", e);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchResidents();
  }, []);

  // Filter residents by last name only
  const filteredResidents = residents.filter((res) => {
    const lastName = res.lastName || "";
    return lastName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center font-sans">
      
      {/* Header Section */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl text-slate-400 active:bg-blue-600 transition-all">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Resident Access</span>
          <span className="text-[10px] font-bold text-slate-600">Secure Privacy Mode</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full max-w-md relative mb-6 group">
        <Search className="absolute left-4 top-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Enter Last Name..." 
          className="w-full bg-[#111] border border-white/5 p-4 pl-12 rounded-2xl text-slate-200 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-800 font-bold"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center p-12 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 animate-pulse">Syncing Database</span>
        </div>
      ) : hasError ? (
        <div className="w-full max-w-md bg-red-950/10 border border-red-500/20 p-8 rounded-3xl text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={32} />
          <p className="text-sm font-bold text-red-500 uppercase tracking-tight">System Offline</p>
          <p className="text-xs text-slate-500 mt-2">Unable to sync with the gate server. Please use the 'Call Leasing' option on the home screen.</p>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-3">
          {filteredResidents.map((res: any) => (
            <div key={res.id || Math.random()} className="bg-[#0f0f0f] border border-white/5 p-5 rounded-[1.8rem] flex justify-between items-center active:scale-[0.98] transition-all border-l-2 border-l-transparent active:border-l-blue-600">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 font-black text-sm border border-blue-500/10">
                  {res.lastName?.[0] || 'R'}
                </div>
                <div>
                  {/* Privacy Logic: First Initial + Last Name ONLY */}
                  <p className="text-lg font-black text-slate-200 uppercase tracking-tighter italic">
                    {res.firstName ? `${res.firstName[0]}. ` : ""}{res.lastName || "Resident"}
                  </p>
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Verified Access</p>
                </div>
              </div>
              
              <a 
                href={`tel:${res.phoneNumber || '7705256055'}`} 
                className="bg-blue-600 p-4 rounded-2xl text-white shadow-[0_5px_15px_rgba(37,99,235,0.3)] active:bg-blue-700 transition-all"
              >
                <Phone size={20} fill="currentColor" />
              </a>
            </div>
          ))}

          {filteredResidents.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">No Matches Found</p>
            </div>
          )}
        </div>
      )}

      {/* Footer Branded */}
      <footer className="mt-auto py-10 flex items-center gap-2 opacity-10">
        <ShieldCheck size={14} className="text-blue-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.5em]">Gate Guard V2.0</span>
      </footer>
    </div>
  );
}
