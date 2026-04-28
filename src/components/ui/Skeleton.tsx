import React from 'react'

interface SkeletonBlockProps {
  width: number | string
  height: number | string
  borderRadius?: number
  style?: React.CSSProperties
}

export function SkeletonBlock({ width, height, borderRadius = 6, style = {} }: SkeletonBlockProps) {
  return <div className="skeleton" style={{ width, height, borderRadius, ...style }} />
}

export function SkeletonKPIRow() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border" style={{ padding: 20, backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', minHeight: 100 }}>
          <SkeletonBlock width={100} height={12} style={{ marginBottom: 12 }} />
          <SkeletonBlock width={80} height={32} style={{ marginBottom: 10 }} />
          <SkeletonBlock width={120} height={12} />
        </div>
      ))}
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="rounded-xl border" style={{ padding: 20, backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
      <SkeletonBlock width={160} height={16} style={{ marginBottom: 20 }} />
      <SkeletonBlock width="100%" height={240} borderRadius={8} />
    </div>
  )
}

interface SkeletonTableProps {
  rows?: number
  cols?: number
}

export function SkeletonTable({ rows = 5, cols = 6 }: SkeletonTableProps) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center gap-6" style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-border)' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock key={i} width={i === 0 ? 40 : `${100 / (cols - 1)}%`} height={12} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex items-center gap-6" style={{ padding: '14px 20px', borderBottom: row < rows - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
          {Array.from({ length: cols }).map((_, col) => (
            <SkeletonBlock key={col} width={col === 0 ? 40 : `${100 / (cols - 1)}%`} height={14} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function SkeletonPatientGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border" style={{ padding: 20, backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
            <SkeletonBlock width={40} height={40} borderRadius={20} />
            <div className="flex-1">
              <SkeletonBlock width="70%" height={14} style={{ marginBottom: 6 }} />
              <SkeletonBlock width="50%" height={10} />
            </div>
          </div>
          <SkeletonBlock width="100%" height={12} style={{ marginBottom: 8 }} />
          <SkeletonBlock width="80%" height={12} style={{ marginBottom: 16 }} />
          <SkeletonBlock width={80} height={28} />
        </div>
      ))}
    </div>
  )
}
