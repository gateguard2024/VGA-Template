"use client";
import React, { useState, useEffect } from 'react';
import { Search, Phone, ArrowLeft, Loader2 } from 'lucide-react';
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

  const filteredResidents = residents.filter((r: any) => 
    r.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center mb-6">
        <Link href="/" className="p-2 mr-2 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Resident Directory</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search name..." 
          className="w-full p-3 pl-10 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>
      ) : (
        <div className="space-y-3">
          {filteredResidents.map((res: any) => (
            <div key={res.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100">
              <div>
                <p className="font-bold text-gray-900">{res.firstName} {res.lastName}</p>
                <p className="text-sm text-gray-500">Resident</p>
              </div>
              <a href={`tel:${res.phoneNumber || '5550100'}`} className="bg-blue-100 p-3 rounded-full text-blue-600 active:bg-blue-600 active:text-white transition-colors">
                <Phone size={20} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
