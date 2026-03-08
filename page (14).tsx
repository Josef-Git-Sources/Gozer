'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Pencil, Plus, Check, X, ExternalLink } from 'lucide-react'

interface Course { id: string; name: string; provider: string; url: string; domain: string; durationWeeks: number | null; priceRange: string | null; description: string | null; isActive: boolean }

const domains = [
  { value: 'tech', label: '💻 טכנולוגיה' },
  { value: 'design', label: '🎨 עיצוב' },
  { value: 'business', label: '💼 עסקים' },
  { value: 'marketing', label: '📣 שיווק' },
  { value: 'medical', label: '🏥 רפואה' },
  { value: 'other', label: '📚 אחר' },
]

const emptyForm = { name: '', provider: '', url: '', domain: 'tech', durationWeeks: '', priceRange: '', description: '', isActive: true }

export default function AdminCoursesPage() {
  const [items, setItems] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Course | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/courses')
    setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startAdd() { setForm(emptyForm); setAdding(true); setEditing(null); setError('') }
  function startEdit(item: Course) {
    setForm({ name: item.name, provider: item.provider, url: item.url, domain: item.domain, durationWeeks: item.durationWeeks?.toString() || '', priceRange: item.priceRange || '', description: item.description || '', isActive: item.isActive })
    setEditing(item); setAdding(false); setError('')
  }
  function cancel() { setAdding(false); setEditing(null); setError('') }

  async function save() {
    if (!form.name || !form.provider || !form.url || !form.domain) { setError('שדות חובה: שם, ספק, קישור, תחום'); return }
    setSaving(true); setError('')
    if (editing) {
      await fetch(`/api/admin/courses/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/admin/courses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    await load(); cancel(); setSaving(false)
  }

  async function deleteItem(item: Course) {
    if (!confirm(`למחוק את "${item.name}"?`)) return
    await fetch(`/api/admin/courses/${item.id}`, { method: 'DELETE' })
    await load()
  }

  const domainLabel = (d: string) => domains.find(x => x.value === d)?.label || d

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">← פאנל ניהול</Link>
          <h1 className="font-display text-2xl font-bold text-green-dark">📚 ניהול קורסים</h1>
        </div>
        <button onClick={startAdd} className="flex items-center gap-2 bg-green-dark text-white font-bold px-4 py-2 rounded-xl hover:bg-green-800 transition-colors">
          <Plus size={16} /> קורס חדש
        </button>
      </div>

      {(adding || editing) && (
        <div className="bg-white rounded-2xl border-2 border-green-mid/30 p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">{editing ? 'עריכת קורס' : 'קורס חדש'}</h2>
          {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-2 text-sm mb-4">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">שם הקורס *</label>
              <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Full Stack Development" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">ספק / מוסד *</label>
              <input value={form.provider} onChange={e => setForm(p => ({...p, provider: e.target.value}))} placeholder="Elevation" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">קישור *</label>
              <input value={form.url} onChange={e => setForm(p => ({...p, url: e.target.value}))} placeholder="https://..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">תחום *</label>
              <select value={form.domain} onChange={e => setForm(p => ({...p, domain: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid">
                {domains.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">משך (שבועות)</label>
              <input type="number" value={form.durationWeeks} onChange={e => setForm(p => ({...p, durationWeeks: e.target.value}))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">טווח מחיר</label>
              <input value={form.priceRange} onChange={e => setForm(p => ({...p, priceRange: e.target.value}))} placeholder="מלגות זמינות / חינם / ₪20,000" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">תיאור</label>
              <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid resize-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-green-dark text-white font-bold px-4 py-2 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50"><Check size={16} /> {saving ? 'שומר...' : 'שמור'}</button>
            <button onClick={cancel} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"><X size={16} /> ביטול</button>
          </div>
        </div>
      )}

      {loading ? <div className="text-center py-20 text-gray-400">טוען...</div> : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right text-xs font-bold text-gray-500 px-6 py-3">קורס</th>
                <th className="text-right text-xs font-bold text-gray-500 px-4 py-3 hidden md:table-cell">תחום</th>
                <th className="text-right text-xs font-bold text-gray-500 px-4 py-3 hidden md:table-cell">משך</th>
                <th className="text-right text-xs font-bold text-gray-500 px-4 py-3 hidden md:table-cell">מחיר</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${!item.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.provider}</div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-gray-500">{domainLabel(item.domain)}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-gray-400">{item.durationWeeks ? `${item.durationWeeks} שבועות` : '—'}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-gray-400">{item.priceRange || '—'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><ExternalLink size={14} /></a>
                      <button onClick={() => startEdit(item)} className="p-2 rounded-lg text-gray-400 hover:text-green-dark hover:bg-green-light transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => deleteItem(item)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
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
