import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import * as Icons from 'lucide-react'
import type { KPI } from '../../types'

export default function KPICard({ label, value, unit, change, trend, icon }: KPI) {
  const IconComponent = (Icons as any)[icon] || Icons.Activity
  const trendLabel = label.includes('Occupancy') || label.includes('Admissions')
  const isGood = trendLabel ? trend === 'up' : trend === 'down'

  return (
    <div
      id={`kpi-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className="rounded-xl border transition-clinical"
      style={{
        backgroundColor: 'var(--color-card)',
        borderColor: 'var(--color-border)',
        padding: 20,
        minHeight: 100,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-disabled)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            style={{
              fontSize: 12, fontWeight: 500,
              color: 'var(--color-text-secondary)',
              marginBottom: 8, textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span
              className="tabular-nums"
              style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}
            >
              {value}
            </span>
            {unit && (
              <span style={{ fontSize: 14, color: 'var(--color-text-disabled)', fontWeight: 400 }}>
                {unit}
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-1 mt-2"
            style={{
              fontSize: 12, fontWeight: 500,
              color: isGood ? 'var(--color-success)' : 'var(--color-warning)',
            }}
          >
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span className="tabular-nums">{change > 0 ? '+' : ''}{change}%</span>
            <span style={{ color: 'var(--color-text-disabled)', fontWeight: 400 }}>
              vs last month
            </span>
          </div>
        </div>
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: 40, height: 40, backgroundColor: 'var(--color-action-surface)' }}
        >
          <IconComponent size={20} style={{ color: 'var(--color-action)' }} strokeWidth={1.8} />
        </div>
      </div>
    </div>
  )
}
