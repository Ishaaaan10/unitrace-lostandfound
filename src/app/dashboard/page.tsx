'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  CheckCircle2,
  QrCode,
  Sparkles,
  MapPin,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useItems } from '../../context/ItemsContext';
import DigitalClaimPass from '../../components/DigitalClaimPass';
import { Claim } from '../../lib/types';

export default function StudentDashboardPage() {
  const { currentUser } = useAuth();
  const { getUserClaims, getUserReportedItems, notifications } = useItems();

  const [activeTab, setActiveTab] = useState<'CLAIMS' | 'REPORTS' | 'NOTIFS'>('CLAIMS');
  const [selectedPassClaim, setSelectedPassClaim] = useState<Claim | null>(null);

  const myClaims = getUserClaims(currentUser.email);
  const myReports = getUserReportedItems(currentUser.email);
  const myNotifs = notifications;

  const approvedClaimsCount = myClaims.filter((c) => c.status === 'APPROVED').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Profile Header */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500/50 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
                <span className="bg-brand-950 text-brand-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md border border-brand-800 uppercase">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {currentUser.department} • Roll No: <span className="font-mono font-bold text-slate-200">{currentUser.rollNo}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.email} • {currentUser.phone} • {currentUser.dormsOrHostel}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">My Claims</span>
              <span className="text-xl font-black text-white">{myClaims.length}</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reported Items</span>
              <span className="text-xl font-black text-white">{myReports.length}</span>
            </div>
            <div className="bg-emerald-950/80 border border-emerald-800 px-4 py-2.5 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Approved Passes</span>
              <span className="text-xl font-black text-emerald-300">{approvedClaimsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('CLAIMS')}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'CLAIMS'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" /> My Ownership Claims ({myClaims.length})
        </button>
        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'REPORTS'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" /> My Filed Reports ({myReports.length})
        </button>
        <button
          onClick={() => setActiveTab('NOTIFS')}
          className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'NOTIFS'
              ? 'border-brand-500 text-brand-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Notifications & Matches ({myNotifs.length})
        </button>
      </div>

      {/* Tab 1: Claims List */}
      {activeTab === 'CLAIMS' && (
        <div className="space-y-6">
          {myClaims.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/80 rounded-3xl border border-slate-800 p-8 space-y-3">
              <Shield className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No active ownership claims filed</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                If you spot your misplaced item in the university directory, click &quot;Claim Item&quot; to initiate verification.
              </p>
              <Link
                href="/items"
                className="inline-block text-xs bg-brand-600 hover:bg-brand-500 text-white font-bold px-4 py-2 rounded-xl transition"
              >
                Browse Articles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-md hover:border-brand-500/50 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white">{claim.itemTitle}</h3>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            claim.status === 'APPROVED'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : claim.status === 'HANDOVER_COMPLETED'
                              ? 'bg-slate-800 text-slate-300 border border-slate-700'
                              : claim.status === 'REJECTED'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {claim.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Claim Reference: #{claim.id} • Submitted {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action */}
                    {claim.status === 'APPROVED' && (
                      <button
                        onClick={() => setSelectedPassClaim(claim)}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" /> View Digital Claim Pass
                      </button>
                    )}
                  </div>

                  {/* Proof and Remarks Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">
                        Your Verification Answer
                      </span>
                      <p className="text-slate-200 font-medium">{claim.verificationAnswerAttempt}</p>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">
                        Security Officer Remarks
                      </span>
                      <p className="text-slate-300">
                        {claim.securityOfficerRemarks || 'Under examination by vigilance officer.'}
                      </p>
                    </div>
                  </div>

                  {claim.status === 'APPROVED' && (
                    <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Present OTP <strong>#{claim.otp}</strong> or QR Code at Gate 1 Central Security Desk.</span>
                      </div>
                      <span className="font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-emerald-800 text-emerald-300">
                        OTP: {claim.otp}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Reports */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-4">
          {myReports.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/80 rounded-3xl border border-slate-800 p-8 space-y-3">
              <Layers className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No reports filed under your profile</h3>
              <div className="flex justify-center gap-3 pt-2">
                <Link
                  href="/report/lost"
                  className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl transition"
                >
                  Report Lost Article
                </Link>
                <Link
                  href="/report/found"
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl transition"
                >
                  Report Found Article
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myReports.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        item.type === 'LOST'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Status: {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base">{item.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>

                  <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-400" /> {item.location}
                    </span>
                    <Link
                      href={`/items/${item.id}`}
                      className="font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    >
                      Inspect <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Notifications Feed */}
      {activeTab === 'NOTIFS' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Notifications & Match History</h3>
          <div className="divide-y divide-slate-800">
            {myNotifs.map((n) => (
              <div key={n.id} className="py-4 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{n.title}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(n.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{n.message}</p>
                {n.link && (
                  <Link
                    href={n.link}
                    className="inline-block text-xs font-bold text-brand-400 hover:underline pt-1"
                  >
                    Open Details →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Digital Claim Pass Modal */}
      {selectedPassClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-700 space-y-4">
            <DigitalClaimPass claim={selectedPassClaim} />
            <button
              onClick={() => setSelectedPassClaim(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
