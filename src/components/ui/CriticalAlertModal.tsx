import React from 'react'
import { AlertTriangle, ShieldAlert } from 'lucide-react'
import type { Notification } from '../../types'

interface CriticalAlertModalProps {
  isOpen: boolean
  alert: Notification | null
  onAcknowledge: () => void
  onOverride: () => void
  onClose: () => void
}

export default function CriticalAlertModal({ isOpen, alert, onAcknowledge, onOverride, onClose }: CriticalAlertModalProps) {
  if (!isOpen || !alert) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cmd-overlay"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="rounded-xl border overflow-hidden cmd-dialog w-full mx-4"
        style={{
          maxWidth: 520,
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-critical)',
          boxShadow: '0 0 48px rgba(220, 38, 38, 0.15), 0 16px 48px rgba(0,0,0,0.4)',
        }}
      >
        {/* Critical Header Bar */}
        <div
          className="flex items-center gap-3"
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--color-critical-surface)',
            borderBottom: '1px solid rgba(220, 38, 38, 0.25)',
          }}
        >
          <ShieldAlert size={20} style={{ color: 'var(--color-critical)', flexShrink: 0 }} />
          <span
            className="flex-1"
            style={{
              fontSize: 14, fontWeight: 600,
              color: 'var(--color-critical)',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}
          >
            Critical Action Value — Immediate Review Required
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 12 }}>
            {alert.title}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            {alert.message}
          </p>

          {/* Patient Context */}
          <div
            className="rounded-lg"
            style={{
              padding: 16, backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)', marginBottom: 24,
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patient</span>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginTop: 2 }}>{alert.patient}</div>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timestamp</span>
                <div className="tabular-nums" style={{ fontSize: 14, color: 'var(--color-text-primary)', marginTop: 2 }}>{alert.timestamp}</div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div
            className="flex items-start gap-3 rounded-lg"
            style={{ padding: 12, backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', marginBottom: 24 }}
          >
            <AlertTriangle size={16} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: 12, color: 'var(--color-warning)', lineHeight: 1.5 }}>
              This alert requires closed-loop acknowledgment. Your response will be logged for HIPAA compliance and audit trail purposes.
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="alert-acknowledge"
              onClick={onAcknowledge}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg font-medium transition-clinical cursor-pointer"
              style={{ height: 42, backgroundColor: 'var(--color-action)', border: 'none', color: '#fff', fontSize: 14 }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-action-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-action)' }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              Acknowledge & Modify Order
            </button>
            <button
              id="alert-override"
              onClick={onOverride}
              className="flex items-center justify-center gap-2 rounded-lg font-medium transition-clinical cursor-pointer"
              style={{ height: 42, padding: '0 20px', backgroundColor: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontSize: 14 }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-card)'; e.currentTarget.style.borderColor = 'var(--color-text-disabled)' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--color-border)' }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              Override with Rationale
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
