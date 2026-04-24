import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

type Mode = 'signin' | 'signup' | 'verify' | 'forgot' | 'reset'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    verifyEmail,
    resendVerificationEmail,
    sendResetPasswordEmail,
    resetPasswordWithCode,
  } = useAuth()

  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const from = (location.state as { from?: string } | null)?.from || '/upload'

  // If the user lands here already authenticated (e.g., after OAuth callback),
  // bounce to the intended destination.
  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true })
    }
  }, [loading, user, from, navigate])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const id = window.setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => window.clearTimeout(id)
  }, [resendCooldown])

  function switchMode(next: Mode, opts?: { clearEmail?: boolean }) {
    setMode(next)
    setError(null)
    setNotice(null)
    setOtp('')
    setNewPassword('')
    if (opts?.clearEmail) setEmail('')
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setSubmitting(true)
    try {
      if (mode === 'signin') {
        const { error, needsVerification } = await signIn(email, password)
        if (needsVerification) {
          setNotice('Please verify your email to continue. Enter the code we sent.')
          setMode('verify')
          return
        }
        if (error) return setError(error)
        navigate(from, { replace: true })
      } else if (mode === 'signup') {
        const { error, needsVerification } = await signUp(email, password, name || undefined)
        if (error) return setError(error)
        if (needsVerification) {
          setNotice('Check your inbox for a 6-digit code.')
          setMode('verify')
          setResendCooldown(30)
        } else {
          navigate(from, { replace: true })
        }
      } else if (mode === 'verify') {
        const { error } = await verifyEmail(email, otp)
        if (error) return setError(error)
        navigate(from, { replace: true })
      } else if (mode === 'forgot') {
        const { error } = await sendResetPasswordEmail(email)
        if (error) return setError(error)
        setNotice('If that email exists, a 6-digit reset code is on its way.')
        setMode('reset')
      } else if (mode === 'reset') {
        const { error } = await resetPasswordWithCode(email, otp, newPassword)
        if (error) return setError(error)
        setPassword('')
        setNewPassword('')
        setOtp('')
        setNotice('Password updated. Sign in with your new password.')
        setMode('signin')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function onGoogle() {
    setError(null)
    setSubmitting(true)
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error)
      setSubmitting(false)
    }
    // On success the browser is redirected to Google, so no further UI work.
  }

  async function onResendCode() {
    if (!email || resendCooldown > 0) return
    setError(null)
    const { error } = await resendVerificationEmail(email)
    if (error) return setError(error)
    setNotice('New code sent. Check your inbox.')
    setResendCooldown(30)
  }

  const eyebrow = EYEBROWS[mode]
  const headline = HEADLINES[mode]
  const cta = submitting ? 'Please wait…' : CTAS[mode]
  const showOAuth = mode === 'signin' || mode === 'signup'
  const showBackLink = mode !== 'signin' && mode !== 'signup'

  return (
    <div className="min-h-full grid place-items-center py-12 px-6 bg-bg">
      <div className="w-full max-w-[380px] flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-ink text-accent grid place-items-center font-mono text-[11px] font-semibold">T</div>
          <div className="font-display text-[15px] font-semibold tracking-[-0.01em]">TennisMind</div>
        </div>

        <div>
          <div className="font-mono text-muted text-[10.5px] tracking-[.16em]">{eyebrow}</div>
          <h1 className="font-display text-[30px] mt-1 leading-[1.1]">{headline}</h1>
          {mode === 'verify' && email && (
            <p className="text-muted text-[13px] mt-1">
              We sent a 6-digit code to <span className="text-ink">{email}</span>.
            </p>
          )}
          {mode === 'forgot' && (
            <p className="text-muted text-[13px] mt-1">Enter your email and we'll send a reset code.</p>
          )}
          {mode === 'reset' && email && (
            <p className="text-muted text-[13px] mt-1">
              Enter the code from <span className="text-ink">{email}</span> and a new password.
            </p>
          )}
        </div>

        <form onSubmit={onSubmit} className="bg-card border border-line rounded-[14px] p-5 flex flex-col gap-3">
          {showOAuth && (
            <>
              <button
                type="button"
                onClick={onGoogle}
                disabled={submitting}
                className="h-[38px] rounded-full border border-line bg-white text-ink text-[12.5px] font-medium flex items-center justify-center gap-2 hover:bg-[#f4f4ef] disabled:opacity-50"
              >
                <GoogleGlyph />
                Continue with Google
              </button>
              <div className="flex items-center gap-2 my-1">
                <div className="flex-1 h-px bg-line-soft" />
                <span className="font-mono text-muted text-[10px] tracking-[.16em]">OR</span>
                <div className="flex-1 h-px bg-line-soft" />
              </div>
            </>
          )}

          {mode === 'signup' && (
            <Field label="Name">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                className={inputCls}
              />
            </Field>
          )}

          {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && (
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                className={inputCls}
              />
            </Field>
          )}

          {(mode === 'signin' || mode === 'signup') && (
            <Field label="Password">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className={inputCls}
              />
            </Field>
          )}

          {(mode === 'verify' || mode === 'reset') && (
            <Field label="6-digit code">
              <input
                type="text"
                required
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="h-11 w-full px-3 rounded-[10px] border border-line bg-white font-mono text-[18px] tracking-[.3em] outline-none focus:border-ink"
              />
            </Field>
          )}

          {mode === 'reset' && (
            <Field label="New password">
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className={inputCls}
              />
            </Field>
          )}

          {mode === 'signin' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-[11.5px] text-muted hover:text-ink underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          {notice && !error && (
            <div className="text-[12px] text-ink bg-court-soft border border-court/30 rounded-[10px] px-3 py-2">
              {notice}
            </div>
          )}

          {error && (
            <div className="text-[12px] text-clay bg-[#faece4] border border-clay/30 rounded-[10px] px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="h-[38px] rounded-full bg-ink text-accent text-[12.5px] font-medium disabled:opacity-50 hover:opacity-90"
          >
            {cta}
          </button>

          {mode === 'verify' && (
            <button
              type="button"
              onClick={onResendCode}
              disabled={submitting || !email || resendCooldown > 0}
              className="text-[11.5px] text-muted hover:text-ink underline disabled:opacity-50 disabled:no-underline"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
            </button>
          )}
        </form>

        <div className="text-center text-[12.5px] text-muted">
          {mode === 'signin' && (
            <>No account?{' '}
              <button type="button" onClick={() => switchMode('signup')} className="underline text-ink">
                Create one
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>Already have an account?{' '}
              <button type="button" onClick={() => switchMode('signin')} className="underline text-ink">
                Sign in
              </button>
            </>
          )}
          {showBackLink && (
            <button
              type="button"
              onClick={() => switchMode('signin', { clearEmail: mode === 'forgot' })}
              className="underline text-ink"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const EYEBROWS: Record<Mode, string> = {
  signin: 'SIGN IN',
  signup: 'CREATE ACCOUNT',
  verify: 'VERIFY EMAIL',
  forgot: 'RESET PASSWORD',
  reset: 'RESET PASSWORD',
}

const HEADLINES: Record<Mode, string> = {
  signin: 'Welcome back.',
  signup: 'Get your coach.',
  verify: 'Check your inbox.',
  forgot: 'Forgot your password?',
  reset: 'Set a new password.',
}

const CTAS: Record<Mode, string> = {
  signin: 'Sign in',
  signup: 'Create account',
  verify: 'Verify code',
  forgot: 'Send reset code',
  reset: 'Update password',
}

const inputCls =
  'h-10 w-full px-3 rounded-[10px] border border-line bg-white text-[13px] outline-none focus:border-ink'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-muted text-[10.5px] tracking-[.12em]">{label.toUpperCase()}</span>
      {children}
    </label>
  )
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 18 18" width={16} height={16} aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.25h2.92c1.71-1.57 2.68-3.9 2.68-6.6z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.25c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.97 10.73A5.42 5.42 0 0 1 3.68 9c0-.6.1-1.18.29-1.73V4.94H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.06l3.01-2.33z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.87 11.42 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
    </svg>
  )
}
