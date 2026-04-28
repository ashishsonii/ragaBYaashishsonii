import React, { useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import type { ToastType, ToastItem } from '../../types'

const toastConfig: Record<ToastType, { icon: React.ComponentType<any>; bg: string; border: string; color: string }> = {
  success: { icon: CheckCircle2, bg: 'rgba(5, 150, 105, 0.12)', border: 'rgba(5, 150, 105, 0.25)', color: 'var(--color-success)' },
  warning: { icon: AlertTriangle, bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)', color: 'var(--color-warning)' },
  error: { icon: XCircle, bg: 'rgba(220, 38, 38, 0.12)', border: 'rgba(220, 38, 38, 0.25)', color: 'var(--color-critical)' },
  info: { icon: Info, bg: 'rgba(37, 99, 235, 0.12)', border: 'rgba(37, 99, 235, 0.25)', color: 'var(--color-action)' },
}

interface ToastProps extends ToastItem {
  onDismiss: (id: string) => void
}

export function Toast({ id, type = 'info', title, message, onDismiss, duration = 5000 }: ToastProps) {
  const [exiting, setExiting] = useState(false)
  const config = toastConfig[type] || toastConfig.info
  const Icon = config.icon

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onDismiss(id), 200)
    }, duration)
    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <div
      className={`rounded-lg border ${exiting ? 'toast-exit' : 'toast-enter'}`}
      style={{
        width: 320, padding: 16,
        backgroundColor: 'var(--color-card)',
        borderColor: config.border,
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        marginBottom: 8,
      }}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} style={{ color: config.color, flexShrink: 0, marginTop: 1 }} />
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
            {title}
          </p>
          {message && (
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => { setExiting(true); setTimeout(() => onDismiss(id), 200) }}
          className="flex items-center justify-center transition-clinical cursor-pointer"
          style={{ width: 20, height: 20, backgroundColor: 'transparent', border: 'none', color: 'var(--color-text-disabled)', flexShrink: 0 }}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed z-50" style={{ top: 80, right: 24 }}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
