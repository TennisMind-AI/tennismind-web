import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { initialsFor, useAuth, type AuthUser } from '../lib/auth'

function displayNameFor(user: AuthUser): string {
  const name = user.profile?.name?.trim()
  if (name) return name
  return user.email.split('@')[0] ?? user.email
}

export type NavKey = 'upload' | 'history'

const NAV: { id: NavKey; to: string; label: string }[] = [
  { id: 'upload', to: '/upload', label: 'Upload' },
  { id: 'history', to: '/history', label: 'History' },
]

type Props = {
  activeNav?: NavKey | null
  title: string
  children: ReactNode
}

export function AppShell({ activeNav, title, children }: Props) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [avatarFailed, setAvatarFailed] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  async function onSignOut() {
    setMenuOpen(false)
    await signOut()
    navigate('/upload', { replace: true })
  }

  return (
    <div className="w-full h-full grid grid-cols-[220px_1fr] bg-bg text-ink">
      <aside className="border-r border-line bg-[#fbfbf8] px-3.5 py-[18px] flex flex-col gap-4">
        <Link to="/upload" className="block px-1 py-1">
          <img
            src="/logo.png"
            alt="TennisMind"
            className="block w-full max-w-[160px] h-auto mx-auto"
          />
        </Link>

        <nav className="flex flex-col gap-0.5">
          {NAV.map(item => {
            const on = item.id === activeNav
            return (
              <Link
                key={item.id}
                to={item.to}
                className={[
                  'flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[12.5px] transition-colors',
                  on ? 'bg-ink text-accent font-medium' : 'text-muted hover:bg-[#f4f4ef]',
                ].join(' ')}
              >
                <span
                  className={[
                    'w-[5px] h-[5px] rounded-full',
                    on ? 'bg-accent' : 'bg-line',
                  ].join(' ')}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <main className="flex flex-col min-w-0 overflow-hidden">
        <header className="h-[52px] flex items-center justify-between px-[22px] border-b border-line bg-[#fbfbf8]">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-muted">TennisMind</span>
            <span className="text-muted">/</span>
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  title={user.email}
                  className="flex items-center gap-2 h-[34px] pl-0.5 pr-3 rounded-full hover:bg-[#f4f4ef]"
                >
                  {user.profile?.avatar_url && !avatarFailed ? (
                    <img
                      src={user.profile.avatar_url}
                      alt=""
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarFailed(true)}
                      className="w-[30px] h-[30px] rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-[30px] h-[30px] rounded-full bg-ink text-accent grid place-items-center font-mono text-[11px]">
                      {initialsFor(user)}
                    </div>
                  )}
                  <span className="text-[12.5px] font-medium max-w-[160px] truncate">
                    {displayNameFor(user)}
                  </span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-[40px] min-w-[200px] bg-card border border-line rounded-[12px] p-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] z-10">
                    <div className="px-2.5 py-2 text-[11.5px]">
                      <div className="text-muted text-[10.5px] font-mono tracking-[.12em]">SIGNED IN</div>
                      <div className="truncate text-ink mt-0.5">{user.email}</div>
                    </div>
                    <div className="h-px bg-line-soft my-1" />
                    <button
                      onClick={onSignOut}
                      className="w-full text-left px-2.5 py-2 rounded-[8px] text-[12.5px] text-ink hover:bg-[#f4f4ef]"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="h-[34px] px-3.5 rounded-full bg-ink text-accent text-[12.5px] font-medium flex items-center hover:opacity-90"
              >
                Sign in
              </Link>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-hidden relative">{children}</div>
      </main>
    </div>
  )
}
