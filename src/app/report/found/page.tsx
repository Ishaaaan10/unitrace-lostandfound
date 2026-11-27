'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowLeft,
  Camera,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Lock,
  Building,
  HelpCircle,
} from 'lucide-react';
import { useItems } from '../../../context/ItemsContext';
import { useAuth } from '../../../context/AuthContext';
import { CAMPUS_ZONES } from '../../../lib/mockData';
import { getCurrentDateString, getCurrentTimeString } from '../../../lib/dateUtils';
import { ItemCategory, CustodyLocation } from '../../../lib/types';

const SAMPLE_PRESET_IMAGES = [
  {
    name: 'MacBook / Laptop',
    url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Backpack / Bag',
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Student ID Smartcard',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'AirPods / Earphones',
    url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Keys / Padlock',
    url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Scientific Calculator',
    url: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800&auto=format&fit=crop&q=80',
  },
];

export default function ReportFoundItemPage() {
  const router = useRouter();
  const { addItem } = useItems();
  const { currentUser, isSecurityOfficer } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('ELECTRONICS');
  const [campusZoneId, setCampusZoneId] = useState(CAMPUS_ZONES[1].id);
  const [specificLocation, setSpecificLocation] = useState('');
  const [date, setDate] = useState(getCurrentDateString());
  const [time, setTime] = useState(getCurrentTimeString());
  const [description, setDescription] = useState('');
  const [custody, setCustody] = useState<CustodyLocation>('CAMPUS_SECURITY_DESK');
  const [lockerNumber, setLockerNumber] = useState('Locker Shelf B-14');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
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
      type: 'FOUND',
      title: title.trim(),
      category,
      campusZoneId,
      location: locationStr,
      date,
      time,
      description: description.trim(),
      currentCustody: custody,
      lockerNumber: custody === 'CAMPUS_SECURITY_DESK' ? lockerNumber : undefined,
      secretVerificationQuestion: secretQuestion.trim() || 'Describe confidential identifying marks or wallpaper/contents.',
      secretVerificationAnswer: secretAnswer.trim() || 'Verified with security officer upon claim review.',
      imageUrl: imageUrl.trim() || SAMPLE_PRESET_IMAGES[0].url,
      status: 'OPEN',
      reporterName: currentUser.name,
      reporterRollNo: currentUser.rollNo,
      reporterEmail: currentUser.email,
      reporterPhone: currentUser.phone,
      reporterRole: currentUser.role === 'CAMPUS_SECURITY' ? 'CAMPUS_SECURITY' : 'STUDENT',
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
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-md mb-1 border border-emerald-800/80">
          <ShieldCheck className="w-3.5 h-3.5" /> Official Found Article Registration
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Report a Found Item
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Thank you for being a responsible member of the university community. Registering the found article allows the rightful owner to claim it.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
        {/* Finder Info Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div>
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Finder / Custodian</span>
            <span className="font-bold text-white">{currentUser.name}</span> ({currentUser.rollNo})
          </div>
          <div className="text-left sm:text-right">
            <span className="text-slate-500 block text-[10px] font-bold uppercase">Department</span>
            <span className="text-slate-300">{currentUser.department}</span>
          </div>
        </div>

        {/* Item Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Found Article Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Student ID Smartcard, Casio Calculator, Blue Bag..."
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
              Where on Campus Was It Found? <span className="text-rose-400">*</span>
            </label>
            <select
              value={campusZoneId}
              onChange={(e) => setCampusZoneId(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            >
              {CAMPUS_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Exact Landmark / Room <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Under dining bench outside Food Court, Table 3..."
              value={specificLocation}
              onChange={(e) => setSpecificLocation(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              When Did You Find It? <span className="text-rose-400">*</span>
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
                Date Discovered
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
                Time Discovered
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

        {/* Current Custody & Locker */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Building className="w-4 h-4 text-brand-400" /> Current Physical Holding & Custody
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">
                Where is the item currently kept?
              </label>
              <select
                value={custody}
                onChange={(e) => setCustody(e.target.value as CustodyLocation)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              >
                <option value="CAMPUS_SECURITY_DESK">Deposited at Gate 1 Main Security Desk</option>
                <option value="WITH_FINDER">Kept safely with Finder</option>
                <option value="DEPT_OFFICE">Handed over to Department Office</option>
              </select>
            </div>

            {custody === 'CAMPUS_SECURITY_DESK' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Security Locker / Storage Bin #
                </label>
                <input
                  type="text"
                  placeholder="e.g. Locker Shelf B-14, Drawer A-02"
                  value={lockerNumber}
                  onChange={(e) => setLockerNumber(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300">
            General Description (Avoid giving away secret features!) <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            placeholder="Describe the article broadly. Note: Do not reveal secret items inside or lockscreen details so you can test real owners!"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Verification Challenge */}
        <div className="bg-amber-950/40 border border-amber-900/60 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Lock className="w-4 h-4 text-amber-400" />
            Verification Question for Anyone Claiming This Article
          </div>
          <p className="text-[11px] text-amber-400">
            Ask a specific question only the true owner would know:
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Challenge Question
              </label>
              <input
                type="text"
                placeholder="e.g. Whose name is on the front? What is the wallpaper? What is in the front pocket?"
                value={secretQuestion}
                onChange={(e) => setSecretQuestion(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-amber-800/80 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Actual Secret Answer (For Security Officer Reference)
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Patel 23BBT089, Red Casio calculator inside, etc."
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-amber-800/80 bg-slate-950 text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Photo Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            Photograph
          </label>
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
            className="px-6 py-2.5 text-xs font-bold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isSubmitting ? 'Registering...' : 'Register Found Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
