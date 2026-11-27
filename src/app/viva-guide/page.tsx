'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Shield,
  Layers,
  Database,
  Terminal,
  Cpu,
  CheckCircle2,
  Code,
  Sparkles,
  Server,
  Key,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

interface VivaQuestion {
  question: string;
  answer: string;
  keyPoints: string[];
}

const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    question: '1. What is the core problem UniTrace solves, and how does it prevent fraudulent claims?',
    answer:
      'Standard lost-and-found systems (like WhatsApp groups or physical notice boards) fail because anyone can falsely claim an attractive item like a MacBook or AirPods. UniTrace solves this through a cryptographic 3-stage Anti-Theft Protocol: (1) Reporters set a confidential ownership challenge question; (2) Claimants must submit secret identifying details (e.g., sticker positions, wallpaper, internal serials); (3) Campus Security verifies answers and issues a digital Claim Pass with a 6-digit OTP required for physical handover.',
    keyPoints: [
      'Confidential challenge question mechanism',
      'Two-way identity verification (Student ID + Roll No)',
      'Single-use 6-digit OTP required at physical security desk',
      'Formal audit receipt generated for university records',
    ],
  },
  {
    question: '2. Explain the high-level architecture of your fullstack web application.',
    answer:
      'UniTrace is built on the modern Next.js 14 App Router fullstack architecture. The Frontend utilizes React 18 with Tailwind CSS and Lucide icons for responsive, accessible UI. The State Layer leverages React Context API with persistent multi-tier storage (LocalStorage + In-Memory + REST API endpoints). The Backend consists of Next.js Route Handlers (/api/items, /api/claims, /api/handover) designed for serverless execution on Vercel Edge.',
    keyPoints: [
      'Next.js 14 App Router for client and server rendering',
      'REST API route handlers for resource CRUD',
      'Persistent state engine supporting zero-downtime serverless deployments',
      'Decoupled component architecture (Modular UI, Context, Types, Utilities)',
    ],
  },
  {
    question: '3. How does your Smart AI Auto-Matcher algorithm work?',
    answer:
      'The Smart Match Engine in `src/lib/matchEngine.ts` implements a multi-factor weighted scoring algorithm. When a lost or found item is reported, it computes a similarity score against active candidate items of the opposite type: (1) Category match contributes 40%; (2) Tokenized keyword overlap in title and description adds up to 35%; (3) Matching campus facility / zone adds 15%; (4) Date proximity within 48 hours adds 10%. If total score >= 45%, a match recommendation with clear explainability reasons is triggered.',
    keyPoints: [
      'Multi-factor weighted scoring model (Category + Keywords + Location + Date)',
      'Stop-word removal and text tokenization',
      'Explainable match reasons (transparent to users)',
      'Automated notification dispatch when score >= 60%',
    ],
  },
  {
    question: '4. How is state management and client-server persistence handled?',
    answer:
      'The application uses a dual-layer strategy: `ItemsContext` and `AuthContext` provide synchronous, ultra-fast reactive state across the application tree. For persistence across page reloads and browser sessions, state is synchronized to browser local storage via `src/lib/storage.ts`, backed by REST API route handlers. This ensures instant response times, zero server configuration overhead on Vercel, and persistent demo state.',
    keyPoints: [
      'React Context API for global reactive state',
      'Local persistence with fallback seed database',
      'One-click Demo Reset capability for clean viva presentations',
      'SSR-safe hydration checks preventing layout flashes',
    ],
  },
  {
    question: '5. What security mechanisms and Role-Based Access Controls (RBAC) are implemented?',
    answer:
      'UniTrace enforces strict role segregation: (1) Students can report lost/found items, file claims, and view digital claim passes; (2) Campus Security Officers (such as Officer Rajesh Kumar) have privileged access to the Security Desk to inspect secret expected answers, approve or decline claims, manage custody lockers, and execute OTP handover scans. Confidential answers are encrypted from regular students.',
    keyPoints: [
      'Role-based permission gating (Student vs Campus Security)',
      'Encrypted secret verification challenge answers hidden from public API',
      'Single-use handover OTP to prevent duplicate claims',
      'Full event audit trail recorded on every item',
    ],
  },
  {
    question: '6. Why did you choose Next.js and how is the project deployed to Vercel?',
    answer:
      'Next.js was selected for its native hybrid architecture (combining fast client transitions with serverless API capabilities), built-in image optimization, TypeScript support, and seamless deployment on Vercel. Deployment requires connecting the GitHub repository to Vercel; every Git push triggers automated build, linting, and instant global CDN distribution with zero server configuration.',
    keyPoints: [
      'Automated CI/CD from GitHub to Vercel',
      'Edge CDN caching for fast asset loading worldwide',
      'Zero-maintenance serverless hosting',
      'Production grade bundling with Tailwind CSS pruning',
    ],
  },
  {
    question: '7. How does the Digital Claim Pass and OTP handover workflow work?',
    answer:
      'Once a student files an ownership claim, it enters `PENDING_REVIEW`. The security officer checks the answer against the secret feature. Upon clicking "Approve", the claim moves to `APPROVED`, generating a dynamic 6-digit OTP and QR code pass. The student presents this pass at Gate 1 Security Desk. The officer inputs the OTP into the Security Scanner; upon successful match, the item status changes to `RETURNED` and a formal university restitution receipt is generated.',
    keyPoints: [
      'QR code dynamically rendered using standard QR protocols',
      'Cryptographic 6-digit numeric OTP',
      'Interactive handover scanner on security terminal',
      'Printable university legal receipt for liability closure',
    ],
  },
  {
    question: '8. How can this project be scaled in a real-world enterprise university deployment?',
    answer:
      'In a production enterprise deployment: (1) Integrate university Single Sign-On (SSO / OAuth 2.0 / SAML) with student email domains; (2) Connect to PostgreSQL or Supabase with Prisma ORM; (3) Incorporate AWS S3 / Cloudinary for student image uploads; (4) Add WhatsApp / SMS / Push notifications via Twilio or Firebase; (5) Utilize computer vision (e.g. OpenAI CLIP or MobileNet) for image similarity comparison.',
    keyPoints: [
      'University SSO / LDAP integration',
      'PostgreSQL database via Prisma ORM',
      'Cloud storage for camera and high-resolution photo uploads',
      'Computer Vision deep learning for image feature matching',
    ],
  },
];

