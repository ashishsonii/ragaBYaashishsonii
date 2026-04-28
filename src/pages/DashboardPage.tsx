import React, { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import {
  FileText, Pill, UserPlus, ClipboardCheck,
  AlertCircle, ChevronRight, Clock, Bed, Users, TrendingUp, TrendingDown,
  ArrowUpRight,
} from 'lucide-react'
import * as Icons from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import { SkeletonKPIRow, SkeletonChart } from '../components/ui/Skeleton'
import { kpiData, patientVolumeData, departmentData, recentActivity } from '../data/mockData'
import type { KPI } from '../types'

const activityIcons: Record<string, React.ComponentType<any>> = {
  documentation: FileText,
  medication: Pill,
  admission: UserPlus,
  order: ClipboardCheck,
  critical: AlertCircle,
  lab: FileText,
}

/* ——— Custom Tooltip ——— */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="chart-tooltip"
      style={{
        background: 'var(--color-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        padding: '10px 14px',
      }}
    >
      <p style={{ fontSize: 11, color: 'var(--color-text-disabled)', marginBottom: 6 }}>
        {label}
      </p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2" style={{ marginBottom: i < payload.length - 1 ? 3 : 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: entry.color, flexShrink: 0 }} />
          <span className="tabular-nums" style={{ fontSize: 12, color: 'var(--color-text-primary)', fontWeight: 500 }}>
            {entry.name}: {entry.value?.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ——— KPI Card ——— */
function KPIMetric({ label, value, unit, change, trend, icon }: KPI) {
  const IconComponent = (Icons as any)[icon] || Icons.Activity

  return (
    <div
      className="card animate-slide-up"
      style={{ padding: '20px 24px' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <span className="text-label">{label}</span>
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 32, height: 32,
            backgroundColor: 'var(--color-action-surface)',
          }}
        >
          <IconComponent size={16} style={{ color: 'var(--color-action)' }} strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5" style={{ marginBottom: 6 }}>
        <span className="tabular-nums text-display">{value}</span>
        {unit && (
          <span style={{ fontSize: 14, color: 'var(--color-text-disabled)', fontWeight: 400 }}>{unit}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {trend === 'up' ? (
          <TrendingUp size={13} style={{ color: 'var(--color-success)' }} />
        ) : (
          <TrendingDown size={13} style={{ color: 'var(--color-warning)' }} />
        )}
        <span
          className="tabular-nums"
          style={{
            fontSize: 12, fontWeight: 500,
            color: trend === 'up' ? 'var(--color-success)' : 'var(--color-warning)',
          }}
        >
          {change > 0 ? '+' : ''}{change}%
        </span>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>vs prior month</span>
      </div>
    </div>
  )
}

/* ——— Dashboard Page ——— */
export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      {/* KPI Row */}
      <section style={{ marginBottom: 28 }}>
        {loading ? (
          <SkeletonKPIRow />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiData.map((kpi, i) => (
              <div key={kpi.id} className={`stagger-${i + 1}`}>
                <KPIMetric {...kpi} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Charts Row */}
      <section style={{ marginBottom: 28 }}>
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Patient Volume — Area Chart */}
            <div className="card animate-slide-up stagger-5" style={{ padding: '20px 24px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <div>
                  <h3 className="text-heading" style={{ color: 'var(--color-text-primary)', marginBottom: 2 }}>
                    Patient Volume
                  </h3>
                  <p className="text-caption">12-month trend</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span style={{ width: 8, height: 2, borderRadius: 1, backgroundColor: '#7C3AED' }} />
                    <span className="text-caption">Actual</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ width: 8, height: 2, borderRadius: 1, backgroundColor: 'var(--color-text-disabled)', opacity: 0.5 }} />
                    <span className="text-caption">Target</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={patientVolumeData}>
                  <defs>
                    <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="none" stroke="var(--color-border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="month" tick={{ fill: 'var(--color-text-disabled)', fontSize: 11 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--color-text-disabled)', fontSize: 11 }}
                    axisLine={false} tickLine={false} width={36}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone" dataKey="volume" name="Actual"
                    stroke="#7C3AED" strokeWidth={2} fill="url(#volumeGrad)"
                    dot={false} activeDot={{ r: 3.5, fill: '#7C3AED', stroke: 'var(--color-card)', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone" dataKey="target" name="Target"
                    stroke="var(--color-text-disabled)" strokeWidth={1} strokeDasharray="4 4"
                    dot={false} strokeOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Department Appointments — Bar Chart */}
            <div className="card animate-slide-up stagger-6" style={{ padding: '20px 24px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                <div>
                  <h3 className="text-heading" style={{ color: 'var(--color-text-primary)', marginBottom: 2 }}>
                    Department Load
                  </h3>
                  <p className="text-caption">Current month by specialty</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#7C3AED' }} />
                    <span className="text-caption">Appointments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#F59E0B' }} />
                    <span className="text-caption">Readmissions</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={departmentData} barGap={2}>
                  <CartesianGrid strokeDasharray="none" stroke="var(--color-border-subtle)" vertical={false} />
                  <XAxis
                    dataKey="department" tick={{ fill: 'var(--color-text-disabled)', fontSize: 10 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--color-text-disabled)', fontSize: 11 }}
                    axisLine={false} tickLine={false} width={36}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="appointments" name="Appointments" fill="#7C3AED" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="readmissions" name="Readmissions" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div
            className="flex items-center justify-between"
            style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}
          >
            <h3 className="text-heading" style={{ color: 'var(--color-text-primary)' }}>
              Recent Activity
            </h3>
            <button
              className="flex items-center gap-1 btn-ghost"
              style={{ height: 30, padding: '0 10px', fontSize: 12 }}
            >
              View All <ChevronRight size={13} />
            </button>
          </div>

          <div>
            {recentActivity.map((activity, index) => {
              const Icon = activityIcons[activity.type as string] || FileText
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 transition-clinical"
                  style={{
                    padding: '12px 24px',
                    borderBottom: index < recentActivity.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-elevated)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: 32, height: 32,
                      backgroundColor: activity.type === 'critical' ? 'var(--color-critical-surface)' : 'var(--color-action-surface)',
                    }}
                  >
                    <Icon size={15} style={{ color: activity.type === 'critical' ? 'var(--color-critical)' : 'var(--color-action)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 1 }}>
                      {activity.title}
                    </p>
                    <p className="text-caption">{activity.patient}</p>
                  </div>
                  <StatusBadge status={activity.status} size="small" />
                  <span
                    className="tabular-nums text-caption"
                    style={{ flexShrink: 0, width: 72, textAlign: 'right' }}
                  >
                    {activity.timestamp}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
