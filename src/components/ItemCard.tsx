'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Sparkles,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { Item } from '../lib/types';
import { formatDisplayDate } from '../lib/dateUtils';

interface ItemCardProps {
  item: Item;
  hasMatch?: boolean;
}

export default function ItemCard({ item, hasMatch }: ItemCardProps) {
  const isLost = item.type === 'LOST';

  const categoryLabels: Record<string, string> = {
    ELECTRONICS: 'Electronics & Gadgets',
    WALLETS_IDS: 'Wallets & ID Cards',
    KEYS_CARDS: 'Keys & Access Cards',
    BOOKS_STATIONERY: 'Books & Stationery',
    BAGS_BACKPACKS: 'Bags & Backpacks',
    CLOTHING: 'Clothing & Apparel',
    ACCESSORIES: 'Watches & Accessories',
    OTHER: 'Miscellaneous',
  };

  const statusConfigs: Record<
    string,
    { label: string; bg: string; text: string; border: string }
  > = {
    OPEN: {
      label: isLost ? 'Searching for Item' : 'In Campus Holding',
      bg: isLost ? 'bg-rose-950/80' : 'bg-emerald-950/80',
      text: isLost ? 'text-rose-300' : 'text-emerald-300',
      border: isLost ? 'border-rose-800/80' : 'border-emerald-800/80',
    },
    CLAIM_PENDING: {
      label: 'Verification Pending',
      bg: 'bg-amber-950/80',
      text: 'text-amber-300',
      border: 'border-amber-800/80',
    },
    VERIFIED: {
      label: 'Claim Approved',
      bg: 'bg-blue-950/80',
      text: 'text-blue-300',
      border: 'border-blue-800/80',
    },
    RETURNED: {
      label: 'Returned to Owner',
      bg: 'bg-slate-800',
      text: 'text-slate-300',
      border: 'border-slate-700',
    },
  };

  const currentStatus = statusConfigs[item.status] || statusConfigs.OPEN;

  return (
    <div className="group bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-brand-500/50 shadow-md hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Media Container */}
      <div className="relative aspect-16/10 bg-slate-950 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Type Badge: LOST or FOUND */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-3 py-1 rounded-full text-xs font-black tracking-wide shadow-md uppercase ${
              isLost
                ? 'bg-rose-600 text-white shadow-rose-600/30'
                : 'bg-emerald-600 text-white shadow-emerald-600/30'
            }`}
          >
            {isLost ? 'LOST' : 'FOUND'}
          </span>

          {item.reward && (
            <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1 shadow-sm">
              <Gift className="w-3 h-3" /> Reward
            </span>
          )}
        </div>

        {/* Smart Match Indicator Badge */}
        {hasMatch && (
          <div className="absolute top-3 right-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-pulse">
            <Sparkles className="w-3 h-3 text-amber-300" /> Auto-Matched
          </div>
        )}

        {/* Custody Tag */}
        <div className="absolute bottom-2 left-2 bg-slate-950/90 backdrop-blur-md text-slate-200 border border-slate-800 text-[11px] px-2.5 py-0.5 rounded-md font-medium">
          {item.lockerNumber
            ? item.lockerNumber
            : item.currentCustody === 'CAMPUS_SECURITY_DESK'
            ? 'At Security Desk'
            : 'With Student Finder'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Category & Status */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-brand-300 bg-brand-950/80 px-2.5 py-0.5 rounded-md border border-brand-800/80 uppercase tracking-wider">
              {categoryLabels[item.category] || item.category}
            </span>
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}
            >
              {currentStatus.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-base group-hover:text-brand-400 transition line-clamp-1">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Location & Date */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
              <span className="font-medium text-slate-300">{item.location}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <div className="flex items-center gap-1 font-medium text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>{formatDisplayDate(item.date, item.time)}</span>
              </div>
              <span className="text-slate-500 truncate max-w-[120px]">By {item.reporterName}</span>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between">
          {item.secretVerificationQuestion ? (
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              <ShieldCheck className="w-3 h-3" /> Anti-Theft Protected
            </span>
          ) : (
            <span className="text-[11px] text-slate-500">Standard Verification</span>
          )}

          <Link
            href={`/items/${item.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300 group-hover:translate-x-0.5 transition"
          >
            {item.type === 'FOUND' && item.status !== 'RETURNED' ? 'Claim Item' : 'View Details'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
