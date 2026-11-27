'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Compass, Layers, ArrowRight, Shield } from 'lucide-react';
import { CAMPUS_ZONES } from '../lib/mockData';
import { useItems } from '../context/ItemsContext';
import { CampusZone } from '../lib/types';

interface CampusZoneMapProps {
  onSelectZone?: (zoneId: string | null) => void;
  selectedZoneId?: string | null;
}

export default function CampusZoneMap({
  onSelectZone,
  selectedZoneId,
}: CampusZoneMapProps) {
  const { items } = useItems();
  const [activeZone, setActiveZone] = useState<CampusZone | null>(
    selectedZoneId ? CAMPUS_ZONES.find((z) => z.id === selectedZoneId) || null : null
  );

  const getZoneStats = (zoneId: string) => {
    const zoneItems = items.filter((i) => i.campusZoneId === zoneId && i.status !== 'RETURNED');
    const lostCount = zoneItems.filter((i) => i.type === 'LOST').length;
    const foundCount = zoneItems.filter((i) => i.type === 'FOUND').length;
    return { total: zoneItems.length, lost: lostCount, found: foundCount };
  };

  const handleZoneClick = (zone: CampusZone) => {
    const isSame = activeZone?.id === zone.id;
    const nextZone = isSame ? null : zone;
    setActiveZone(nextZone);
    if (onSelectZone) {
      onSelectZone(nextZone ? nextZone.id : null);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 bg-brand-950/80 px-2.5 py-0.5 rounded-md mb-1 border border-brand-800/80">
            <Compass className="w-3.5 h-3.5" /> Interactive Campus Geospatial Grid
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Campus Zones & Incident Hotspots
          </h3>
          <p className="text-xs text-slate-400">
            Click on any university landmark to inspect active lost and found reports in that zone.
          </p>
        </div>

        {activeZone && (
          <button
            onClick={() => handleZoneClick(activeZone)}
            className="self-start sm:self-auto text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* SVG Campus Map Graphic Container */}
      <div className="relative aspect-16/10 sm:aspect-21/9 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
        {/* Campus Map Background Graphic Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Road and walkway grid graphics */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 50 200 L 950 200 M 500 20 L 500 500 M 200 50 L 800 450 M 800 50 L 200 450"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="6,6"
          />
          <circle cx="500" cy="250" r="120" stroke="#6366f1" strokeWidth="1.5" fill="none" opacity="0.3" />
        </svg>

        {/* Zone Markers Pinpoints */}
        {CAMPUS_ZONES.map((zone) => {
          const stats = getZoneStats(zone.id);
          const isSelected = activeZone?.id === zone.id;

          return (
            <div
              key={zone.id}
              style={{
                left: `${zone.xPercent}%`,
                top: `${zone.yPercent}%`,
              }}
              onClick={() => handleZoneClick(zone)}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            >
              {/* Pulsing ring if active items */}
              {stats.total > 0 && (
                <span className="absolute -inset-2 rounded-full bg-brand-500/30 animate-ping pointer-events-none" />
              )}

              {/* Marker Bubble */}
              <div
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shadow-lg ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-110 z-30'
                    : stats.total > 0
                    ? 'bg-brand-600 text-white hover:bg-brand-500 hover:scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-300'}`} />
                <span className="truncate max-w-[100px] sm:max-w-none">{zone.code}</span>
                {stats.total > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-900 text-white' : 'bg-white/20 text-white'
                    }`}
                  >
                    {stats.total}
                  </span>
                )}
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-slate-950 text-white text-[11px] p-2.5 rounded-xl shadow-xl border border-slate-800 whitespace-nowrap z-40 pointer-events-none">
                <p className="font-bold text-white">{zone.name}</p>
                <p className="text-[10px] text-slate-400">{zone.building}</p>
                <div className="mt-1 pt-1 border-t border-slate-800 flex gap-2 text-[10px]">
                  <span className="text-rose-400">Lost: {stats.lost}</span>
                  <span className="text-emerald-400">Found: {stats.found}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Zone Deep Dive Card */}
      {activeZone && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold text-white">{activeZone.name}</h4>
                <span className="bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {activeZone.code}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{activeZone.building}</p>
              <p className="text-xs text-slate-400 mt-1 italic">{activeZone.description}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 shadow-2xs">
                <span className="text-[10px] font-bold text-rose-400 block uppercase">Lost Here</span>
                <span className="text-base font-black text-white">
                  {getZoneStats(activeZone.id).lost}
                </span>
              </div>
              <div className="text-center bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-400 block uppercase">Found Here</span>
                <span className="text-base font-black text-white">
                  {getZoneStats(activeZone.id).found}
                </span>
              </div>
              <Link
                href={`/items?zone=${activeZone.id}`}
                className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
              >
                Browse Items
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
