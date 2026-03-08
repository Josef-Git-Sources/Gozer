'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const passwordRules = [
    { label: 'לפחות 8 תווים', ok: form.password.length >= 8 },
    { label: 'אות גדולה באנגלית', ok: /[A-Z]/.test(form.password) },
    { label: 'לפחות ספרה אחת', ok: /[0-9]/.test(form.password) },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      setSuccess(true)
    } catch {
      setError('שגיאה בשרת, נסה שוב')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center animate-slide-up">
          <div className="text-6xl mb-4" aria-hidden="true">📧</div>
          <h1 className="font-display text-3xl font-bold text-green-dark mb-3">בדוק את המייל שלך!</h1>
          <p className="text-gray-600 mb-6">שלחנו קישור אימות לכתובת <strong>{form.email}</strong>. לחץ עליו כדי להשלים את ההרשמה.</p>
          <Link href="/login" className="text-blue-mid hover:underline text-sm">חזור לכניסה</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3" aria-hidden="true">🪖</div>
          <h1 className="font-display text-3xl font-bold text-green-dark">הרשמה לגוזר</h1>
          <p className="text-gray-500 mt-2">חינם לחלוטין — לא צריך כרטיס אשראי</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm" role="alert">{error}</div>
          )}

          {/* Google */}
          <button onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors mb-6">
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            הרשמה עם Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-sm"><span className="bg-white px-3 text-gray-400">או עם מייל וסיסמה</span></div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                <input id="name" type="text" autoComplete="name" required
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-mid outline-none transition"
                  placeholder="ישראל ישראלי" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">כתובת מייל</label>
                <input id="email" type="email" autoComplete="email" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-mid outline-none transition"
                  placeholder="your@email.com" dir="ltr" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
                <div className="relative">
                  <input id="password" type={showPass ? 'text' : 'password'} autoComplete="new-password" required
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-12 text-sm focus:ring-2 focus:ring-green-mid outline-none transition"
                    placeholder="••••••••" dir="ltr" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPass ? 'הסתר סיסמה' : 'הצג סיסמה'}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.password && (
                  <ul className="mt-2 space-y-1" aria-label="דרישות סיסמה">
                    {passwordRules.map(rule => (
                      <li key={rule.label} className={`flex items-center gap-2 text-xs ${rule.ok ? 'text-green-600' : 'text-gray-400'}`}>
                        <CheckCircle size={12} aria-hidden="true" className={rule.ok ? 'opacity-100' : 'opacity-30'} />
                        {rule.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading || passwordRules.some(r => !r.ok) || !form.name || !form.email}
              className="w-full mt-6 bg-green-dark text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
              {loading ? 'נרשם...' : 'הרשמה חינם'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            כבר יש לך חשבון?{' '}
            <Link href="/login" className="text-blue-mid font-medium hover:underline">כניסה</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
