'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Phone, Mail, MapPin, RefreshCw, CheckCircle2, Heart } from 'lucide-react';
import { useItems } from '../context/ItemsContext';

export default function Footer() {
  const { resetData } = useItems();

  const handleReset = () => {
    if (confirm('Reset demo database to original state with seed items and users?')) {
      resetData();
      alert('Demo data restored successfully!');
      window.location.reload();
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Uni<span className="text-brand-400">Trace</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Central University Lost & Found Identification & Recovery System.
              Connecting students, campus vigilance, and library staff to quickly return
              misplaced items with cryptographic claim verification.
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-brand-400" /> Reset Demo Seed Data
            </button>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Campus Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/items" className="hover:text-brand-400 transition">
                  Browse All Lost & Found
                </Link>
              </li>
              <li>
                <Link href="/report/lost" className="hover:text-brand-400 transition">
                  Report a Lost Item
                </Link>
              </li>
              <li>
                <Link href="/report/found" className="hover:text-brand-400 transition">
                  Report a Found Item
                </Link>
              </li>
              <li>
                <Link href="/campus-map" className="hover:text-brand-400 transition">
                  Interactive Campus Map
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-400 transition">
                  Student Verification Desk
                </Link>
              </li>
              <li>
                <Link href="/security-desk" className="hover:text-brand-400 transition">
                  Campus Security Holding Area
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Vigilance Helpline */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Campus Security Contacts
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Central Lost & Found Desk, Main Gate Security HQ, Block A</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>24x7 Security Control: +91 98110 09988</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>security.vigilance@university.edu</span>
              </li>
            </ul>
          </div>

          {/* Academic & Fullstack Lab Submission Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Project & Viva Submission
            </h4>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <p className="font-semibold text-slate-200">
                Full-Stack Web Development Lab Project
              </p>
              <p className="text-[11px] text-slate-400">
                Course: CS-382 Fullstack Engineering
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-brand-900/60 text-brand-300 px-2 py-0.5 rounded text-[10px] font-mono">
                  Next.js 14
                </span>
                <span className="bg-indigo-900/60 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-mono">
                  TypeScript
                </span>
                <span className="bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded text-[10px] font-mono">
                  Tailwind CSS
                </span>
                <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
                  Vercel Ready
                </span>
              </div>
              <Link
                href="/viva-guide"
                className="inline-block text-brand-400 hover:text-brand-300 font-semibold text-[11px] pt-1"
              >
                View Viva Questions & Architecture Guide →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} UniTrace University Campus System. Built for Fullstack Lab Evaluation.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Academic Excellence & Safe Campus Living
          </p>
        </div>
      </div>
    </footer>
  );
}
