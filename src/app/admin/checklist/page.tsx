'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Pencil, Plus, Check, X } from 'lucide-react'

interface Item { id: string; title: string; description: string | null; period: string; order: number; isActive: boolean }

const periodLabels: Record<string, string> = {
  '3months': '3 חודשים לפני שחרור',
  '1month': 'חודש לפני שחרור',
  '1week': 'שבוע לפני שחרור',
  'release_day': 'יום השחרור',
  '1week_after': 'שבוע אחרי שחרור',
}
const periodOrder = ['3months', '1month', '1week', 'release_day', '1week_after']

const emptyForm = { title: '', description: '', period: '3months', order: 0, isActive: true }

export default function AdminChecklistPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Item | null>(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/checklist')
    setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function startAdd() { setForm(emptyForm); setAdding(true); setEditing(null); setError('') }
  function startEdit(item: Item) { setForm({ title: item.title, description: item.description || '', period: item.period, order: item.order, isActive: item.isActive }); setEditing(item); setAdding(false); setError('') }
  function cancel() { setAdding(false); setEditing(null); setError('') }

  async function save() {
    if (!form.title.trim()) { setError('כותרת היא שדה חובה'); return }
    setSaving(true); setError('')
    if (editing) {
      await fetch(`/api/admin/checklist/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/admin/checklist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    await load(); cancel(); setSaving(false)
  }

  async function deleteItem(item: Item) {
    if (!confirm(`למחוק "${item.title}"?`)) return
    await fetch(`/api/admin/checklist/${item.id}`, { method: 'DELETE' })
    await load()
  }

  const grouped = periodOrder.map(p => ({ period: p, label: periodLabels[p], items: items.filter(i => i.period === p) }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">← פאנל ניהול</Link>
          <h1 className="font-display text-2xl font-bold text-green-dark">✅ ניהול צ'קליסט</h1>
        </div>
        <button onClick={startAdd} className="flex items-center gap-2 bg-green-dark text-white font-bold px-4 py-2 rounded-xl hover:bg-green-800 transition-colors">
          <Plus size={16} /> פריט חדש
        </button>
      </div>

      {/* Add/Edit form */}
      {(adding || editing) && (
        <div className="bg-white rounded-2xl border-2 border-green-mid/30 p-6 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">{editing ? 'עריכת פריט' : 'פריט חדש'}</h2>
          {error && <div className="bg-red-50 text-red-700 rounded-xl px-4 py-2 text-sm mb-4">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">כותרת *</label>
              <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))}
                placeholder="למשל: פגישה עם קצין שחרור"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">תיאור</label>
              <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                rows={2} placeholder="הסבר קצר על הפריט..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-mid resize-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">תקופה *</label>
              <select value={form.period} onChange={e => setForm(p => ({...p, period: e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid">
                {periodOrder.map(p => <option key={p} value={p}>{periodLabels[p]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">סדר</label>
              <input type="number" value={form.order} onChange={e => setForm(p => ({...p, order: Number(e.target.value)}))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-green-mid" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 bg-green-dark text-white font-bold px-4 py-2 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50">
              <Check size={16} /> {saving ? 'שומר...' : 'שמור'}
            </button>
            <button onClick={cancel} className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
              <X size={16} /> ביטול
            </button>
          </div>
        </div>
      )}

      {loading ? <div className="text-center py-20 text-gray-400">טוען...</div> : (
        <div className="space-y-8">
          {grouped.map(group => group.items.length > 0 && (
            <div key={group.period}>
              <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="bg-green-light text-green-dark text-xs px-3 py-1 rounded-full">{group.label}</span>
                <span className="text-gray-400 text-sm">{group.items.length} פריטים</span>
              </h2>
              <div className="space-y-2">
                {group.items.sort((a,b) => a.order - b.order).map(item => (
                  <div key={item.id} className={`bg-white rounded-xl border px-5 py-4 flex items-start justify-between gap-4 ${!item.isActive ? 'opacity-50' : 'border-gray-100'}`}>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                      {item.description && <div className="text-xs text-gray-400 mt-1">{item.description}</div>}
                      <div className="text-xs text-gray-300 mt-1">סדר: {item.order}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => startEdit(item)} className="p-2 rounded-lg text-gray-400 hover:text-green-dark hover:bg-green-light transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => deleteItem(item)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
