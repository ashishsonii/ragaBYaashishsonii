import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, BarChart3, Users, Bell,
  Activity, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { useNotificationStore } from '../../store/notificationStore'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/notifications', label: 'Notifications', icon: Bell },
]

export default function Sidebar() {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const unreadCount = useNotificationStore((s) => s.unreadCount)

  return (
    <aside
      id="sidebar-nav"
      className="fixed left-0 top-0 h-screen flex flex-col border-r z-40"
      style={{
        width: collapsed ? 64 : 240,
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        transition: 'width 200ms ease',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 border-b flex-shrink-0"
        style={{
          height: 56,
          padding: collapsed ? '0 16px' : '0 20px',
          borderColor: 'var(--color-border)',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 28, height: 28, backgroundColor: '#7C3AED' }}
        >
          <Activity size={15} color="#fff" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
              MedCore
            </span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: collapsed ? '8px 8px' : '8px 12px' }}>
        {!collapsed && (
          <div style={{ padding: '8px 8px 4px', marginBottom: 4 }}>
            <span className="text-label" style={{ fontSize: 10 }}>Navigation</span>
          </div>
        )}

        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              id={`nav-${item.label.toLowerCase()}`}
              className="flex items-center gap-3 rounded-lg transition-clinical focus-ring"
              style={{
                padding: collapsed ? '10px 0' : '8px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                marginBottom: 2,
                backgroundColor: isActive ? 'var(--color-action-surface)' : 'transparent',
                color: isActive ? 'var(--color-action)' : 'var(--color-text-secondary)',
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: isActive ? 500 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-elevated)'
                  e.currentTarget.style.color = 'var(--color-text-primary)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = 'var(--color-text-secondary)'
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              {!collapsed && <span>{item.label}</span>}
              {item.label === 'Notifications' && !collapsed && unreadCount > 0 && (
                <span
                  className="ml-auto tabular-nums"
                  style={{
                    fontSize: 10, fontWeight: 600,
                    backgroundColor: 'var(--color-critical)',
                    color: '#fff',
                    padding: '1px 6px',
                    borderRadius: 10,
                    minWidth: 18,
                    textAlign: 'center',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t" style={{ padding: '8px', borderColor: 'var(--color-border)' }}>
        <button
          id="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full rounded-lg transition-clinical focus-ring cursor-pointer"
          style={{
            height: 32,
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-text-disabled)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-elevated)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-disabled)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </aside>
  )
}
