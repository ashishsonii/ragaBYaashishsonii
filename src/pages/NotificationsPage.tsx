import React from 'react'
import {
  Bell, AlertTriangle, CheckCircle2, Info,
  ShieldAlert, Check,
} from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import CriticalAlertModal from '../components/ui/CriticalAlertModal'
import { useNotificationStore } from '../store/notificationStore'
import { showLocalNotification } from '../utils/serviceWorker'
import type { NotificationType } from '../types'

const typeIcons: Record<NotificationType, React.ComponentType<any>> = {
  critical: ShieldAlert,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
}

const typeStyles: Record<NotificationType, { color: string; bg: string }> = {
  critical: { color: 'var(--color-critical)', bg: 'var(--color-critical-surface)' },
  warning: { color: 'var(--color-warning)', bg: 'var(--color-warning-surface)' },
  success: { color: 'var(--color-success)', bg: 'var(--color-success-surface)' },
  info: { color: 'var(--color-action)', bg: 'var(--color-action-surface)' },
}

export default function NotificationsPage() {
  const {
    notifications, filter, criticalAlert, unreadCount,
    markRead, markAllRead, openCriticalAlert, closeCriticalAlert, setFilter,
  } = useNotificationStore()

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ marginBottom: 20 }}>
        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: `Unread (${unreadCount})` },
            { key: 'critical', label: 'Critical' },
            { key: 'warning', label: 'Warnings' },
          ].map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className="transition-clinical cursor-pointer tabular-nums"
              style={{
                height: 32, padding: '0 12px',
                backgroundColor: filter === tab.key ? 'var(--color-action-surface)' : 'transparent',
                border: 'none',
                color: filter === tab.key ? 'var(--color-action)' : 'var(--color-text-secondary)',
                fontSize: 12, fontWeight: filter === tab.key ? 500 : 400,
                borderRight: i < 3 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            id="test-notification"
            onClick={() => showLocalNotification('MedCore EHR — Test', 'This is a test push notification from the Service Worker.', 'medcore-test')}
            className="flex items-center gap-2 rounded-lg btn-ghost cursor-pointer"
            style={{ height: 32, padding: '0 12px', fontSize: 12 }}
          >
            <Bell size={13} /> Test Push
          </button>
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-lg btn-ghost cursor-pointer"
            style={{ height: 32, padding: '0 12px', fontSize: 12 }}
          >
            <Check size={13} /> Mark all read
          </button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up." />
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          {filtered.map((notif, index) => {
            const Icon = typeIcons[notif.type] || Info
            const style = typeStyles[notif.type] || typeStyles.info

            return (
              <div
                key={notif.id}
                id={`notification-${notif.id}`}
                className="flex items-start gap-3 transition-clinical"
                style={{
                  padding: '14px 20px',
                  borderBottom: index < filtered.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  backgroundColor: notif.read ? 'transparent' : 'var(--color-action-surface)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-elevated)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : 'var(--color-action-surface)' }}
                onClick={() => { if (!notif.read) markRead(notif.id) }}
              >
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 32, height: 32, backgroundColor: style.bg, marginTop: 1 }}
                >
                  <Icon size={15} style={{ color: style.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2" style={{ marginBottom: 3 }}>
                    {!notif.read && (
                      <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--color-action)', flexShrink: 0 }} />
                    )}
                    <h4 style={{ fontSize: 13, fontWeight: notif.read ? 400 : 500, color: 'var(--color-text-primary)' }}>
                      {notif.title}
                    </h4>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 6 }}>
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums text-caption">{notif.timestamp}</span>
                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>·</span>
                    <span className="text-caption">{notif.patient}</span>
                  </div>

                  {notif.requiresAck && (notif.type === 'critical' || notif.type === 'warning') && (
                    <button
                      onClick={(e) => { e.stopPropagation(); openCriticalAlert(notif) }}
                      className="flex items-center gap-1.5 rounded-md font-medium transition-clinical cursor-pointer mt-2"
                      style={{
                        height: 28, padding: '0 10px',
                        backgroundColor: notif.type === 'critical' ? 'var(--color-critical-surface)' : 'var(--color-warning-surface)',
                        border: 'none',
                        color: notif.type === 'critical' ? 'var(--color-critical)' : 'var(--color-warning)',
                        fontSize: 11,
                      }}
                    >
                      {notif.type === 'critical' ? <ShieldAlert size={11} /> : <AlertTriangle size={11} />}
                      {notif.type === 'critical' ? 'Acknowledge — Immediate Review' : 'Review Required'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CriticalAlertModal
        isOpen={!!criticalAlert}
        alert={criticalAlert}
        onAcknowledge={() => { if (criticalAlert) markRead(criticalAlert.id); closeCriticalAlert() }}
        onOverride={() => { if (criticalAlert) markRead(criticalAlert.id); closeCriticalAlert() }}
        onClose={closeCriticalAlert}
      />
    </div>
  )
}
