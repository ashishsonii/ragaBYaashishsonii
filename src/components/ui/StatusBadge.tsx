import React from 'react'

interface StatusConfig {
  label: string
  bg: string
  color: string
}

const statusConfig: Record<string, StatusConfig> = {
  critical: { label: 'Critical', bg: 'var(--color-critical-surface)', color: 'var(--color-critical)' },
  observation: { label: 'Observation', bg: 'var(--color-warning-surface)', color: 'var(--color-warning)' },
  stable: { label: 'Stable', bg: 'var(--color-success-surface)', color: 'var(--color-success)' },
  completed: { label: 'Completed', bg: 'var(--color-success-surface)', color: 'var(--color-success)' },
  pending: { label: 'Pending', bg: 'var(--color-warning-surface)', color: 'var(--color-warning)' },
  active: { label: 'Active', bg: 'var(--color-action-surface)', color: 'var(--color-action)' },
  discharged: { label: 'Discharged', bg: 'var(--color-success-surface)', color: 'var(--color-success)' },
}

interface StatusBadgeProps {
  status: string
  showDot?: boolean
  size?: 'default' | 'small'
}

export default function StatusBadge({ status, showDot = true, size = 'default' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.stable
  const isSmall = size === 'small'

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md font-medium"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        padding: isSmall ? '2px 6px' : '3px 8px',
        fontSize: isSmall ? 10 : 11,
        lineHeight: 1.4,
        letterSpacing: '0.01em',
      }}
    >
      {showDot && (
        <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: config.color, flexShrink: 0 }} />
      )}
      {config.label}
    </span>
  )
}
