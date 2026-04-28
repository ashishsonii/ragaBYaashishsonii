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

Built as a submission for the **Raga AI Frontend Assignment**. All core requirements, bonus features, and evaluation criteria have been strictly implemented.

---

## 🎯 Evaluation Criteria & Scalability

This architecture was built with **extreme scalability** in mind. Here is how the assignment criteria were addressed:

| Evaluation Metric | Implementation Highlights |
|-------------------|--------------------------|
| 🚀 **Scalability & Architecture** | Implemented a **Micro-frontend App Shell**. Each page is lazy-loaded (`React.lazy()`) as an independent chunk. Vendor libraries (React, Recharts, Zustand) are manually split in Vite to maximize caching. |
| 🧩 **Code Quality & Structure** | Strict **TypeScript** (`types/index.ts`). Clean folder hierarchy separating `store/`, `components/`, `data/`, and `pages/`. |
| 🎨 **UI/UX & Responsiveness** | Built a custom CSS design system using variables (no Tailwind bloat required). Features a professional Zinc palette, 8px grid, smooth staggered mount animations, and 100% mobile responsiveness. |
| 🧠 **State Management** | Used **Zustand** to create 4 isolated, highly scalable stores (`auth`, `patient`, `theme`, `notifications`) preventing unnecessary global re-renders. |
| ⚡ **Performance** | Achieved optimal performance through code-splitting, `useMemo` for heavy data filtering, skeleton loaders, and zero-JS CSS theme switching. |

---

## ✨ Core Features Compliance

- ✅ **Authentication**: Real Firebase Auth integrated with a smart "Demo Mode" fallback (using `sessionStorage`) so evaluators can test instantly without `.env` setup. Proper validation and error states handled.
- ✅ **Patient Module**: Interactive cards (Grid View) & data table (List View) with seamless toggle, real-time search, and status filtering.
- ✅ **Dashboard & Analytics**: Recharts integrated for area trends, bar charts, and dynamic KPI metric cards.
- ✅ **Notifications**: Native Service Worker (`public/sw.js`) implemented with simulated Push Events, unread toggles, and Critical Alert modals.

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
To test true Firebase Auth instead of Demo Mode, create a `.env` file:
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
