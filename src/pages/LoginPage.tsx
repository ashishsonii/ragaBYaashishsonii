import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Loader2, Eye, EyeOff, ShieldCheck, Lock, ArrowRight } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { isFirebaseConfigured } from '../config/firebase'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  React.useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    clearError()
    await login({ email, password })
  }

  return (
    <div className="flex w-screen h-screen" style={{ backgroundColor: 'var(--color-canvas)' }}>
      {/* Left — Brand */}
      <div
        className="hidden lg:flex flex-col justify-between"
        style={{
          width: '45%',
          padding: '48px 56px',
          backgroundColor: '#09090B',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 60%, rgba(124, 58, 237, 0.06) 0%, transparent 60%)',
        }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex items-center justify-center rounded-lg" style={{ width: 32, height: 32, backgroundColor: '#7C3AED' }}>
            <Activity size={17} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, color: '#FAFAFA', letterSpacing: '-0.01em' }}>MedCore</span>
        </div>

        {/* Value Prop */}
        <div className="relative z-10" style={{ maxWidth: 400 }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: '#FAFAFA', lineHeight: 1.2, letterSpacing: '-0.025em', marginBottom: 16 }}>
            Enterprise Healthcare
            <br />
            Platform
          </h1>
          <p style={{ fontSize: 15, color: '#A1A1AA', lineHeight: 1.7, marginBottom: 40 }}>
            Clinical-grade patient management, real-time analytics, and intelligent alerting — built for modern health systems.
          </p>

          <div className="flex flex-col gap-3">
            {[
              { icon: ShieldCheck, text: 'HIPAA & SOC 2 Type II Compliant' },
              { icon: Lock, text: 'End-to-end encryption' },
              { icon: Activity, text: '99.99% uptime SLA' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={14} style={{ color: '#71717A', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#71717A' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p style={{ fontSize: 11, color: '#52525B', lineHeight: 1.5 }}>
            © 2026 MedCore Health Systems
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center" style={{ padding: 32 }}>
        <div style={{ width: '100%', maxWidth: 360 }}>
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 lg:hidden" style={{ marginBottom: 32 }}>
            <div className="flex items-center justify-center rounded-lg" style={{ width: 28, height: 28, backgroundColor: '#7C3AED' }}>
              <Activity size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-primary)' }}>MedCore</span>
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Sign in
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
            Enter your credentials to continue
          </p>

          {/* Mode Badge */}
          <div
            className="flex items-center gap-2 rounded-lg"
            style={{ padding: '5px 10px', marginBottom: 24, backgroundColor: 'var(--color-action-surface)', display: 'inline-flex' }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: 'var(--color-action)' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-action)' }}>
              {isFirebaseConfigured ? 'Firebase Auth' : 'Demo — any credentials work'}
            </span>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="login-email" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dr.chen@medcore.health"
                className="w-full rounded-lg transition-clinical"
                style={{
                  height: 40, padding: '0 12px',
                  backgroundColor: 'var(--color-canvas)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: 14, outline: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-action)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="login-password" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg transition-clinical"
                  style={{
                    height: 40, padding: '0 40px 0 12px',
                    backgroundColor: 'var(--color-canvas)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-primary)',
                    fontSize: 14, outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-action)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-0 right-0 flex items-center justify-center cursor-pointer"
                  style={{ width: 40, height: 40, backgroundColor: 'transparent', border: 'none', color: 'var(--color-text-disabled)' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p id="login-error" role="alert" style={{ fontSize: 12, color: 'var(--color-critical)', marginBottom: 16, lineHeight: 1.4 }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg font-medium cursor-pointer transition-clinical"
              style={{
                height: 40,
                backgroundColor: '#7C3AED',
                border: 'none',
                color: '#fff',
                fontSize: 14,
                opacity: isLoading ? 0.8 : 1,
              }}
              onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#6D28D9' }}
              onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.backgroundColor = '#7C3AED' }}
              onMouseDown={(e) => { if (!isLoading) e.currentTarget.style.transform = 'scale(0.99)' }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center" style={{ marginTop: 24, fontSize: 11, color: 'var(--color-text-disabled)' }}>
            Protected by 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  )
}
