/* ============================================
   Patient Store — Zustand State Management
   Handles patient data, filtering, and views
   ============================================ */

import { create } from 'zustand'
import { patients as mockPatients } from '../data/mockData'
import type { PatientState, ViewMode } from '../types'

export const usePatientStore = create<PatientState>((set, get) => ({
  patients: mockPatients,
  filteredPatients: mockPatients,
  viewMode: 'grid' as ViewMode,
  searchQuery: '',
  statusFilter: 'all',
  isLoading: true,

  setViewMode: (mode: ViewMode) => set({ viewMode: mode }),

  setSearchQuery: (query: string) => {
    set({ searchQuery: query })
    applyFilters(set, get, query, get().statusFilter)
  },

  setStatusFilter: (filter: string) => {
    set({ statusFilter: filter })
    applyFilters(set, get, get().searchQuery, filter)
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}))

function applyFilters(
  set: any,
  get: () => PatientState,
  query: string,
  statusFilter: string
) {
  const { patients } = get()
  const filtered = patients.filter((p) => {
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.mrn.toLowerCase().includes(query.toLowerCase()) ||
      p.condition.toLowerCase().includes(query.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })
  set({ filteredPatients: filtered })
}