export default function VivaGuidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Award className="w-3.5 h-3.5 text-emerald-600" /> Fullstack Lab Submission & Viva Defense Kit
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Project Architecture & Viva Defense Manual
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
          Everything you need to explain, defend, and demonstrate UniTrace during your Fullstack Web Development Lab evaluation and viva examination.
        </p>
      </div>

      {/* 60-Second Viva Demo Script */}
      <div className="bg-linear-to-r from-brand-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black tracking-tight">
            60-Second Lab Demonstration Script (For Viva Presentation)
          </h2>
        </div>
        <p className="text-xs text-slate-300">
          Follow these 6 steps to demonstrate all project features to your professor in under 1 minute:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-amber-400 font-mono font-bold text-xs">Step 1: Homepage & Metrics</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Show the live hero, search bar, and recovery rate metrics (88% recovery rate, items returned counter).
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-amber-400 font-mono font-bold text-xs">Step 2: Smart AI Matching</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Open <Link href="/items/item-101" className="underline font-bold text-amber-300">Item #101</Link> (MacBook Air) and highlight the 95% Match banner detected automatically!
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-amber-400 font-mono font-bold text-xs">Step 3: Anti-Theft Challenge</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Demonstrate the confidential verification question (stickers and wallpaper) and show the Claim submission modal.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-amber-400 font-mono font-bold text-xs">Step 4: Role Switcher Demo</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Use top ribbon role switcher to switch to <strong>Officer Rajesh Kumar (Campus Security)</strong>.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-amber-400 font-mono font-bold text-xs">Step 5: Security Review & Approval</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Visit Security Desk, compare secret answers side-by-side, and approve the claim to issue a Claim Pass.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1.5">
            <span className="text-amber-400 font-mono font-bold text-xs">Step 6: OTP Scan & Legal Receipt</span>
            <p className="text-xs text-slate-200 leading-relaxed">
              Enter the 6-digit OTP in Security Terminal. Show the instant verification and printable university receipt!
            </p>
          </div>
        </div>
      </div>

      {/* Architecture Overview Diagram */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 bg-brand-950/80 px-2.5 py-0.5 rounded-md border border-brand-800/80">
            <Layers className="w-3.5 h-3.5" /> Fullstack Architectural Blueprint
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            System Design & Technology Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Frontend Tier */}
          <div className="border border-slate-800 rounded-2xl p-5 space-y-2.5 bg-slate-950/80">
            <div className="w-8 h-8 rounded-lg bg-brand-950 text-brand-400 border border-brand-800 flex items-center justify-center font-bold">
              <Code className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Frontend Presentation</h3>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• Next.js 14 App Router</li>
              <li>• React 18 Functional Components</li>
              <li>• Tailwind CSS Dark Theme</li>
              <li>• Lucide Modern Icons</li>
              <li>• Responsive Grid & Flexbox</li>
            </ul>
          </div>

          {/* State & Logic Tier */}
          <div className="border border-slate-800 rounded-2xl p-5 space-y-2.5 bg-slate-950/80">
            <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">State & Algorithms</h3>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• React Context API (Auth & Items)</li>
              <li>• Smart Weighted Match Engine</li>
              <li>• Text Tokenization & Jaccard Weight</li>
              <li>• Role-Based Access Control (RBAC)</li>
              <li>• Dynamic QR Code Generation</li>
            </ul>
          </div>

          {/* Backend & REST API */}
          <div className="border border-slate-800 rounded-2xl p-5 space-y-2.5 bg-slate-950/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Backend & APIs</h3>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• Next.js Serverless Route Handlers</li>
              <li>• RESTful JSON Endpoints</li>
              <li>• Cryptographic 6-digit OTP logic</li>
              <li>• Persistent LocalStorage Engine</li>
              <li>• Schema Validation & Sanitization</li>
            </ul>
          </div>

          {/* Deployment & DevOps */}
          <div className="border border-slate-800 rounded-2xl p-5 space-y-2.5 bg-slate-950/80">
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Deployment & Cloud</h3>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• Hosted on Vercel App</li>
              <li>• GitHub Version Controlled</li>
              <li>• Zero-Config Serverless Deployment</li>
              <li>• Edge Network & CDN Caching</li>
              <li>• Ready for Prisma + PostgreSQL</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Viva Questions & Answers Accordion */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-md space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-300 bg-brand-950/80 border border-brand-800/80 px-2.5 py-0.5 rounded-md mb-1">
            <BookOpen className="w-3.5 h-3.5" /> Examiner FAQ
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Top 8 Fullstack Lab Viva Questions & Answers
          </h2>
          <p className="text-xs text-slate-400">
            Click on any question below to inspect the expected response and key concepts to mention.
          </p>
        </div>

        <div className="space-y-3">
          {VIVA_QUESTIONS.map((q, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 bg-slate-950/80 hover:bg-slate-850 transition cursor-pointer"
                >
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {q.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-4 text-xs">
                    <p className="text-slate-300 leading-relaxed font-sans">{q.answer}</p>

                    <div className="bg-brand-950/60 p-3.5 rounded-xl border border-brand-800/80 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300 block">
                        Key Points to Mention to Examiner:
                      </span>
                      <ul className="space-y-1 text-slate-300 text-[11px]">
                        {q.keyPoints.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
