'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Compass, Layers, ArrowLeft, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import CampusZoneMap from '../../components/CampusZoneMap';
import ItemCard from '../../components/ItemCard';
import { useItems } from '../../context/ItemsContext';
import { CAMPUS_ZONES } from '../../lib/mockData';

export default function CampusMapPage() {
  const { items } = useItems();
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const activeZone = CAMPUS_ZONES.find((z) => z.id === selectedZoneId);

  const zoneItems = items.filter((item) => {
    if (!selectedZoneId) return true;
    return item.campusZoneId === selectedZoneId;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Registry
        </Link>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-md mb-2 border border-brand-200">
          <Compass className="w-3.5 h-3.5" /> Geospatial Campus Facilities
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Interactive Campus Map & Zone Hotspots
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore registered reports by campus facility. Pinpoint where items were misplaced or retrieved.
        </p>
      </div>

      {/* Interactive Map Component */}
      <CampusZoneMap
        selectedZoneId={selectedZoneId}
        onSelectZone={(id) => setSelectedZoneId(id)}
      />

      {/* Items in Selected Zone */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {activeZone ? `Articles in ${activeZone.name}` : 'All Campus Articles'}
            </h2>
            <p className="text-xs text-slate-500">
              {zoneItems.length} registered reports {activeZone ? `within ${activeZone.code}` : 'across all campus grounds'}.
            </p>
          </div>

          {selectedZoneId && (
            <button
              onClick={() => setSelectedZoneId(null)}
              className="text-xs font-bold text-brand-600 hover:text-brand-800 cursor-pointer"
            >
              Show All Zones
            </button>
          )}
        </div>

        {zoneItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No active incidents in this zone</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No lost or found items are currently registered for this campus facility.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {zoneItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
