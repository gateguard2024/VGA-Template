"use client";
import React, { useState, useEffect } from 'react';
import { Users, Phone, Package, AlertTriangle, ChevronRight, X, ShieldCheck, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from './config';

// --- TRANSLATION DICTIONARY ---
const t = {
  en: {
    welcome: "Welcome To",
    systemActive: "System Active",
    directory: "Directory",
    callLeasing: "Call Leasing",
    officeClosed: "Office Closed",
    packages: "Packages",
    emergency: "Emergency",
    callLeasingTitle: "Call Leasing Office",
    visitorReg: "Visitor Registration",
    fullName: "Full Name",
    email: "Email Address",
    mobile: "Mobile Number",
    reason: "Select Reason for Visit",
    reasons: {
      leasing: "Interest in Leasing",
      delivery: "Package / Delivery Courier",
      support: "Current Resident Support",
      maintenance: "Maintenance / Vendor",
      general: "General Inquiry"
    },
    initiate: "Initiate Secure Call",
    toggleLang: "ES"
  },
  es: {
    welcome: "Bienvenido A",
    systemActive: "Sistema Activo",
    directory: "Directorio",
    callLeasing: "Oficina de Alquiler",
    officeClosed: "Oficina Cerrada",
    packages: "Paquetes",
    emergency: "Emergencia",
    callLeasingTitle: "Llamar a la Oficina",
    visitorReg: "Registro de Visitantes",
    fullName: "Nombre Completo",
    email: "Correo Electrónico",
    mobile: "Número de Teléfono",
    reason: "Seleccione el Motivo",
    reasons: {
      leasing: "Interés en Alquilar",
      delivery: "Paquete / Repartidor",
      support: "Soporte para Residentes",
      maintenance: "Mantenimiento / Proveedor",
      general: "Consulta General"
    },
    initiate: "Iniciar Llamada Segura",
    toggleLang: "EN"
  }
};

// --- TWILIO BRIDGE MODAL ---
const LeasingPhoneModal = ({ isOpen, onClose, onConfirm, lang }: any) => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  
  if (!isOpen) return null;
  const text = t[lang as keyof typeof t];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#111] border-2 border-white/20 rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-blue-400">{text.callLeasingTitle}</h3>
            <p className="text-white text-xs font-bold uppercase tracking-widest mt-1">{text.visitorReg}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20"><X size={24}/></button>
        </div>
        
        <input 
          type="text" 
          placeholder={text.fullName}
          className="w-full bg-black border-2 border-white/20 p-5 rounded-2xl text-xl text-center font-bold text-white outline-none mb-3 focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input 
          type="email" 
          placeholder={text.email}
          className="w-full bg-black border-2 border-white/20 p-5 rounded-2xl text-xl text-center font-bold text-white outline-none mb-3 focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder={text.mobile}
          className="w-full bg-black border-2 border-white/20 p-5 rounded-2xl text-xl text-center font-bold text-white outline-none mb-3 focus:border-blue-500"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <select
          className="w-full bg-black border-2 border-white/20 p-5 rounded-2xl text-xl text-center font-bold text-white outline-none mb-6 focus:border-blue-500 appearance-none"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="" disabled>{text.reason}</option>
          <option value="Interest in Leasing">{text.reasons.leasing}</option>
          <option value="Package / Delivery Courier">{text.reasons.delivery}</option>
          <option value="Current Resident Support">{text.reasons.support}</option>
          <option value="Maintenance / Vendor">{text.reasons.maintenance}</option>
          <option value="General Inquiry">{text.reasons.general}</option>
        </select>

        <button 
          onClick={() => onConfirm(name, number, email, reason)}
          disabled={number.length < 10 || name.trim() === '' || email.trim() === '' || reason === ''}
          className="w-full bg-blue-600 py-6 rounded-2xl font-black uppercase italic text-lg disabled:opacity-30 text-white transition-opacity"
        >
          {text.initiate}
        </button>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [isLeasingModalOpen, setIsLeasingModalOpen] = useState(false);
  const [isOfficeOpen, setIsOfficeOpen] = useState(false);

  const text = t[lang];

  useEffect(() => {
    const checkIsOpen = () => {
      const now = new Date();
      const day = now.getDay(); 
      const hour = now.getHours();
      const { hours } = SITE_CONFIG;
      if (day === 0) return !hours.sunday.closed; 
      if (day === 6) return hour >= hours.saturday.open && hour < hours.saturday.close;
      return hour >= hours.weekdays.open && hour < hours.weekdays.close;
    };
    setIsOfficeOpen(checkIsOpen());
  }, []);

  const handleLeasingCall = async (visitorName: string, visitorPhone: string, email: string, reason: string) => {
    setIsLeasingModalOpen(false);
    try {
      await fetch('/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          visitorName,
          visitorPhone: `+1${visitorPhone.replace(/\D/g, '')}`, 
          residentPhone: `+1${SITE_CONFIG.officePhone}`, 
          residentName: "Leasing Office",
          email,        
          reason        
        })
      });
      alert(lang === 'es' ? "¡Llamada iniciada!" : "Call initiated! Answer your phone.");
    } catch (e) {
      alert("Error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center font-sans overflow-hidden relative">
      
      {/* LANGUAGE TOGGLE */}
      <button 
        onClick={() => setLang(lang === 'en' ? 'es' : 'en')}
        className="absolute top-6 right-6 flex items-center gap-2 bg-white/10 border-2 border-white/20 px-4 py-2 rounded-full hover:bg-white/20 transition-all z-10"
      >
        <Globe size={18} className="text-white" />
        <span className="font-black text-white">{text.toggleLang}</span>
      </button>

      <LeasingPhoneModal 
        isOpen={isLeasingModalOpen} 
        onClose={() => setIsLeasingModalOpen(false)} 
        onConfirm={handleLeasingCall} 
        lang={lang}
      />

      <div className="w-full max-w-md p-6 flex flex-col items-center flex-grow pt-16">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-8 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/Logo.jpg" 
            alt="Property Logo" 
            className="w-64 h-auto mb-6 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)]" 
          />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-300 mb-2">{text.welcome}</p>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-none mb-2">
            {SITE_CONFIG.propertyName}
          </h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {SITE_CONFIG.propertyAddress}
          </p>
        </div>

        {/* SYSTEM ACTIVE PILL */}
        <div className="w-full flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 border-2 border-blue-500/50 bg-blue-500/20 px-5 py-2 rounded-full">
            <span className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">{text.systemActive}</span>
          </div>
        </div>

        {/* HIGH CONTRAST BUTTON LAYOUT */}
        <div className="w-full space-y-5">
          
          <button onClick={() => router.push('/directory')} className="w-full bg-[#111] border-2 border-blue-500/60 p-6 rounded-[2.5rem] flex items-center justify-between group hover:bg-blue-900/30 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)]">
                <Users size={28} className="text-white" />
              </div>
              <span className="text-2xl font-black uppercase italic tracking-tighter text-white">{text.directory}</span>
            </div>
            <ChevronRight size={28} className="text-blue-400 group-hover:translate-x-2 transition-transform" />
          </button>

          <button onClick={() => isOfficeOpen ? setIsLeasingModalOpen(true) : null} className={`w-full bg-[#111] border-2 p-6 rounded-[2.5rem] flex items-center justify-between transition-all ${!isOfficeOpen ? 'border-red-900/50 opacity-60 cursor-not-allowed' : 'border-gray-500/60 hover:bg-white/10 cursor-pointer'}`}>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center">
                <Phone size={28} className={isOfficeOpen ? "text-white" : "text-gray-400"} />
              </div>
              <div className="text-left">
                <span className="text-2xl font-black uppercase italic tracking-tighter text-white block leading-none">{text.callLeasing}</span>
                {!isOfficeOpen && <span className="text-xs font-bold uppercase tracking-widest text-red-400 mt-2 block">{text.officeClosed}</span>}
              </div>
            </div>
            {isOfficeOpen && <ChevronRight size={28} className="text-gray-400" />}
          </button>

          <button onClick={() => router.push('/packages')} className="w-full bg-[#111] border-2 border-gray-500/60 p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-white/10 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center">
                <Package size={28} className="text-white" />
              </div>
              <span className="text-2xl font-black uppercase italic tracking-tighter text-white">{text.packages}</span>
            </div>
            <ChevronRight size={28} className="text-gray-400" />
          </button>

          <button onClick={() => router.push('/emergency')} className="w-full bg-[#1a0505] border-2 border-red-500/80 p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-red-900/50 transition-all mt-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-red-600/20 rounded-full flex items-center justify-center border border-red-500/50">
                <AlertTriangle size={28} className="text-red-400" />
              </div>
              <span className="text-2xl font-black uppercase italic tracking-tighter text-red-400">{text.emergency}</span>
            </div>
            <ChevronRight size={28} className="text-red-500" />
          </button>

        </div>

        <footer className="mt-auto py-10 opacity-40 flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-white" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">{SITE_CONFIG.footerText}</span>
        </footer>

      </div>
    </div>
  );
}
