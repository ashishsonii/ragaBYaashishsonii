/* ============================================
   MedCore EHR — TypeScript Type Definitions
   ============================================ */

// ——— Authentication ———
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: 'physician' | 'nurse' | 'admin' | 'technician'
  department: string
  facility: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

// ——— Patients ———
export type PatientStatus = 'critical' | 'observation' | 'stable'
export type CodeStatus = 'Full Code' | 'DNR' | 'DNR/DNI' | 'DNI'
export type AcuityLevel = 1 | 2 | 3

export interface Patient {
  id: string
  mrn: string
  name: string
  age: number
  gender: 'M' | 'F'
  dob: string
  room: string
  condition: string
  chiefComplaint: string
  status: PatientStatus
  acuity: AcuityLevel
  lastVisit: string
  physician: string
  allergies: string[]
  codeStatus: CodeStatus
  avatar: string | null
}

export type ViewMode = 'grid' | 'list'

export interface PatientState {
  patients: Patient[]
  filteredPatients: Patient[]
  viewMode: ViewMode
  searchQuery: string
  statusFilter: string
  isLoading: boolean
  setViewMode: (mode: ViewMode) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (filter: string) => void
  setLoading: (loading: boolean) => void
}

// ——— KPI & Dashboard ———
export interface KPI {
  id: string
  label: string
  value: string
  unit: string
  change: number
  trend: 'up' | 'down'
  icon: string
}

export interface ActivityItem {
  id: string
  title: string
  patient: string
  timestamp: string
  type: 'documentation' | 'critical' | 'order' | 'medication' | 'admission' | 'lab'
  status: 'completed' | 'pending' | 'active'
}

// ——— Charts ———
export interface PatientVolumePoint {
  month: string
  volume: number
  target: number
}

export interface DepartmentPoint {
  department: string
  appointments: number
  readmissions: number
}

// ——— Analytics ———
export interface ReadmissionPoint {
  month: string
  rate: number
  national: number
}

export interface MortalityPoint {
  department: string
  rate: number
}

export interface SatisfactionPoint {
  month: string
  score: number
  target: number
}

export interface AgeDistributionPoint {
  range: string
  count: number
}

export interface AnalyticsData {
  readmissionTrend: ReadmissionPoint[]
  mortalityByDept: MortalityPoint[]
  patientSatisfaction: SatisfactionPoint[]
  ageDistribution: AgeDistributionPoint[]
}

// ——— Notifications ———
export type NotificationType = 'critical' | 'warning' | 'success' | 'info'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  timestamp: string
  read: boolean
  patient: string
  requiresAck: boolean
}

export interface NotificationState {
  notifications: Notification[]
  filter: string
  criticalAlert: Notification | null
  unreadCount: number
  markRead: (id: string) => void
  markAllRead: () => void
  openCriticalAlert: (notif: Notification) => void
  closeCriticalAlert: () => void
  setFilter: (filter: string) => void
  addNotification: (notif: Notification) => void
}

// ——— Toast ———
export type ToastType = 'success' | 'warning' | 'error' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

export interface ToastState {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  dismissToast: (id: string) => void
}

// ——— Command Palette ———
export interface CommandAction {
  id: string
  label: string
  category: string
  icon: string
}

// ——— Facility ———
export interface Facility {
  id: string
  name: string
  code: string
  active: boolean
}

// ——— Audit Log ———
export interface AuditEntry {
  id: string
  user: string
  action: string
  patient: string
  timestamp: string
  sessionDuration: string
}
