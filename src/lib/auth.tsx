import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { insforge } from './insforge'

export type AuthUser = {
  id: string
  email: string
  emailVerified?: boolean
  profile?: { name?: string | null; avatar_url?: string | null } | null
}

type Result = { error?: string }
type SignUpResult = Result & { needsVerification?: boolean; unverified?: boolean }
type SignInResult = Result & { needsVerification?: boolean }

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<SignInResult>
  signUp: (email: string, password: string, name?: string) => Promise<SignUpResult>
  signInWithGoogle: (redirectTo?: string) => Promise<Result>
  verifyEmail: (email: string, otp: string) => Promise<Result>
  resendVerificationEmail: (email: string) => Promise<Result>
  sendResetPasswordEmail: (email: string) => Promise<Result>
  resetPasswordWithCode: (email: string, code: string, newPassword: string) => Promise<Result>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function looksUnverified(msg: string | undefined | null): boolean {
  if (!msg) return false
  return /verif|confirm/i.test(msg)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (!mounted) return
      setUser((data?.user as AuthUser | null) ?? null)
      setLoading(false)
    })
    return () => {
      mounted = false
    }
  }, [])

  async function signIn(email: string, password: string): Promise<SignInResult> {
    const { data, error } = await insforge.auth.signInWithPassword({ email, password })
    if (error) {
      return looksUnverified(error.message)
        ? { error: error.message, needsVerification: true }
        : { error: error.message }
    }
    const u = (data?.user as AuthUser | null) ?? null
    if (u && u.emailVerified === false) {
      return { needsVerification: true }
    }
    setUser(u)
    return {}
  }

  async function signUp(email: string, password: string, name?: string): Promise<SignUpResult> {
    const { data, error } = await insforge.auth.signUp({ email, password, name })
    if (error) return { error: error.message }
    if (data?.requireEmailVerification) return { needsVerification: true }
    setUser((data?.user as AuthUser | null) ?? null)
    return {}
  }

  async function signInWithGoogle(redirectTo?: string): Promise<Result> {
    const { error } = await insforge.auth.signInWithOAuth({
      provider: 'google',
      redirectTo: redirectTo ?? `${window.location.origin}/auth`,
    })
    if (error) return { error: error.message }
    return {}
  }

  async function verifyEmail(email: string, otp: string): Promise<Result> {
    const { data, error } = await insforge.auth.verifyEmail({ email, otp })
    if (error) return { error: error.message }
    setUser((data?.user as AuthUser | null) ?? null)
    return {}
  }

  async function resendVerificationEmail(email: string): Promise<Result> {
    const { error } = await insforge.auth.resendVerificationEmail({ email })
    if (error) return { error: error.message }
    return {}
  }

  async function sendResetPasswordEmail(email: string): Promise<Result> {
    const { error } = await insforge.auth.sendResetPasswordEmail({ email })
    if (error) return { error: error.message }
    return {}
  }

  async function resetPasswordWithCode(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<Result> {
    const { data, error } = await insforge.auth.exchangeResetPasswordToken({ email, code })
    if (error || !data) return { error: error?.message ?? 'Invalid or expired code' }
    const { error: resetError } = await insforge.auth.resetPassword({
      newPassword,
      otp: data.token,
    })
    if (resetError) return { error: resetError.message }
    return {}
  }

  async function signOut() {
    await insforge.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        verifyEmail,
        resendVerificationEmail,
        sendResetPasswordEmail,
        resetPasswordWithCode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export function initialsFor(user: AuthUser | null | undefined): string {
  if (!user) return '—'
  const name = user.profile?.name?.trim()
  if (name) {
    const parts = name.split(/\s+/).slice(0, 2)
    return parts.map(p => p[0]!.toUpperCase()).join('')
  }
  return user.email.slice(0, 2).toUpperCase()
}
