import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import * as Icons from 'lucide-react'
import { commandPaletteActions } from '../../data/mockData'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const filtered = commandPaletteActions.filter((action) =>
    action.label.toLowerCase().includes(query.toLowerCase())
  )

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, action) => {
    if (!acc[action.category]) acc[action.category] = []
    acc[action.category].push(action)
    return acc
  }, {})

  const handleSelect = useCallback(
    (action: (typeof commandPaletteActions)[0]) => {
      if (action.label.startsWith('Go to')) {
        const path = action.label.replace('Go to ', '').toLowerCase()
        navigate(`/${path === 'dashboard' ? '' : path}`)
      }
      onClose()
    },
    [navigate, onClose]
  )

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center cmd-overlay"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)', paddingTop: 120 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="rounded-xl border overflow-hidden cmd-dialog w-full mx-4"
        style={{
          maxWidth: 560, maxHeight: 440,
          backgroundColor: 'var(--color-card)',
          borderColor: 'var(--color-border)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="flex items-center gap-3 border-b"
          style={{ padding: '0 20px', height: 56, borderColor: 'var(--color-border)' }}
        >
          <Search size={18} style={{ color: 'var(--color-text-disabled)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1"
            style={{
              backgroundColor: 'transparent', border: 'none', outline: 'none',
              color: 'var(--color-text-primary)', fontSize: 15, lineHeight: '56px',
            }}
          />
          <kbd
            style={{
              fontSize: 11, color: 'var(--color-text-disabled)', padding: '3px 8px',
              borderRadius: 4, border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            ESC
          </kbd>
        </div>
        <div style={{ maxHeight: 380, overflowY: 'auto', padding: '8px' }}>
          {Object.entries(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center" style={{ padding: 40, color: 'var(--color-text-disabled)' }}>
              <Search size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
              <span style={{ fontSize: 13 }}>No commands found</span>
            </div>
          ) : (
            Object.entries(grouped).map(([category, actions]) => (
              <div key={category} style={{ marginBottom: 8 }}>
                <div style={{ padding: '8px 12px 4px', fontSize: 11, fontWeight: 600, color: 'var(--color-text-disabled)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {category}
                </div>
                {actions.map((action) => {
                  const IconComp = (Icons as any)[action.icon] || Icons.Circle
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleSelect(action)}
                      className="flex items-center gap-3 w-full rounded-lg transition-clinical cursor-pointer"
                      style={{ padding: '10px 12px', backgroundColor: 'transparent', border: 'none', color: 'var(--color-text-primary)', fontSize: 14, textAlign: 'left' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-action-surface)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <IconComp size={16} style={{ color: 'var(--color-text-secondary)' }} strokeWidth={1.8} />
                      <span className="flex-1">{action.label}</span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
