'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Lock,
  Gift,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { useItems } from '../../../context/ItemsContext';
import { useAuth } from '../../../context/AuthContext';
import { CAMPUS_ZONES } from '../../../lib/mockData';
import { getCurrentDateString, getCurrentTimeString } from '../../../lib/dateUtils';
import { ItemCategory } from '../../../lib/types';

const SAMPLE_PRESET_IMAGES = [
  {
    name: 'MacBook / Laptop',
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Backpack / Bag',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Student ID Card',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'AirPods / Earbuds',
    url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Vehicle / Room Keys',
    url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Books / Notebooks',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
  },
];

export default function ReportLostItemPage() {
  const router = useRouter();
  const { addItem } = useItems();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('ELECTRONICS');
  const [campusZoneId, setCampusZoneId] = useState(CAMPUS_ZONES[0].id);
  const [specificLocation, setSpecificLocation] = useState('');
  const [date, setDate] = useState(getCurrentDateString());
  const [time, setTime] = useState(getCurrentTimeString());
  const [description, setDescription] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [reward, setReward] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_PRESET_IMAGES[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const zone = CAMPUS_ZONES.find((z) => z.id === campusZoneId);
    const locationStr = specificLocation.trim()
      ? `${zone?.name} - ${specificLocation.trim()}`
      : zone?.name || 'Campus Grounds';

    const newItem = addItem({
      type: 'LOST',
      title: title.trim(),
      category,
      campusZoneId,
      location: locationStr,
      date,
      time,
      description: description.trim(),
      secretVerificationQuestion: secretQuestion.trim() || 'Describe distinctive scratches, stickers, or internal contents.',
      secretVerificationAnswer: secretAnswer.trim() || 'Verified by reporter during physical claim review.',
      reward: reward.trim() || undefined,
      imageUrl: imageUrl.trim() || SAMPLE_PRESET_IMAGES[0].url,
      status: 'OPEN',
      reporterName: currentUser.name,
      reporterRollNo: currentUser.rollNo,
      reporterEmail: currentUser.email,
      reporterPhone: currentUser.phone,
      reporterRole: currentUser.role === 'CAMPUS_SECURITY' ? 'CAMPUS_SECURITY' : 'STUDENT',
      currentCustody: 'CAMPUS_SECURITY_DESK',
    });

    setTimeout(() => {
      router.push(`/items/${newItem.id}`);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top back link */}
      <div>
        <Link
          href="/items"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </Link>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-md mb-1 border border-rose-800/80">
          <ShieldAlert className="w-3.5 h-3.5" /> Official Lost Article Filing
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Report a Lost Item
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Provide complete item details. Our AI matcher immediately indexes your report against all found items registered on campus.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
        {/* Reporter info bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Reporting Student</span>
            <span className="font-bold text-white">{currentUser.name}</span> ({currentUser.rollNo})
          </div>
          <div className="text-left sm:text-right">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Official University Contact</span>
            <span className="text-slate-300 font-mono">{currentUser.email} • {currentUser.phone}</span>
          </div>
        </div>

        {/* Item Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Item Title / Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. MacBook Air M2 Space Grey, Casio Calculator..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Category <span className="text-rose-400">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ItemCategory)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            >
              <option value="ELECTRONICS">Electronics & Gadgets</option>
              <option value="WALLETS_IDS">Wallets & University IDs</option>
              <option value="KEYS_CARDS">Keys & Access Cards</option>
              <option value="BOOKS_STATIONERY">Books & Study Material</option>
              <option value="BAGS_BACKPACKS">Bags & Backpacks</option>
              <option value="CLOTHING">Clothing & Apparel</option>
              <option value="ACCESSORIES">Watches & Accessories</option>
              <option value="OTHER">Other Belongings</option>
            </select>
          </div>
        </div>

        {/* Location & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Campus Facility / Zone <span className="text-rose-400">*</span>
            </label>
            <select
              value={campusZoneId}
              onChange={(e) => setCampusZoneId(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            >
              {CAMPUS_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.building})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Specific Room / Location Detail <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 2nd Floor Reading Room Cubicle 14, Table near water cooler..."
              value={specificLocation}
              onChange={(e) => setSpecificLocation(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              When Did You Lose It? <span className="text-rose-400">*</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setDate(getCurrentDateString());
                setTime(getCurrentTimeString());
              }}
              className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Clock className="w-3 h-3" /> Set to Right Now
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-400">
                Date Lost
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-slate-400">
                Time (Approximate)
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Detailed Physical Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300">
            Public Physical Description <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe make, model, color, brand, and visible marks that help people recognize it..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Anti-Theft Verification Challenge Box */}
        <div className="bg-amber-950/40 border-2 border-amber-900/60 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                Anti-Theft Confidential Verification Challenge
              </h4>
              <p className="text-[11px] text-amber-400">
                Set a secret test to verify ownership before someone else claims your found item.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Challenge Question (Publicly visible to finder / claimant) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. What stickers are on the back? What is the desktop wallpaper?"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-amber-800/80 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Secret Expected Answer (Encrypted & visible only to you and Campus Security) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. GitHub sticker on left, React atom on right; Interstellar wallpaper."
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-amber-800/80 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Optional Reward */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-amber-400" /> Optional Finder&apos;s Gratitude / Reward
          </label>
          <input
            type="text"
            placeholder="e.g. ₹500, High Gratitude & Cafeteria Treat..."
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Photo Selection / Presets */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            Article Photograph / Visual Representation
          </label>
          <p className="text-[11px] text-slate-400">
            Choose a campus preset matching your item type or paste an image URL:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SAMPLE_PRESET_IMAGES.map((preset) => (
              <button
                type="button"
                key={preset.name}
                onClick={() => setImageUrl(preset.url)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                  imageUrl === preset.url
                    ? 'border-brand-500 bg-brand-950/80 ring-2 ring-brand-500/30'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-9 h-9 rounded-lg object-cover"
                />
                <span className="text-[11px] font-bold text-slate-300 truncate">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>

          <div className="pt-2">
            <input
              type="url"
              placeholder="Or paste external custom image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <Link
            href="/items"
            className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 rounded-xl shadow-md shadow-rose-600/20 transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isSubmitting ? 'Registering...' : 'Register Lost Report'}
          </button>
        </div>
      </form>
    </div>
  );
}
