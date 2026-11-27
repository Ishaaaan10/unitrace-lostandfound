'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import { MatchRecommendation } from '../lib/types';

interface SmartMatchBannerProps {
  recommendation: MatchRecommendation;
  currentType: 'LOST' | 'FOUND';
}

export default function SmartMatchBanner({
  recommendation,
  currentType,
}: SmartMatchBannerProps) {
  const { lostItem, foundItem, confidenceScore, matchReasons } = recommendation;
  const counterpart = currentType === 'LOST' ? foundItem : lostItem;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-brand-900 to-purple-950 p-5 text-white shadow-xl border border-indigo-500/30">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-brand-500/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              {confidenceScore}% Match Detected
            </span>
            <span className="text-xs text-indigo-200">UniTrace Smart AI Matcher</span>
          </div>

          <h4 className="text-base font-bold text-white">
            Matching {counterpart.type === 'FOUND' ? 'Found' : 'Lost'} Item Detected: &quot;{counterpart.title}&quot;
          </h4>

          {/* Match Reasons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {matchReasons.map((reason, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] bg-white/10 text-indigo-100 px-2.5 py-0.5 rounded-md border border-white/10"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {reason}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0 flex items-center gap-3 w-full md:w-auto">
          <Link
            href={`/items/${counterpart.id}`}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-brand-900 font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition shadow-lg text-xs"
          >
            Review & Compare Match
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
