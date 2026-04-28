import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border"
      style={{ padding: 48, backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 56, height: 56, backgroundColor: 'var(--color-surface)', marginBottom: 16 }}
      >
        <Icon size={24} style={{ color: 'var(--color-text-disabled)' }} strokeWidth={1.5} />
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8, textAlign: 'center' }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', textAlign: 'center', maxWidth: 320, lineHeight: 1.5, marginBottom: actionLabel ? 20 : 0 }}>
        {description}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center justify-center gap-2 rounded-lg font-medium transition-clinical cursor-pointer"
          style={{ height: 36, padding: '0 16px', backgroundColor: 'var(--color-action)', border: 'none', color: '#fff', fontSize: 13 }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-action-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-action)' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
