import React, { Suspense, useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import TopNavbar from './components/layout/TopNavbar'
import CommandPalette from './components/ui/CommandPalette'
import { ToastContainer } from './components/ui/Toast'
import { useAuthStore } from './store/authStore'
import { useToastStore } from './store/notificationStore'
import { showLocalNotification, requestNotificationPermission } from './utils/serviceWorker'

/* ============================================
   Micro-Frontend Architecture: Lazy Module Loading
   ============================================
   Each page is a self-contained "micro-app" loaded via
   React.lazy + dynamic import, producing separate chunks.
   This mirrors a Module Federation setup where each module
   could be extracted into its own build pipeline.
   ============================================ */

const LoginPage = React.lazy(() => import('./pages/LoginPage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage'))
const PatientsPage = React.lazy(() => import('./pages/PatientsPage'))
const NotificationsPage = React.lazy(() => import('./pages/NotificationsPage'))

/* ——— Module Loading Fallback ——— */
function ModuleLoader() {
  return (
    <div className="flex items-center justify-center" style={{ height: 300 }}>
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin" style={{ width: 20, height: 20, border: '2px solid var(--color-border)', borderTopColor: 'var(--color-action)', borderRadius: '50%' }} />
        <span className="text-caption">Loading module...</span>
      </div>
    </div>
  )
}

/* ——— Protected Route Guard ——— */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen" style={{ backgroundColor: 'var(--color-canvas)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
          <span style={{ fontSize: 13, color: 'var(--color-text-disabled)' }}>Verifying session...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

/* ——— App Shell (Micro-Frontend Host) ——— */
function AppShell() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const location = useLocation()
  const { toasts, addToast, dismissToast } = useToastStore()

  // Global Cmd+K / Ctrl+K handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Request notification permission + demo notification on dashboard load
  useEffect(() => {
    if (location.pathname === '/') {
      requestNotificationPermission()

      const timer = setTimeout(() => {
        addToast({
          type: 'info',
          title: 'System Online',
          message: 'All clinical systems are operational.',
          duration: 5000,
        })
      }, 2500)

      // Trigger a Service Worker push notification (working use case)
      const notifTimer = setTimeout(() => {
        showLocalNotification(
          'MedCore EHR — Lab Results',
          'Critical: Troponin I 12.4 ng/mL for Maria Gonzalez (MRN-78235). Immediate review required.',
          'medcore-lab-critical'
        )
      }, 8000)

      return () => { clearTimeout(timer); clearTimeout(notifTimer) }
    }
  }, [location.pathname, addToast])

  // Track sidebar collapse/expand
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const sidebar = document.getElementById('sidebar-nav')
      if (sidebar) {
        const w = parseInt(sidebar.style.width)
        if (!isNaN(w)) setSidebarWidth(w)
      }
    })
    const sidebar = document.getElementById('sidebar-nav')
    if (sidebar) observer.observe(sidebar, { attributes: true, attributeFilter: ['style'] })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--color-canvas)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200" style={{ marginLeft: sidebarWidth }}>
        <TopNavbar onCommandPalette={() => setCommandPaletteOpen(true)} sidebarWidth={sidebarWidth} />
        <main className="flex-1 overflow-y-auto" style={{ paddingTop: 76, paddingLeft: 24, paddingRight: 24, paddingBottom: 32 }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {/* Each route loads a lazy micro-app module with its own chunk */}
            <Suspense fallback={<ModuleLoader />}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/patients" element={<PatientsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

/* ——— Root App ——— */
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<ModuleLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoute><AppShell /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
