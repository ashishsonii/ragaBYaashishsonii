/* ============================================
   Notification Store — Zustand State Management
   Handles notifications, toasts, and alerts
   ============================================ */

import { create } from 'zustand'
import { notifications as mockNotifications } from '../data/mockData'
import type { NotificationState, Notification, ToastState, ToastItem } from '../types'

// ——— Notification Store ———
export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  filter: 'all',
  criticalAlert: null,
  unreadCount: mockNotifications.filter((n) => !n.read).length,

  markRead: (id: string) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      }
    })
  },

  markAllRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  openCriticalAlert: (notif: Notification) => {
    set({ criticalAlert: notif })
  },

  closeCriticalAlert: () => {
    set({ criticalAlert: null })
  },

  setFilter: (filter: string) => set({ filter }),

  addNotification: (notif: Notification) => {
    set((state) => ({
      notifications: [notif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },
}))

// ——— Toast Store ———
export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
  },

  dismissToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))
