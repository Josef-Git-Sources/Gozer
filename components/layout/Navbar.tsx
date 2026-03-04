'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Menu, X, Shield, LogOut, User, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/zchuyot', label: 'זכויות וחובות', icon: '📋' },
  { href: '/checklist', label: 'צ\'קליסט שחרור', icon: '✅' },
  { href: '/tiyul', label: 'מתכנן טיול', icon: '✈️' },
  { href: '/kariera', label: 'הכוונה מקצועית', icon: '🎯' },
]

export function Navbar() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <>
      {/* Skip to content */}
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>

      <header className="sticky top-0 z-50 bg-green-dark shadow-lg" role="banner">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="ניווט ראשי">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
              <span className="text-2xl" aria-hidden="true">🪖</span>
              <span className="font-display text-xl font-bold tracking-wide">גוזר</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className="text-white/85 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-all">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-white/85 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true">
                    <User size={18} aria-hidden="true" />
                    <span className="text-sm">{session.user.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} aria-hidden="true" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                      role="menu" aria-label="תפריט משתמש">
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)} role="menuitem">
                        <User size={16} aria-hidden="true" />הפרופיל שלי
                      </Link>
                      {(session.user as any).role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)} role="menuitem">
                          <Shield size={16} aria-hidden="true" />פאנל ניהול
                        </Link>
                      )}
                      <button onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        role="menuitem">
                        <LogOut size={16} aria-hidden="true" />התנתק
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-white/85 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
                    כניסה
                  </Link>
                  <Link href="/register" className="bg-gold text-green-dark text-sm font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors">
                    הרשמה חינם
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}>
              {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>

          {/* Mobile menu */}
          {open && (
            <div id="mobile-menu" className="md:hidden pb-4 animate-fade-in">
              <div className="flex flex-col gap-1 pt-2 border-t border-white/20">
                {navLinks.map(link => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-3 text-white/85 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all"
                    onClick={() => setOpen(false)}>
                    <span aria-hidden="true">{link.icon}</span>{link.label}
                  </Link>
                ))}
                <div className="border-t border-white/20 mt-2 pt-2 flex flex-col gap-1">
                  {session ? (
                    <>
                      <Link href="/profile" className="text-white/85 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all" onClick={() => setOpen(false)}>
                        הפרופיל שלי
                      </Link>
                      <button onClick={() => signOut({ callbackUrl: '/' })} className="text-right text-white/85 px-4 py-3 rounded-lg hover:bg-white/10 transition-all">
                        התנתק
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="text-white/85 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-all" onClick={() => setOpen(false)}>כניסה</Link>
                      <Link href="/register" className="bg-gold text-green-dark font-bold text-center px-4 py-3 rounded-lg" onClick={() => setOpen(false)}>הרשמה חינם</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}
