"use client";
import React, { useState } from 'react';
import { Search, Phone, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Directory() {
  const [searchTerm, setSearchTerm] = useState('');

  // Placeholder data - We will replace this with Brivo API in the next step!
  const residents = [
    { id: 1, name: "John Doe", unit: "101" },
    { id: 2, name: "Jane Smith", unit: "205" },
    { id: 3, name: "Alice Johnson", unit: "312" },
    { id: 4, name: "Bob Wilson", unit: "404" },
  ];

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.unit.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link href="/" className="p-2 mr-2 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Resident Directory</h1>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search name or unit..." 
          className="w-full p-3 pl-10 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Resident List */}
      <div className="space-y-3">
        {filteredResidents.map((res) => (
          <div key={res.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center border border-gray-100">
            <div>
              <p className="font-bold text-gray-900">{res.name}</p>
              <p className="text-sm text-gray-500">Unit {res.unit}</p>
            </div>
            {/* This will trigger the call */}
            <a href="tel:5550100" className="bg-blue-100 p-3 rounded-full text-blue-600 active:bg-blue-600 active:text-white transition-colors">
              <Phone size={20} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
