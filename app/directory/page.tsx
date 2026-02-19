"use client";
import React, { useState, useEffect } from 'react';
import { Search, Phone, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Directory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResidents() {
      try {
        const response = await fetch('/api/brivo');
        const data = await response.json();
        setResidents(data);
      } catch (e) {
        console.error("Failed to load residents");
      } finally {
        setLoading(false);
      }
    }
    fetchResidents();
  }, []);

  const filteredResidents = residents.filter((res: any) => 
    res.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 flex flex-col items-center font-sans">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <Link href="/" className="p-3 bg-white/5 rounded-2xl text-slate-400">
          <ArrowLeft size={24} />
        </Link>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 italic">Resident List</span>
          <span className="text-xs font-bold text-slate-600">Privacy Mode Active</span>
        </div>
      </div>

      {/* Branded Search Bar */}
      <div className="w-full max-w-md relative mb-6">
        <Search className="absolute left-4 top-4 text-slate-500" size={20} />
        <input 
          type="text" 
          placeholder="Search by last name..." 
          className="w-full bg-[#111] border border-white/5 p-4 pl-12 rounded-2xl text-slate-200 shadow-inner outline-none focus:border-blue-500/50 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center p-12 gap-4">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Syncing with Gate Guard...</span>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-3">
          {filteredResidents.map((res: any) => (
            <div key={res.id} className="bg-[#111] border border-white/5 p-5 rounded-[1.5rem] flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500 font-black text-sm">
                  {res.lastName?.[0]}
                </div>
                <div>
                  {/* Shows "J. Smith" and hides unit */}
                  <p className="text-lg font-bold text-slate-200 uppercase tracking-tight">
                    {res.firstName?.[0]}. {res.lastName}
                  </p>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Verified Resident</p>
                </div>
              </div>
              
              <a 
                href={`tel:${res.phoneNumber || '7705256055'}`} 
                className="bg-blue-600/10 p-4 rounded-2xl text-blue-500 active:bg-blue-600 active:text-white transition-all"
              >
                <Phone size={20} fill="currentColor" />
              </a>
            </div>
          ))}
          
          {filteredResidents.length === 0 && !loading && (
            <p className="text-center text-slate-600 text-sm mt-10 italic">No residents found matching that name.</p>
          )}
        </div>
      )}

      <footer className="mt-auto py-10 flex items-center gap-2 opacity-20">
        <ShieldCheck size={14} className="text-blue-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.4em]">Gate Guard Interface</span>
      </footer>
    </div>
  );
}
