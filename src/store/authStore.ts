/* ============================================
   Auth Store — Zustand State Management
   Handles Firebase Authentication + Demo Mode
   ============================================ */

import { create } from 'zustand'
import {
  auth,
  isFirebaseConfigured,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from '../config/firebase'
import type { AuthState, LoginCredentials, AuthUser } from '../types'

const mapFirebaseUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName || user.email?.split('@')[0] || 'Clinician',
  photoURL: user.photoURL,
  role: 'physician',
  department: 'Cardiology',
  facility: 'MedCore General Hospital',
})

const DEMO_USER: AuthUser = {
  uid: 'demo-001',
  email: 'dr.chen@medcore.health',
  displayName: 'Dr. Sarah Chen',
  photoURL: null,
  role: 'physician',
  department: 'Cardiology',
  facility: 'MedCore General Hospital',
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null })

    try {
      if (isFirebaseConfigured && auth) {
        // Firebase Authentication
        const result = await signInWithEmailAndPassword(
          auth,
          credentials.email,
          credentials.password
        )
        const user = mapFirebaseUser(result.user)
        set({ user, isAuthenticated: true, isLoading: false, error: null })
      } else {
        // Demo mode — simulate authentication
        await new Promise((resolve) => setTimeout(resolve, 1200))

        if (!credentials.email || !credentials.password) {
          throw new Error('Please enter your credentials to continue.')
        }

        // Accept any email/password combo for demo
        const demoUser: AuthUser = {
          ...DEMO_USER,
          email: credentials.email,
          displayName:
            credentials.email === 'dr.chen@medcore.health'
              ? 'Dr. Sarah Chen'
              : credentials.email.split('@')[0],
        }
        set({ user: demoUser, isAuthenticated: true, isLoading: false, error: null })
      }
    } catch (error: any) {
      const message =
        error?.code === 'auth/invalid-credential'
          ? 'Invalid email or password. Please try again.'
          : error?.code === 'auth/too-many-requests'
            ? 'Too many failed attempts. Please try again later.'
            : error?.message || 'Authentication failed. Please try again.'
      set({ error: message, isLoading: false })
    }
  },

  logout: async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth)
      }
      set({ user: null, isAuthenticated: false, isLoading: false, error: null })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))

// Initialize auth state listener
export function initAuthListener() {
  if (isFirebaseConfigured && auth) {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user = mapFirebaseUser(firebaseUser)
        useAuthStore.setState({ user, isAuthenticated: true, isLoading: false })
      } else {
        useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false })
      }
    })
  } else {
    // In demo mode, check session storage for persistence
    const saved = sessionStorage.getItem('medcore_session')
    if (saved) {
      try {
        const user = JSON.parse(saved) as AuthUser
        useAuthStore.setState({ user, isAuthenticated: true, isLoading: false })
      } catch {
        useAuthStore.setState({ isLoading: false })
      }
    } else {
      useAuthStore.setState({ isLoading: false })
    }
  }

  // Subscribe to sync demo session
  useAuthStore.subscribe((state) => {
    if (!isFirebaseConfigured) {
      if (state.isAuthenticated && state.user) {
        sessionStorage.setItem('medcore_session', JSON.stringify(state.user))
      } else {
        sessionStorage.removeItem('medcore_session')
      }
    }
  })
}
