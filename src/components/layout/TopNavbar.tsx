import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Search, Bell, ChevronDown, Building2,
  LogOut, Settings, User, Command, Sun, Moon,
} from 'lucide-react'
import { facilities } from '../../data/mockData'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useThemeStore } from '../../store/themeStore'
import type { Facility } from '../../types'

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/patients': 'Patients',
  '/notifications': 'Notifications',
}

interface TopNavbarProps {
  onCommandPalette: () => void
  sidebarWidth?: number
}

export default function TopNavbar({ onCommandPalette, sidebarWidth = 240 }: TopNavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  const { user, logout } = useAuthStore()
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const { mode, toggleTheme } = useThemeStore()

  const pageTitle = pageTitles[location.pathname] || 'MedCore'
  const displayName = user?.displayName || 'Clinician'
  const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const IconBtn = ({ children, onClick, id, label, badge }: any) => (
    <button
      id={id}
      onClick={onClick}
      className="relative flex items-center justify-center rounded-lg transition-clinical focus-ring cursor-pointer"
      style={{ width: 32, height: 32, backgroundColor: 'transparent', border: 'none', color: 'var(--color-text-disabled)' }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-elevated)'; e.currentTarget.style.color = 'var(--color-text-secondary)' }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-disabled)' }}
      aria-label={label}
    >
      {children}
      {badge && (
        <span className="absolute" style={{ top: 5, right: 5, width: 7, height: 7, borderRadius: '50%', backgroundColor: 'var(--color-critical)', border: '2px solid var(--color-surface)' }} />
      )}
    </button>
  )

  return (
    <header
      id="top-navbar"
      className="fixed top-0 right-0 flex items-center justify-between border-b z-30"
      style={{
        left: sidebarWidth,
        height: 56,
        padding: '0 24px',
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Left */}
      <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
        {pageTitle}
      </h2>

      {/* Center — Search */}
      <div
        className="hidden md:flex items-center gap-2 rounded-lg cursor-pointer transition-clinical"
        onClick={onCommandPalette}
        style={{
          width: 360, height: 34, padding: '0 12px',
          backgroundColor: 'var(--color-canvas)',
          border: '1px solid var(--color-border)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-text-disabled)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
      >
        <Search size={14} style={{ color: 'var(--color-text-disabled)' }} />
        <span className="flex-1" style={{ fontSize: 12, color: 'var(--color-text-disabled)' }}>
          Search patients, orders...
        </span>
        <div className="flex items-center gap-0.5 rounded" style={{ padding: '1px 5px', backgroundColor: 'var(--color-elevated)', border: '1px solid var(--color-border)' }}>
          <Command size={10} style={{ color: 'var(--color-text-disabled)' }} />
          <span style={{ fontSize: 10, color: 'var(--color-text-disabled)' }}>K</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <IconBtn id="theme-toggle" onClick={toggleTheme} label={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </IconBtn>

        <IconBtn id="notification-bell" onClick={() => navigate('/notifications')} label="Notifications" badge={unreadCount > 0}>
          <Bell size={15} />
        </IconBtn>

        {/* Profile */}
        <div ref={profileRef} className="relative" style={{ marginLeft: 4 }}>
          <button
            id="user-avatar"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg transition-clinical focus-ring cursor-pointer"
            style={{ height: 32, padding: '0 4px', backgroundColor: 'transparent', border: 'none', color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-elevated)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 28, height: 28, backgroundColor: '#7C3AED', fontSize: 11, fontWeight: 600, color: '#fff' }}
            >
              {initials}
            </div>
            <ChevronDown size={13} style={{ color: 'var(--color-text-disabled)' }} />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 rounded-lg border overflow-hidden"
              style={{
                top: 40, width: 200,
                backgroundColor: 'var(--color-card)',
                borderColor: 'var(--color-border)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              }}
            >
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{displayName}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-disabled)', marginTop: 1 }}>
                  {user?.department || 'Cardiology'}
                </div>
              </div>
              {[
                { icon: User, label: 'Profile', action: () => setProfileOpen(false) },
                { icon: Settings, label: 'Settings', action: () => setProfileOpen(false) },
                { icon: LogOut, label: 'Sign Out', action: handleLogout, danger: true },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center gap-2.5 w-full text-left transition-clinical cursor-pointer"
                  style={{
                    padding: '8px 14px',
                    backgroundColor: 'transparent', border: 'none',
                    color: (item as any).danger ? 'var(--color-critical)' : 'var(--color-text-secondary)',
                    fontSize: 13,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-elevated)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
