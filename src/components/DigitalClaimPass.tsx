'use client';

import React from 'react';
import { Shield, CheckCircle2, Printer, MapPin } from 'lucide-react';
import { Claim } from '../lib/types';

interface DigitalClaimPassProps {
  claim: Claim;
  onPrint?: () => void;
}

export default function DigitalClaimPass({ claim, onPrint }: DigitalClaimPassProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=UNITRACE-PASS-${claim.id}-OTP-${claim.otp}`;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-slate-900 text-white border-2 border-brand-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden max-w-md mx-auto">
      {/* Decorative top ribbon */}
      <div className="absolute top-0 inset-x-0 h-3 bg-linear-to-r from-brand-600 via-indigo-600 to-amber-500" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white tracking-tight">
              Uni<span className="text-brand-400">Trace</span> Verification Pass
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Campus Security Digital Handover Permit
            </p>
          </div>
        </div>

        <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          {claim.status === 'HANDOVER_COMPLETED' ? 'RESOLVED' : 'APPROVED'}
        </span>
      </div>

      {/* Main Body */}
      <div className="py-5 text-center space-y-4">
        {/* QR Code Container */}
        <div className="inline-block p-3 bg-white rounded-2xl border-2 border-slate-700 shadow-sm">
          <img
            src={qrUrl}
            alt="Handover Verification QR"
            className="w-32 h-32 mx-auto rounded-lg"
          />
          <span className="block text-[9px] font-mono text-slate-600 mt-1 uppercase font-bold">
            Pass ID: {claim.id}
          </span>
        </div>

        {/* 6 Digit OTP */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
            Security Handover Passcode
          </span>
          <div className="inline-block bg-slate-950 text-amber-400 border border-slate-800 px-6 py-2 rounded-xl text-3xl font-mono font-black tracking-widest shadow-inner">
            {claim.otp}
          </div>
        </div>

        {/* Claim Details */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 text-left text-xs space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <span className="text-slate-400 font-medium">Item Name:</span>
            <span className="font-bold text-white text-right truncate max-w-[200px]">
              {claim.itemTitle}
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <span className="text-slate-400 font-medium">Authorized Claimant:</span>
            <span className="font-bold text-white">
              {claim.claimantName} ({claim.claimantRollNo})
            </span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
            <span className="text-slate-400 font-medium">Department:</span>
            <span className="text-slate-300">{claim.claimantDepartment}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Pickup Location:</span>
            <span className="font-semibold text-brand-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Gate 1 Central Security Desk
            </span>
          </div>
        </div>
      </div>

      {/* Instructions & Print Button */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3 text-[11px] text-slate-400">
        <span>Show with University ID Card</span>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" /> Print Pass
        </button>
      </div>
    </div>
  );
}
