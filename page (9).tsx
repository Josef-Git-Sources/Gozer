'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Shield, ShieldOff, Search } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface User {
  id: string; name: string | null; email: string; role: string
  createdAt: string; emailVerified: string | null; totpEnabled: boolean
  _count: { checklistItems: number; trips: number; quizResults: number }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  async function load(q = '') {
    setLoading(true)
    const res = await fetch('/api/admin/users' + (q ? `?search=${encodeURIComponent(q)}` : ''))
    setUsers(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleRole(user: User) {
    if (!confirm(`לשנות תפקיד של ${user.name || user.email}?`)) return
    setBusy(user.id)
    await fetch(`/api/admin/users/${user.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' }),
    })
    await load(search)
    setBusy(null)
  }

  async function deleteUser(user: User) {
    if (!confirm(`למחוק את ${user.name || user.email}? פעולה זו אינה הפיכה.`)) return
    setBusy(user.id)
    await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
    await load(search)
    setBusy(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">← פאנל ניהול</Link>
          <h1 className="font-display text-2xl font-bold text-green-dark">👥 ניהול משתמשים</h1>
        </div>
        <span className="bg-gray-100 rounded-full px-4 py-1 text-sm text-gray-600 font-medium">{users.length} משתמשים</span>
      </div>

      <form onSubmit={e => { e.preventDefault(); load(search) }} className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם או מייל..."
            className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:border-green-mid" />
        </div>
        <button type="submit" className="bg-green-dark text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-green-800 transition-colors">חיפוש</button>
        {search && <button type="button" onClick={() => { setSearch(''); load('') }} className="text-sm text-gray-400 hover:text-gray-600 px-2">נקה</button>}
      </form>

      {loading ? <div className="text-center py-20 text-gray-400">טוען...</div> : users.length === 0 ? (
        <div className="text-center py-20 text-gray-400"><div className="text-5xl mb-3">👤</div><p>לא נמצאו משתמשים</p></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right text-xs font-bold text-gray-500 px-6 py-3">משתמש</th>
                <th className="text-right text-xs font-bold text-gray-500 px-4 py-3">תפקיד</th>
                <th className="text-right text-xs font-bold text-gray-500 px-4 py-3 hidden md:table-cell">פעילות</th>
                <th className="text-right text-xs font-bold text-gray-500 px-4 py-3 hidden md:table-cell">הצטרף</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-sm">{user.name || '(ללא שם)'}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                    <div className="flex gap-2 mt-1">
                      {user.emailVerified && <span className="text-xs text-green-600">✓ מאומת</span>}
                      {user.totpEnabled && <span className="text-xs text-blue-600">🔐 2FA</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-green-light text-green-dark' : 'bg-gray-100 text-gray-500'}`}>
                      {user.role === 'ADMIN' ? 'מנהל' : 'משתמש'}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex gap-3 text-xs text-gray-400">
                      <span>✅ {user._count.checklistItems}</span>
                      <span>✈️ {user._count.trips}</span>
                      <span>🎯 {user._count.quizResults}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-gray-400">{formatDate(user.createdAt)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => toggleRole(user)} disabled={busy === user.id}
                        title={user.role === 'ADMIN' ? 'הסר הרשאות מנהל' : 'הפוך למנהל'}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-dark hover:bg-green-light transition-colors disabled:opacity-40">
                        {user.role === 'ADMIN' ? <ShieldOff size={16} /> : <Shield size={16} />}
                      </button>
                      <button onClick={() => deleteUser(user)} disabled={busy === user.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
