'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Pencil, Plus, Check, X } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Dest { id: string; name: string; nameEn: string | null; region: string; flag: string | null; avgFlightIls: number; avgAccommodationIls: number; avgFoodDaily: number; avgTransportDaily: number; avgActivitiesDaily: number; tips: string | null; isActive: boolean }

const emptyForm = { name: '', nameEn: '', region: '', flag: '', avgFlightIls: 0, avgAccommodationIls: 0, avgFoodDaily: 0, avgTransportDaily: 0, avgActivitiesDaily: 0, tips: '', isActive: true }

export default function AdminDestinationsPage() {
  const [items, setItems] = useState<Dest[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Dest | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState<typeof emptyForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/destinations')
    setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startAdd() { setForm(emptyForm); setAdding(true); setEditing(null); setError('') }
  function startEdit(item: Dest) {
    setForm({ name: item.name, nameEn: item.nameEn || '', region: item.region, flag: item.flag || '', avgFlightIls: item.avgFlightIls, avgAccommodationIls: item.avgAccommodationIls, avgFoodDaily: item.avgFoodDaily, avgTransportDaily: item.avgTransportDaily, avgActivitiesDaily: item.avgActivitiesDaily, tips: item.tips || '', isActive: item.isActive })
    setEditing(item); setAdding(false); setError('')
  }
  function cancel() { setAdding(false); setEditing(null); setError('') }

  async function save() {
    if (!form.name.trim() || !form.region.trim()) { setError('שם ואזור הם שדות חובה'); return }
    setSaving(true); setError('')
    if (editing) {
      await fetch(`/api/admin/destinations/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/admin/destinations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    await load(); cancel(); setSaving(false)
  }

  async function deleteItem(item: Dest) {
    if (!confirm(`למחוק את ${item.name}?`)) return
    await fetch(`/api/admin/destinations/${item.id}`, { method: 'DELETE' })
    await load()
  }

  function num(key: keyof typeof emptyForm, val: string) {
    setForm(p => ({ ...p, [key]: Number(val) || 0 }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">← פאנל ניהול</Link>
          <h1 className="font-display text-2xl font-bold text-green-dark">🌍 ניהול יעדי טיול</h1>
        </div>
        <button onClick={startAdd} className="flex items-center gap-2 bg-green-dark text-white font-bold px-4 py-2 rounded-xl hover:bg-green-800 transition-colors">
          <Plus size={16} /> יעד חדש
        </button>
      </div>

      {(adding || editing) && (
        <div className="bg-white rounded-2xl border-2 border-green-mid/30 p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">{editing ? 'עריכת יעד' : 'יעד חדש'}</h2>
          {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-2 text-sm mb-4">{error}</div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">שם בעברית *</label>
              <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="תאילנד" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">שם באנגלית</label>
              <input value={form.nameEn} onChange={e => setForm(p => ({...p, nameEn: e.target.value}))} placeholder="Thailand" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">דגל</label>
              <input value={form.flag} onChange={e => setForm(p => ({...p, flag: e.target.value}))} placeholder="🇹🇭" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">אזור *</label>
              <input value={form.region} onChange={e => setForm(p => ({...p, region: e.target.value}))} placeholder="דרום מזרח אסיה" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div><label className="block text-xs font-bold text-gray-700 mb-1">טיסה ממוצעת (₪)</label><input type="number" value={form.avgFlightIls} onChange={e => num('avgFlightIls', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" /></div>
            <div><label className="block text-xs font-bold text-gray-700 mb-1">לינה ללילה (₪)</label><input type="number" value={form.avgAccommodationIls} onChange={e => num('avgAccommodationIls', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" /></div>
            <div><label className="block text-xs font-bold text-gray-700 mb-1">אוכל ליום (₪)</label><input type="number" value={form.avgFoodDaily} onChange={e => num('avgFoodDaily', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" /></div>
            <div><label className="block text-xs font-bold text-gray-700 mb-1">תחבורה ליום (₪)</label><input type="number" value={form.avgTransportDaily} onChange={e => num('avgTransportDaily', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" /></div>
            <div><label className="block text-xs font-bold text-gray-700 mb-1">אטרקציות ליום (₪)</label><input type="number" value={form.avgActivitiesDaily} onChange={e => num('avgActivitiesDaily', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid" /></div>
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">טיפים ומידע</label>
              <textarea value={form.tips} onChange={e => setForm(p => ({...p, tips: e.target.value}))} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid resize-none" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-green-dark text-white font-bold px-4 py-2 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50"><Check size={16} /> {saving ? 'שומר...' : 'שמור'}</button>
            <button onClick={cancel} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"><X size={16} /> ביטול</button>
          </div>
        </div>
      )}

      {loading ? <div className="text-center py-20 text-gray-400">טוען...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className={`bg-white rounded-2xl border border-gray-100 p-5 ${!item.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.flag}</span>
                  <div>
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.region}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-green-dark hover:bg-green-light transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => deleteItem(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between"><span>טיסה:</span><span className="font-medium">{formatCurrency(item.avgFlightIls)}</span></div>
                <div className="flex justify-between"><span>לינה/לילה:</span><span className="font-medium">{formatCurrency(item.avgAccommodationIls)}</span></div>
                <div className="flex justify-between"><span>אוכל/יום:</span><span className="font-medium">{formatCurrency(item.avgFoodDaily)}</span></div>
              </div>
              {item.tips && <p className="text-xs text-gray-400 mt-3 border-t border-gray-50 pt-3 line-clamp-2">{item.tips}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
