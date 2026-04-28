/* ============================================
   Theme Store — Zustand Dark/Light Mode
   ============================================ */

import { create } from 'zustand'

export type ThemeMode = 'dark' | 'light'

interface ThemeState {
  mode: ThemeMode
  toggleTheme: () => void
  setTheme: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: (localStorage.getItem('medcore-theme') as ThemeMode) || 'dark',

  toggleTheme: () =>
    set((state) => {
      const next = state.mode === 'dark' ? 'light' : 'dark'
      localStorage.setItem('medcore-theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return { mode: next }
    }),

  setTheme: (mode: ThemeMode) => {
    localStorage.setItem('medcore-theme', mode)
    document.documentElement.setAttribute('data-theme', mode)
    set({ mode })
  },
}))

// Initialize theme on load
export function initTheme() {
  const saved = (localStorage.getItem('medcore-theme') as ThemeMode) || 'dark'
  document.documentElement.setAttribute('data-theme', saved)
  useThemeStore.setState({ mode: saved })
}
