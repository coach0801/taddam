'use client'
import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { type Locale } from '@/lib/i18n'

interface UserMenuProps {
  locale: Locale
  /** Override initials (e.g. hardcoded fallback before session loads) */
  fallbackInitials?: string
  dark?: boolean
}

export default function UserMenu({ locale, fallbackInitials = 'U', dark = false }: UserMenuProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const user = session?.user as any
  const initials = user?.name
    ? user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : fallbackInitials

  const bgClass = dark
    ? 'bg-brand-700 text-white'
    : 'bg-brand-100 text-brand-700'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm hover:opacity-80 transition-opacity cursor-pointer ${bgClass}`}
        aria-label="User menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
          {user && (
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          )}
          <Link
            href={`/${locale}/dashboard`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <User size={14} />
            Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}/auth/login` })}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
