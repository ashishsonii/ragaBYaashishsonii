# MedCore EHR — B2B Healthcare SaaS UI

A production-grade **Healthcare SaaS frontend** built with **React 19**, **TypeScript**, **Zustand**, **Firebase Authentication**, and **Service Worker** notifications. Implements a **micro-frontend architecture** with code-split module loading.

---

## Quick Start

```bash
npm install
npm run dev
```

> **Demo Mode**: Works out of the box. Any email/password will authenticate.

---

## Architecture

### Micro-Frontend Pattern

The application implements an **App Shell + Lazy Module** architecture — the same pattern used by Module Federation but achievable within a single Vite build:

```
┌─────────────────────────────────────────────────────┐
│                   App Shell (Host)                   │
│  ┌─────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Sidebar  │  │ TopNavbar │  │ CommandPalette     │ │
│  └─────────┘  └──────────┘  └────────────────────┘ │
│                                                     │
│  React.lazy() ──┬── DashboardPage (chunk)           │
│                 ├── AnalyticsPage  (chunk)           │
│                 ├── PatientsPage   (chunk)           │
│                 ├── NotificationsPage (chunk)        │
│                 └── LoginPage      (chunk)           │
│                                                     │
│  Zustand ───────┬── authStore                       │
│                 ├── patientStore                     │
│                 ├── notificationStore                │
│                 └── themeStore                       │
└─────────────────────────────────────────────────────┘
```

**Each page module:**
- Loads as a separate JavaScript chunk via `React.lazy()`
- Has its own Zustand store slice for domain state
- Contains all its own sub-components inline
- Could be extracted to a separate repo and loaded via Module Federation

**Build output** confirms code-splitting:
```
DashboardPage.js       8.53 kB
AnalyticsPage.js       6.22 kB
PatientsPage.js       10.03 kB
NotificationsPage.js   8.80 kB
LoginPage.js           6.62 kB
vendor-react.js      219.60 kB  (cached)
vendor-charts.js     383.39 kB  (cached)
```

### Vendor Chunking Strategy

```js
// vite.config.js — Manual chunk splitting
manualChunks(id) {
  if (id.includes('react-dom'))     return 'vendor-react'
  if (id.includes('recharts'))      return 'vendor-charts'
  if (id.includes('lucide-react'))  return 'vendor-icons'
  if (id.includes('zustand'))       return 'vendor-state'
}
```

---

## Tech Stack

| Requirement | Implementation |
|---|---|
| **React** | React 19 with functional components & hooks |
| **TypeScript** | Strict mode, centralized types (`src/types/index.ts`) |
| **State Management** | **Zustand** — 4 stores (`auth`, `patient`, `notification`, `theme`) |
| **Authentication** | **Firebase Auth** (Email/Password) with demo fallback |
| **Service Worker** | `public/sw.js` — push events, caching, message-triggered notifications |

---

## Project Structure

```
src/
├── App.tsx                          # App Shell — lazy loading, routing, guards
├── main.tsx                         # Boot: theme → auth → service worker
├── index.css                        # Design system (CSS custom properties, dual theme)
│
├── config/
│   └── firebase.ts                  # Firebase config (env-driven)
│
├── store/                           # Zustand stores (global state)
│   ├── authStore.ts                 # Auth: login/logout, session, Firebase listener
│   ├── patientStore.ts              # Patients: data, search, filter, view mode
│   ├── notificationStore.ts         # Alerts: notifications, toasts, unread count
│   └── themeStore.ts                # Theme: dark/light toggle, localStorage
│
├── types/
│   └── index.ts                     # All TypeScript interfaces
│
├── utils/
│   └── serviceWorker.ts             # SW registration, permission, notifications
│
├── data/
│   └── mockData.ts                  # Clinical mock data (12 patients, KPIs, charts)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx              # Collapsible nav with unread badge
│   │   └── TopNavbar.tsx            # Search, theme toggle, profile menu
│   └── ui/
│       ├── StatusBadge.tsx          # Semantic status indicator
│       ├── CommandPalette.tsx       # Ctrl+K command search
│       ├── Toast.tsx                # Toast notification system
│       ├── CriticalAlertModal.tsx   # Modal for critical acknowledgments
│       ├── Skeleton.tsx             # Skeleton loading variants
│       └── EmptyState.tsx           # Empty state component
│
└── pages/                           # ← Micro-app modules (lazy-loaded)
    ├── LoginPage.tsx                # Auth module
    ├── DashboardPage.tsx            # Dashboard module (KPIs + charts)
    ├── AnalyticsPage.tsx            # Analytics module (trends + performance)
    ├── PatientsPage.tsx             # Patient management module (grid/list)
    └── NotificationsPage.tsx        # Notification center module

public/
└── sw.js                            # Service Worker (push, fetch, message handlers)
```

