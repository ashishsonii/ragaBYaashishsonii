import React, { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Calendar, ChevronDown, Filter, Download } from 'lucide-react'
import { SkeletonChart } from '../components/ui/Skeleton'
import { analyticsData } from '../data/mockData'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ fontSize: 11, color: 'var(--color-text-disabled)', marginBottom: 6 }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2" style={{ marginBottom: i < payload.length - 1 ? 3 : 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: entry.color, flexShrink: 0 }} />
          <span className="tabular-nums" style={{ fontSize: 12, color: 'var(--color-text-primary)', fontWeight: 500 }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            {entry.name.includes('Rate') || entry.name.includes('rate') ? '%' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <div style={{ marginBottom: 16 }}>
        <h3 className="text-heading" style={{ color: 'var(--color-text-primary)', marginBottom: 2 }}>{title}</h3>
        <p className="text-caption">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const gridColor = 'var(--color-border-subtle)'
  const tickStyle = { fill: 'var(--color-text-disabled)', fontSize: 11 }

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex items-center justify-between card" style={{ padding: '10px 16px', marginBottom: 20 }}>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg btn-ghost cursor-pointer" style={{ height: 32, padding: '0 10px', fontSize: 12 }}>
            <Calendar size={13} /> 12 Months <ChevronDown size={12} />
          </button>
          <button className="flex items-center gap-2 rounded-lg btn-ghost cursor-pointer" style={{ height: 32, padding: '0 10px', fontSize: 12 }}>
            <Filter size={13} /> All Facilities <ChevronDown size={12} />
          </button>
        </div>
        <button className="flex items-center gap-2 rounded-lg btn-ghost cursor-pointer" style={{ height: 32, padding: '0 10px', fontSize: 12 }}>
          <Download size={13} /> Export
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"><SkeletonChart /><SkeletonChart /></div>
        </div>
      ) : (
        <>
          {/* Readmission Trend — Full Width */}
          <div style={{ marginBottom: 20 }}>
            <span className="text-label" style={{ display: 'block', marginBottom: 10 }}>Trends</span>
            <ChartCard title="30-Day Readmission Rate" subtitle="Facility vs. National Average (CMS Benchmark)">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={analyticsData.readmissionTrend}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.1} />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="none" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={36} domain={[8, 16]} tickFormatter={(v: number) => `${v}%`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="rate" name="Facility Rate" stroke="#7C3AED" strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{ r: 3.5, fill: '#7C3AED', stroke: 'var(--color-card)', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="national" name="National Avg" stroke="var(--color-text-disabled)" strokeWidth={1} strokeDasharray="4 4" dot={false} strokeOpacity={0.5} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Performance — 2 Column */}
          <div style={{ marginBottom: 20 }}>
            <span className="text-label" style={{ display: 'block', marginBottom: 10 }}>Performance</span>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartCard title="In-Hospital Mortality" subtitle="By department — current quarter">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={analyticsData.mortalityByDept} layout="vertical">
                    <CartesianGrid strokeDasharray="none" stroke={gridColor} horizontal={false} />
                    <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${v}%`} />
                    <YAxis dataKey="department" type="category" tick={tickStyle} axisLine={false} tickLine={false} width={76} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rate" name="Mortality Rate" fill="#EF4444" radius={[0, 4, 4, 0]} maxBarSize={20} fillOpacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="HCAHPS Satisfaction" subtitle="Quarterly composite score vs. target">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={analyticsData.patientSatisfaction}>
                    <CartesianGrid strokeDasharray="none" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
                    <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={36} domain={[60, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" name="Score" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} fillOpacity={0.8} />
                    <Line dataKey="target" name="Target" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </div>

          {/* Demographics */}
          <div>
            <span className="text-label" style={{ display: 'block', marginBottom: 10 }}>Demographics</span>
            <ChartCard title="Patient Age Distribution" subtitle="Active inpatient census by age range">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analyticsData.ageDistribution}>
                  <CartesianGrid strokeDasharray="none" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="range" tick={tickStyle} axisLine={false} tickLine={false} />
                  <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={36} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Patients" fill="#7C3AED" radius={[4, 4, 0, 0]} maxBarSize={48} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </>
      )}
    </div>
  )
}
