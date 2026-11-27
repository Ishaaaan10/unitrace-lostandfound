# 🎓 UniTrace — Campus Lost & Found Recovery Network
> **Full-Stack Web Development Lab Project | University Campus Systems**  
> *Engineered for instant deployment on [Vercel](https://vercel.com) & version-controlled with Git.*

---

## 🌟 Overview

**UniTrace** is an enterprise-grade fullstack web application designed for university campuses to streamline lost and found item recovery. Unlike unverified social boards or informal messaging groups where anyone can falsely claim valuable goods, **UniTrace** introduces an **Anti-Theft Cryptographic Handover Protocol**:

1. **Confidential Challenge Questions:** Reporters establish secret identifying marks (e.g., sticker layouts, lockscreen wallpaper, internal serials).
2. **Intelligent Smart AI Auto-Matcher:** Automatically analyzes incoming reports using a multi-factor weighted scoring algorithm across categories, keywords, campus facility zones, and timestamps.
3. **Campus Security Directorate Terminal:** Campus vigilance guards evaluate claims side-by-side with stored secrets, issue digital Claim Passes with dynamic QR codes and single-use 6-digit OTPs, and generate legal university custody restitution certificates.

---

## 🚀 Live Demo & Key Highlights

- **Campus Roles Built-in:** Instant 1-click Role Switcher in the top bar to evaluate the system as:
  - 👨‍🎓 **Aarav Sharma** (Student, Computer Science - Roll: `22BCS104`)
  - 👩‍🎓 **Priya Patel** (Student, Biotechnology - Roll: `23BBT089`)
  - 👮‍♂️ **Officer Rajesh Kumar** (Chief of Campus Vigilance - ID: `SEC-904`)
- **Dynamic Geospatial Campus Map:** Interactive clickable campus map visualizing item density and incident hotspots across university facilities.
- **Digital Claim Pass & QR Code:** Dynamic QR code generation with single-use 6-digit security OTP.
- **Formal Printable Handover Certificate:** Formal university letterhead certificate with officer and student signature acknowledgments.
- **Viva Defense Kit (`/viva-guide`):** Built-in examination manual with architectural blueprints, data flow diagrams, and answers to the top 8 fullstack lab questions.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict typing across domain models) |
| **Frontend & UI** | [React 18](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) |
| **State & Persistence** | React Context API with LocalStorage Synchronization & Fallback Seed Engine |
| **Backend & Routing** | Next.js Serverless Route Handlers (`/api/items`, `/api/claims`, `/api/handover`) |
| **DevOps & Cloud** | [Vercel](https://vercel.com) (Edge CDN, Automated CI/CD from GitHub) |

---

## 💻 Quick Start (Run Locally)

1. **Clone or navigate into the project directory:**
   ```bash
   cd unitrace-lost-and-found
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:3000
   ```

---

## 📦 How to Push to Your GitHub Repository

Follow these standard commands in your terminal:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files
git add .

# 3. Create your initial commit
git commit -m "feat: complete UniTrace campus lost and found fullstack system"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push code to GitHub
git push -u origin main
```

---

## ☁️ How to Host on Vercel in 1 Minute

UniTrace is architected specifically for zero-configuration deployment on **Vercel**:

1. Go to **[vercel.com](https://vercel.com)** and sign in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository (`YOUR_REPO_NAME`).
4. Framework Preset will automatically detect **Next.js**.
5. Leave all settings default (no external environment variables required).
6. Click **"Deploy"**.
7. In ~45 seconds, your live production website URL (e.g. `https://unitrace-lost-and-found.vercel.app`) will be active!

---

## 🔍 Smart Match Engine Architecture

The auto-matching engine (`src/lib/matchEngine.ts`) executes a deterministic similarity matrix:

$$\text{Score} = W_{\text{cat}} \cdot C + W_{\text{tokens}} \cdot T + W_{\text{loc}} \cdot L + W_{\text{date}} \cdot D$$

- **Category Match ($W_{\text{cat}} = 40\%$):** If category does not match, score is terminated to avoid false positives.
- **Tokenized Overlap ($W_{\text{tokens}} = 35\%$):** Strips punctuation and stop words; computes Jaccard-weighted overlap on distinctive model/brand keywords.
- **Campus Facility ($W_{\text{loc}} = 15\%$):** Proximity bonus if items occurred in the same building or zone.
- **Temporal Proximity ($W_{\text{date}} = 10\%$):** Bonus if reported within 24–48 hours of occurrence.

---

## 📝 60-Second Lab Presentation Walkthrough

When presenting to your lab instructor:
1. **Show the Hero & Metrics:** Point out the 88% Recovery Rate and live active counts.
2. **Open Found Item #102:** Show how the system detected a **95% Smart Match** with Aarav's lost MacBook.
3. **Demonstrate Claim Modal:** Point out the secret verification challenge (stickers & wallpaper test).
4. **Switch Roles to Officer Rajesh Kumar:** Demonstrate Role-Based Access Control via top bar.
5. **Approve Claim in Security Desk:** Show the side-by-side answer comparison.
6. **Enter 6-Digit OTP:** Show instant restitution validation and print the formal university certificate.

---

## 📄 License & Academic Integrity

Developed for academic lab submission and evaluation. Open source under the MIT License.