---

## Requirements Compliance

### 1. Authentication ✅

| Feature | Status |
|---------|--------|
| Firebase Auth (Email/Password) | ✅ `src/config/firebase.ts` |
| Login validation | ✅ Form validation with error states |
| Error states | ✅ Inline error messages |
| Session handling | ✅ `sessionStorage` (demo) / `onAuthStateChanged` (Firebase) |
| Protected routes | ✅ `ProtectedRoute` component in `App.tsx` |
| Logout | ✅ Profile menu → Sign Out → redirect to `/login` |

### 2. Application Pages ✅

| Page | Route | Module |
|------|-------|--------|
| Login | `/login` | `LoginPage.tsx` |
| Dashboard | `/` | `DashboardPage.tsx` — KPI cards, area chart, bar chart, activity feed |
| Analytics | `/analytics` | `AnalyticsPage.tsx` — Readmission trends, mortality, satisfaction |
| Patients | `/patients` | `PatientsPage.tsx` — Grid/List with search & filter |
| Notifications | `/notifications` | `NotificationsPage.tsx` — Alert center |

### 3. Patient Details Module ✅

| Feature | Status |
|---------|--------|
| **Grid View** | ✅ Cards with avatar, status, allergies, DNR banners |
| **List View** | ✅ Full data table with acuity, room, physician columns |
| **Toggle switch** | ✅ Grid/List icon buttons |
| **Responsiveness** | ✅ 1-col → 2-col → 3-col grid breakpoints |
| **Search** | ✅ Real-time by name, MRN, or condition |
| **Filter** | ✅ Status dropdown (All / Critical / Observation / Stable) |

### 4. Notifications (Service Worker) ✅

| Feature | Status |
|---------|--------|
| Service Worker registration | ✅ `src/utils/serviceWorker.ts` → `public/sw.js` |
| Push notification support | ✅ Push event listener in `sw.js` |
| **Working use case** | ✅ Dashboard auto-triggers a lab result notification after 8s |
| **Test button** | ✅ "Test Push" button on Notifications page |
| Permission flow | ✅ Requests on first dashboard visit |
| Notification click handler | ✅ Opens/focuses app window |

### 5. State Management ✅

| Store | Domain | Key Actions |
|-------|--------|-------------|
| `authStore` | Authentication | `login()`, `logout()`, `initAuthListener()` |
| `patientStore` | Patient data | `setSearchQuery()`, `setStatusFilter()`, `setViewMode()` |
| `notificationStore` | Alerts | `markRead()`, `markAllRead()`, `openCriticalAlert()` |
| `themeStore` | UI theme | `toggleTheme()`, `setTheme()` |

### Bonus Features ✅

| Bonus | Implementation |
|-------|---------------|
| **Micro-frontend** | App Shell + React.lazy code-split modules + vendor chunking |
| **Reusable components** | `StatusBadge`, `EmptyState`, `Skeleton`, `Toast`, `CommandPalette`, `CriticalAlertModal` |
| **Performance** | Lazy loading, skeleton states, `useMemo` filtering, SW caching |
| **Clean structure** | `store/`, `types/`, `components/`, `pages/`, `utils/`, `config/` |
| **Dark/Light mode** | CSS custom properties + Zustand persistence |
| **Keyboard shortcuts** | Ctrl+K command palette |

---

## Design System

- **Dark theme**: Zinc palette (`#09090B` → `#18181B`)
- **Light theme**: Clean whites (`#FAFAFA` → `#FFFFFF`)
- **Accent**: Purple `#7C3AED` (used sparingly for CTAs and active states)
- **Typography**: Inter font, 4-level hierarchy (Display → Heading → Label → Caption)
- **Spacing**: 8px grid system
- **Cards**: 12px border-radius, 1px borders, no drop shadows
- **Accessibility**: WCAG 2.1 AA color contrast, focus rings, semantic HTML

---

## Firebase Setup (Optional)

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Deploy

```bash
npm run build
# Output in dist/ — deploy to Vercel/Netlify
```

For Vercel, add a `vercel.json` for SPA routing:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

Built for **Raga AI** Frontend Assignment — 2026
