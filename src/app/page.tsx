'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Shield,
  Sparkles,
  ArrowRight,
  PlusCircle,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Award,
  ChevronRight,
  HelpCircle,
  Lock,
  Building,
} from 'lucide-react';
import { useItems } from '../context/ItemsContext';
import ItemCard from '../components/ItemCard';
import SmartMatchBanner from '../components/SmartMatchBanner';

export default function HomePage() {
  const router = useRouter();
  const { items } = useItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/items');
    }
  };

  const lostCount = items.filter((i) => i.type === 'LOST' && i.status !== 'RETURNED').length;
  const foundCount = items.filter((i) => i.type === 'FOUND' && i.status !== 'RETURNED').length;
  const returnedCount = items.filter((i) => i.status === 'RETURNED').length;
  const totalCount = items.length;

  const quickCategories = [
    { id: 'ALL', label: 'All Items' },
    { id: 'ELECTRONICS', label: '💻 Electronics' },
    { id: 'WALLETS_IDS', label: '🪪 ID Cards & Wallets' },
    { id: 'KEYS_CARDS', label: '🔑 Keys' },
    { id: 'BAGS_BACKPACKS', label: '🎒 Bags' },
    { id: 'BOOKS_STATIONERY', label: '📚 Books' },
  ];

  const displayedItems = items
    .filter((i) => {
      if (filterType !== 'ALL' && i.type !== filterType) return false;
      if (selectedCategory !== 'ALL' && i.category !== selectedCategory) return false;
      return true;
    })
    .slice(0, 6);

  // Check if there's any open match (e.g. MacBook Air items)
  const lostMacBook = items.find((i) => i.id === 'item-101');
  const foundMacBook = items.find((i) => i.id === 'item-102');

  return (
    <div className="space-y-12 pb-16">
      {/* Hero & Quick Student Action Launchpad */}
      <section className="relative overflow-hidden bg-linear-to-b from-brand-950/80 via-slate-900 to-slate-950 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          {/* Header Title */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand-950/80 border border-brand-700/60 px-3.5 py-1 rounded-full text-xs font-semibold text-brand-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Lost & Found Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Lost Something on Campus? <br className="hidden sm:inline" />
              <span className="bg-linear-to-r from-brand-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                We&apos;ll Help You Recover It.
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Report lost belongings or register found articles. Powered by anti-theft secret questions, AI matching, and Gate 1 OTP verification.
            </p>
          </div>

          {/* TWO PRIMARY STUDENT ACTION CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {/* Card 1: I Lost Something */}
            <div className="group bg-gradient-to-br from-rose-950/50 via-slate-900 to-slate-900/90 border border-rose-900/40 hover:border-rose-500/60 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800">
                    Lost Report
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-rose-200 transition">
                    I Lost Something
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Submit article details, set an anti-theft verification question, and receive automated match alerts when found.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-rose-950/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  <strong className="text-rose-400">{lostCount}</strong> active reports
                </span>
                <Link
                  href="/report/lost"
                  className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Report Lost Item
                </Link>
              </div>
            </div>

            {/* Card 2: I Found Something */}
            <div className="group bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-900/90 border border-emerald-900/40 hover:border-emerald-500/60 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                    Found Report
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-emerald-200 transition">
                    I Found Something
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Found an ID card, laptop, keys, or notebook? Register it safely and route it to Gate 1 Central Security.
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-emerald-950/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  <strong className="text-emerald-400">{foundCount}</strong> items in custody
                </span>
                <Link
                  href="/report/found"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Report Found Item
                </Link>
              </div>
            </div>
          </div>

          {/* QUICK SEARCH & CATEGORIES */}
          <div className="max-w-4xl mx-auto space-y-3 pt-2">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl flex items-center gap-2"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-brand-400" />
              </div>
              <input
                type="text"
                placeholder="Search by article name (e.g. MacBook, Priya's ID, Honda Keys, Jansport Bag)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden px-2"
              />
              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Quick Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
              {quickCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-brand-950 text-brand-300 border border-brand-500/80 shadow-xs'
                      : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Status Badges Strip */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 max-w-4xl mx-auto">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> 100% Anti-Theft Verification
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Multi-Factor AI Matching
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-brand-400" /> 8 Campus Facilities Monitored
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Building className="w-3.5 h-3.5 text-indigo-400" /> Gate 1 Central Security Depot
            </span>
          </div>
        </div>
      </section>

      {/* SMART MATCH SPOTLIGHT (If applicable) */}
      {lostMacBook && foundMacBook && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SmartMatchBanner
            recommendation={{
              lostItem: lostMacBook,
              foundItem: foundMacBook,
              confidenceScore: 95,
              matchReasons: [
                'Exact Category Match: Electronics',
                'Zone Match: Central Library (2nd Floor)',
                'Hardware Overlap: Apple MacBook Air M2',
              ],
            }}
            currentType="LOST"
          />
        </section>
      )}

      {/* RECENT CAMPUS ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Recently Reported Articles
            </h2>
            <p className="text-xs text-slate-400">
              Live updates across all university departments, laboratories, and residence halls.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start sm:self-auto">
            {(['ALL', 'LOST', 'FOUND'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  filterType === t
                    ? 'bg-brand-950 text-brand-300 border border-brand-700/60 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'ALL' ? 'All Articles' : t === 'LOST' ? 'Lost Only' : 'Found Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Item Cards Grid */}
        {displayedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-300">No items match the selected category.</p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setFilterType('ALL');
              }}
              className="text-xs text-brand-400 hover:underline font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center pt-2">
          <Link
            href="/items"
            className="inline-flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold px-6 py-2.5 rounded-xl border border-slate-700 transition"
          >
            Explore All Campus Records ({totalCount})
            <ArrowRight className="w-4 h-4 text-brand-400" />
          </Link>
        </div>
      </section>

      {/* HOW UNITRACE WORKS (Clean 3-Step Card Strip) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
          <div className="max-w-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Anti-Theft Protocol
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              How We Safeguard Student Belongings
            </h3>
            <p className="text-xs text-slate-400">
              UniTrace prevents fraudulent claims with a secure 3-step verification system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Report & Set Secret Challenge</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add a private challenge question (e.g., sticker details, wallpaper, lock screen) to verify genuine ownership.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Multi-Factor AI Matching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our algorithm scores category, keywords, campus zone, and timestamp to automatically pair items.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Gate 1 OTP Handover</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Security verifies answers, generates a Digital Claim Pass with a 6-digit OTP, and marks item returned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK CAMPUS MAP LINK BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-brand-500/20 text-brand-300 px-2.5 py-0.5 rounded-full border border-brand-500/30">
                Interactive Radar
              </span>
              <span className="text-xs text-slate-400">8 Campus Facilities</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Locate Lost & Found Articles Across University Buildings
            </h3>
            <p className="text-xs text-slate-400">
              View live counts for Central Library, Cafeteria, Tech Block, Science Labs, and Sports Complex on the interactive campus map.
            </p>
          </div>

          <Link
            href="/campus-map"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow-lg shadow-brand-600/20 shrink-0"
          >
            <MapPin className="w-4 h-4" /> Open Campus Map
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* VIVA DEFENSE LAB BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-800/40">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/30">
              Fullstack Engineering Lab Submission
            </span>
            <h3 className="text-lg sm:text-xl font-black">
              Ready to Defend Your Project in Front of the Professor?
            </h3>
            <p className="text-xs text-slate-300">
              Review the 60-Second Viva Script, Architecture Blueprint, and answers to top examination questions.
            </p>
          </div>
          <Link
            href="/viva-guide"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition shadow-lg shrink-0"
          >
            Open Viva Defense Kit
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
