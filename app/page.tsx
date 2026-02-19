// This is the main screen for your Visitor Gate App
import React from 'react';
import { Phone, Users, Package, AlertTriangle, Building2 } from 'lucide-react';

export default function VisitorGate() {
  // Logic for the Dynamic Buttons (Simplified for now)
  const officePhone = "tel:5550100";
  const callCenterPhone = "tel:5550999";

  const buttons = [
    { label: "Call Leasing Office", icon: <Building2 />, link: officePhone, color: "bg-blue-600" },
    { label: "Resident Directory", icon: <Users />, link: "/directory", color: "bg-slate-800" },
    { label: "Packages / Deliveries", icon: <Package />, link: officePhone, color: "bg-emerald-600" },
    { label: "Emergency / After Hours", icon: <AlertTriangle />, link: callCenterPhone, color: "bg-red-600" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <header className="mb-8 mt-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to [Apartment Name]</h1>
        <p className="text-gray-600">Please select an option below</p>
      </header>

      <div className="w-full max-w-md space-y-4">
        {buttons.map((btn, index) => (
          <a 
            key={index} 
            href={btn.link}
            className={`${btn.color} flex items-center justify-between p-6 rounded-2xl text-white shadow-lg active:scale-95 transition-transform`}
          >
            <span className="text-xl font-semibold">{btn.label}</span>
            <div className="bg-white/20 p-2 rounded-full">
              {btn.icon}
            </div>
          </a>
        ))}
      </div>
      
      <footer className="mt-auto py-6 text-sm text-gray-400">
        Powered by GateAccess AI
      </footer>
    </div>
  );
}
