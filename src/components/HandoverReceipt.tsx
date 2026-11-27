'use client';

import React from 'react';
import { Shield, Printer, CheckCircle2 } from 'lucide-react';
import { Claim, Item } from '../lib/types';

interface HandoverReceiptProps {
  claim: Claim;
  item: Item;
  onClose?: () => void;
}

export default function HandoverReceipt({ claim, item, onClose }: HandoverReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-8 max-w-2xl mx-auto rounded-3xl border border-slate-300 shadow-2xl space-y-6 text-slate-800 font-sans print:border-none print:shadow-none print:p-0">
      {/* Formal Header */}
      <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
            Central University Proctorial & Security Directorate
          </h2>
        </div>
        <p className="text-xs uppercase font-bold tracking-widest text-slate-500">
          Official Property Disbursal & Restitution Certificate
        </p>
        <p className="text-[11px] font-mono text-slate-400">
          Reference Certificate No: REF-SEC-{claim.id.toUpperCase()}-{Date.now().toString().slice(-4)}
        </p>
      </div>

      {/* Disbursal Confirmation */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
        <div className="text-xs text-emerald-900">
          <span className="font-bold block text-sm">Custody Transfer Authenticated</span>
          The property listed below has been verified against the university claim challenge and formally returned to the authenticated claimant.
        </div>
      </div>

      {/* Item & Claimant Specifications */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="border border-slate-200 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
            Recovered Article Details
          </h4>
          <div>
            <span className="text-slate-500 block text-[10px]">Title:</span>
            <span className="font-bold text-slate-900">{item.title}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Category:</span>
            <span className="font-medium text-slate-700">{item.category}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Original Campus Location:</span>
            <span className="text-slate-700">{item.location}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Holding Facility / Locker:</span>
            <span className="font-mono text-brand-700 font-semibold">{item.lockerNumber || 'Main Security Desk'}</span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
            Recipient / Student Details
          </h4>
          <div>
            <span className="text-slate-500 block text-[10px]">Full Name:</span>
            <span className="font-bold text-slate-900">{claim.claimantName}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Student Roll No:</span>
            <span className="font-mono font-bold text-slate-800">{claim.claimantRollNo}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Department:</span>
            <span className="text-slate-700">{claim.claimantDepartment}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Contact Phone:</span>
            <span className="text-slate-700">{claim.claimantPhone}</span>
          </div>
        </div>
      </div>

      {/* Handover Verification Metadata */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">Handover Authentication Code (OTP):</span>
          <span className="font-mono font-bold text-slate-900">{claim.otp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Verification Timestamp:</span>
          <span className="font-medium text-slate-800">{claim.resolvedAt ? new Date(claim.resolvedAt).toLocaleString() : new Date().toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Officer in Charge:</span>
          <span className="font-semibold text-slate-900">Officer Rajesh Kumar (ID: SEC-904)</span>
        </div>
        {claim.securityOfficerRemarks && (
          <div className="pt-2 border-t border-slate-200 text-slate-600">
            <span className="font-bold text-slate-700 block">Security Remarks:</span>
            <span>{claim.securityOfficerRemarks}</span>
          </div>
        )}
      </div>

      {/* Signature Lines */}
      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-center text-xs">
        <div>
          <div className="border-b border-slate-400 h-12 flex items-end justify-center pb-1 font-serif italic text-slate-600">
            {claim.claimantName}
          </div>
          <span className="font-bold text-slate-700 block mt-1">Recipient Student Signature</span>
          <span className="text-[10px] text-slate-400">Date & Physical Possession Acknowledged</span>
        </div>

        <div>
          <div className="border-b border-slate-400 h-12 flex items-end justify-center pb-1 font-serif italic text-slate-600">
            Officer R. Kumar
          </div>
          <span className="font-bold text-slate-700 block mt-1">Duty Security Officer Signature</span>
          <span className="text-[10px] text-slate-400">Seal of Campus Vigilance Division</span>
        </div>
      </div>

      {/* Print Controls (hidden on print) */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        )}
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md cursor-pointer"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF Receipt
        </button>
      </div>
    </div>
  );
}
