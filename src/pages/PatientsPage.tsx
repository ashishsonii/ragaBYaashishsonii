import React, { useEffect } from 'react'
import {
  Search, LayoutGrid, List, UserPlus,
  AlertTriangle, Eye, ShieldAlert,
} from 'lucide-react'
import StatusBadge from '../components/ui/StatusBadge'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonPatientGrid, SkeletonTable } from '../components/ui/Skeleton'
import { usePatientStore } from '../store/patientStore'
import type { Patient } from '../types'

function Avatar({ name, status }: { name: string; status: string }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  const colors: Record<string, string> = {
    critical: 'var(--color-critical)',
    observation: 'var(--color-warning)',
    stable: 'var(--color-success)',
  }

  return (
    <div className="relative flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: 36, height: 36, backgroundColor: 'var(--color-elevated)', fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}
    >
      {initials}
      <span className="absolute" style={{ bottom: -1, right: -1, width: 10, height: 10, borderRadius: '50%', backgroundColor: colors[status] || colors.stable, border: '2px solid var(--color-card)' }} />
    </div>
  )
}

function PatientCard({ patient }: { patient: Patient }) {
  return (
    <div className="card animate-slide-up flex flex-col h-full">
      <div style={{ padding: 20, flex: 1 }}>
        {patient.codeStatus !== 'Full Code' && (
          <div className="flex items-center gap-1.5 rounded-md" style={{ padding: '4px 8px', backgroundColor: 'var(--color-critical-surface)', marginBottom: 16 }}>
            <ShieldAlert size={11} style={{ color: 'var(--color-critical)' }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-critical)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {patient.codeStatus}
            </span>
          </div>
        )}

        <div className="flex items-start justify-between gap-3" style={{ marginBottom: 16 }}>
          <div className="flex items-center gap-3">
            <Avatar name={patient.name} status={patient.status} />
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>{patient.name}</h4>
              <p className="tabular-nums text-caption">{patient.age}y / {patient.gender} · {patient.mrn}</p>
            </div>
          </div>
          <StatusBadge status={patient.status} size="small" />
        </div>

        <div style={{ backgroundColor: 'var(--color-elevated)', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: 4 }}>
            {patient.condition}
          </div>
          <div className="flex items-center justify-between text-caption mt-2 pt-2" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
            <span>Room {patient.room}</span>
            <span>{patient.physician}</span>
          </div>
        </div>

        {patient.allergies.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <AlertTriangle size={11} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
            {patient.allergies.map((a, i) => (
              <span key={i} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: 'var(--color-warning-surface)', color: 'var(--color-warning)', fontWeight: 500 }}>
                {a}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-elevated)', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <button
          className="flex items-center justify-center gap-2 w-full rounded-md btn-ghost cursor-pointer"
          style={{ height: 32, fontSize: 12, fontWeight: 500 }}
        >
          <Eye size={13} /> View Clinical Chart
        </button>
      </div>
    </div>
  )
}

function PatientTable({ patients: list }: { patients: Patient[] }) {
  const acuityMap: Record<number, { bg: string; color: string; label: string }> = {
    1: { bg: 'var(--color-critical-surface)', color: 'var(--color-critical)', label: 'I' },
    2: { bg: 'var(--color-warning-surface)', color: 'var(--color-warning)', label: 'II' },
    3: { bg: 'var(--color-success-surface)', color: 'var(--color-success)', label: 'III' },
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <table className="w-full" role="grid" style={{ borderCollapse: 'collapse', minWidth: 800 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            {['Patient', 'MRN', 'Room', 'Condition', 'Acuity', 'Status', 'Physician', ''].map((h, i) => (
              <th key={i} scope="col" className="text-label" style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((p, i) => {
            const acuity = acuityMap[p.acuity] || acuityMap[3]
            return (
              <tr
                key={p.id}
                className="transition-clinical cursor-pointer"
                style={{ borderBottom: i < list.length - 1 ? '1px solid var(--color-border-subtle)' : 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-elevated)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <td style={{ padding: '10px 16px' }}>
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} status={p.status} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                        {p.name}
                        {p.codeStatus !== 'Full Code' && (
                          <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-critical)', marginLeft: 6, padding: '1px 4px', borderRadius: 3, backgroundColor: 'var(--color-critical-surface)' }}>
                            {p.codeStatus}
                          </span>
                        )}
                      </div>
                      <div className="tabular-nums text-caption">{p.age}y/{p.gender}</div>
                    </div>
                  </div>
                </td>
                <td className="tabular-nums" style={{ padding: '10px 16px', fontSize: 12, color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{p.mrn}</td>
                <td className="tabular-nums" style={{ padding: '10px 16px', fontSize: 13, color: 'var(--color-text-primary)', fontWeight: 500 }}>{p.room}</td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--color-text-secondary)', maxWidth: 180 }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.condition}</div>
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span className="tabular-nums" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: 6, fontSize: 11, fontWeight: 600, backgroundColor: acuity.bg, color: acuity.color }}>
                    {acuity.label}
                  </span>
                </td>
                <td style={{ padding: '10px 16px' }}><StatusBadge status={p.status} size="small" /></td>
                <td style={{ padding: '10px 16px', fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.physician}</td>
                <td style={{ padding: '10px 16px' }}>
                  <button className="flex items-center gap-1 rounded-md btn-ghost cursor-pointer" style={{ height: 26, padding: '0 8px', fontSize: 11 }}>
                    <Eye size={11} /> Chart
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function PatientsPage() {
  const {
    filteredPatients, patients, viewMode, searchQuery, statusFilter, isLoading,
    setViewMode, setSearchQuery, setStatusFilter, setLoading,
  } = usePatientStore()

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [setLoading])

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3" style={{ marginBottom: 20 }}>
        {/* Search */}
        <div className="flex items-center gap-2 rounded-lg" style={{ width: '100%', maxWidth: 300, height: 36, padding: '0 12px', backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <Search size={14} style={{ color: 'var(--color-text-disabled)' }} />
          <input
            id="patient-search"
            type="text" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients..."
            className="flex-1"
            style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'var(--color-text-primary)', fontSize: 13 }}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg cursor-pointer"
            style={{
              height: 34, padding: '0 28px 0 10px',
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: 12, appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%2371717A' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
            }}
          >
            <option value="all">All Statuses</option>
            <option value="critical">Critical</option>
            <option value="observation">Observation</option>
            <option value="stable">Stable</option>
          </select>

          {/* View Toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            {[
              { mode: 'grid' as const, icon: LayoutGrid, id: 'view-grid' },
              { mode: 'list' as const, icon: List, id: 'view-list' },
            ].map(({ mode, icon: Icon, id }) => (
              <button
                key={mode}
                id={id}
                onClick={() => setViewMode(mode)}
                className="flex items-center justify-center transition-clinical cursor-pointer"
                style={{
                  width: 34, height: 34,
                  backgroundColor: viewMode === mode ? 'var(--color-action-surface)' : 'transparent',
                  border: 'none',
                  color: viewMode === mode ? 'var(--color-action)' : 'var(--color-text-disabled)',
                }}
                aria-label={`${mode} view`}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>

          <button
            id="add-patient"
            className="flex items-center gap-2 rounded-lg font-medium cursor-pointer transition-clinical"
            style={{ height: 34, padding: '0 14px', backgroundColor: '#7C3AED', border: 'none', color: '#fff', fontSize: 12 }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#6D28D9' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#7C3AED' }}
          >
            <UserPlus size={13} /> New Admission
          </button>
        </div>
      </div>

      {/* Count */}
      <div style={{ marginBottom: 12 }}>
        <span className="tabular-nums text-caption">{filteredPatients.length} of {patients.length} patients</span>
      </div>

      {/* Content */}
      {isLoading ? (
        viewMode === 'grid' ? <SkeletonPatientGrid /> : <SkeletonTable rows={6} cols={7} />
      ) : filteredPatients.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No patients found"
          description="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={() => { setSearchQuery(''); setStatusFilter('all') }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((p, i) => (
            <div key={p.id} className={`stagger-${(i % 6) + 1}`}>
              <PatientCard patient={p} />
            </div>
          ))}
        </div>
      ) : (
        <PatientTable patients={filteredPatients} />
      )}
    </div>
  )
}
