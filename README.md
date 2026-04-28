<div align="center">
  <h1>MedCore EHR</h1>
  <p><strong>B2B Enterprise Healthcare SaaS Platform</strong></p>
  
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Zustand](https://img.shields.io/badge/Zustand-State-black?logo=react)](https://zustand-demo.pmnd.rs/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

  <br />

  [**View Live Demo**](https://ragaai-by-ashishsoni.vercel.app) •
  [**Explore Code**](https://github.com/ashishsonii/ragaBYaashishsonii)
</div>

---

## 🏥 Overview

MedCore is a production-grade frontend application built to simulate a modern, clinical healthcare environment. Moving away from flashy consumer designs, this application employs a **restrained, high-density enterprise aesthetic** tailored for medical professionals, featuring dark/light mode, real-time analytics, and patient management.

Built as a submission for the **Raga AI Frontend Assignment**.

---

## ✨ Core Features & Compliance

| Module | Features Implemented | Status |
|--------|---------------------|:---:|
| **Authentication** | Firebase Auth integration, validation, error states, and a smart "Demo Mode" fallback using `sessionStorage`. | ✅ |
| **Patient Module** | Interactive Grid & List (Table) views, real-time search by MRN/Name, status filtering, and acuity badges. | ✅ |
| **Dashboard** | KPI metrics, Recharts area/bar trends, and a recent activity feed. | ✅ |
| **Notifications** | Service Worker implementation with push events, read/unread toggles, and critical alert modals. | ✅ |
| **State Management** | Global state handled via **Zustand** (4 isolated stores: Auth, Patient, Theme, Notifications). | ✅ |

---

## 🏗️ Architecture & Engineering

### Micro-Frontend Pattern (Code Splitting)
To demonstrate scalability, the app utilizes an **App Shell + Lazy Module** architecture. Each page is loaded dynamically using `React.lazy()`, simulating a micro-frontend structure where modules can be built and chunked independently.

```text
dist/assets/
├── DashboardPage.js      (8.5 kB)
├── PatientsPage.js       (10.0 kB)
├── AnalyticsPage.js      (6.2 kB)
├── vendor-react.js       (React core)
└── vendor-charts.js      (Recharts)
```
*(Vendor chunking is explicitly configured in `vite.config.js` for optimal browser caching).*

### Design System
- **Palette**: Professional Zinc (`#09090B` to `#FAFAFA`) with Purple accents for primary actions.
- **Typography**: Inter font with strict hierarchy (Display → Heading → Label → Caption).
- **Structure**: 8px spatial grid, 12px rounded cards, no drop shadows (clean borders only).
- **Reusable Components**: Includes `StatusBadge`, `CommandPalette` (Ctrl+K), `Skeleton`, `EmptyState`, and `Toast`.

---

## 🚀 Quick Start

### Running Locally
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

> **Note on Authentication**: The app is designed to work immediately. If no Firebase `.env` variables are found, it gracefully falls back to a **Demo Mode**. You can log in using *any* email and password combo.

### Firebase Setup (Optional)
To test true Firebase Auth, create a `.env` file:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📂 Project Structure

```text
src/
├── components/          # Reusable UI & Layout components
├── config/              # Environment & Firebase initialization
├── data/                # Clinical mock datasets
├── pages/               # Lazy-loaded micro-frontend modules
├── store/               # Zustand state slices
├── types/               # Strict TypeScript interfaces
├── utils/               # Service Worker utilities
├── App.tsx              # App Shell and Routing logic
└── index.css            # CSS variables & global design tokens
```

---

<div align="center">
  <p>Engineered for performance, scalability, and clinical precision.</p>
</div>
