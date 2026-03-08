'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Eye, ArrowRight } from 'lucide-react'

interface Category { id: string; name: string }
interface ArticleFormProps {
  initialData?: {
    id?: string
    title?: string
    content?: string
    excerpt?: string
    categoryId?: string
    tags?: string[]
    status?: string
    period?: string
    metaTitle?: string
    metaDesc?: string
  }
}

const periods = [
  { value: 'before', label: 'לפני שחרור' },
  { value: 'after', label: 'אחרי שחרור' },
  { value: 'reserves', label: 'מילואים' },
  { value: 'all', label: 'כללי' },
]

export function ArticleForm({ initialData }: ArticleFormProps) {
  const router = useRouter()
  const isEdit = !!initialData?.id

  const [form, setForm] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    categoryId: initialData?.categoryId || '',
    tags: initialData?.tags?.join(', ') || '',
    status: initialData?.status || 'draft',
    period: initialData?.period || 'all',
    metaTitle: initialData?.metaTitle || '',
    metaDesc: initialData?.metaDesc || '',
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'content' | 'seo'>('content')

  useEffect(() => {
    fetch('/api/admin/articles').then(r => r.json()).then(() => {})
    // Load categories separately
    fetch('/api/admin/articles?_cat=1').catch(() => {})
    // Fetch categories from public endpoint
    fetch('/zchuyot').catch(() => {})
  }, [])

  useEffect(() => {
    // Load categories via prisma through a simple approach
    fetch('/api/categories').catch(() => {})
  }, [])

  // Fetch categories
  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => r.ok ? r.json() : [])
      .then(data => Array.isArray(data) ? setCategories(data) : setCategories([]))
      .catch(() => setCategories([]))
  }, [])

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function save(statusOverride?: string) {
    if (!form.title.trim()) { setError('כותרת היא שדה חובה'); return }
    if (!form.content.trim()) { setError('תוכן הוא שדה חובה'); return }

    setSaving(true)
    setError('')

    const payload = {
      ...form,
      status: statusOverride || form.status,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      categoryId: form.categoryId || null,
    }

    const url = isEdit ? `/api/admin/articles/${initialData!.id}` : '/api/admin/articles'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin/articles')
    } else {
      const data = await res.json()
      setError(data.error || 'שגיאה בשמירה')
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => router.push('/admin/articles')}
            className="text-sm text-gray-400 hover:text-gray-600 mb-1 flex items-center gap-1">
            <ArrowRight size={14} /> ניהול מאמרים
          </button>
          <h1 className="font-display text-2xl font-bold text-green-dark">
            {isEdit ? '✏️ עריכת מאמר' : '➕ מאמר חדש'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => save('draft')} disabled={saving}
            className="flex items-center gap-2 border-2 border-gray-300 text-gray-600 font-bold px-4 py-2 rounded-xl hover:border-gray-400 transition-colors disabled:opacity-50">
            <Save size={16} /> שמור טיוטה
          </button>
          <button onClick={() => save('published')} disabled={saving}
            className="flex items-center gap-2 bg-green-dark text-white font-bold px-4 py-2 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50">
            <Eye size={16} /> פרסם
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">כותרת *</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="כותרת המאמר..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-medium focus:outline-none focus:border-green-mid transition-colors"
            />
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[['content', 'תוכן'], ['seo', 'SEO']].map(([key, label]) => (
                <button key={key} onClick={() => setTab(key as any)}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${tab === key ? 'text-green-dark border-b-2 border-green-dark bg-green-light/30' : 'text-gray-500 hover:text-gray-700'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {tab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">תוכן (HTML) *</label>
                    <textarea
                      value={form.content}
                      onChange={e => set('content', e.target.value)}
                      rows={20}
                      placeholder="<h2>כותרת</h2><p>תוכן המאמר...</p>"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-green-mid transition-colors resize-y"
                    />
                    <p className="text-xs text-gray-400 mt-1">תומך ב-HTML. השתמש בתגיות h2, h3, p, ul, li, strong, em</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">תקציר</label>
                    <textarea
                      value={form.excerpt}
                      onChange={e => set('excerpt', e.target.value)}
                      rows={2}
                      placeholder="תקציר קצר לכרטיס המאמר..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-mid transition-colors"
                    />
                  </div>
                </div>
              )}

              {tab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">כותרת SEO</label>
                    <input
                      value={form.metaTitle}
                      onChange={e => set('metaTitle', e.target.value)}
                      placeholder="כותרת למנועי חיפוש (מקסימום 60 תווים)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-mid transition-colors"
                    />
                    <p className="text-xs text-gray-400 mt-1">{form.metaTitle.length}/60 תווים</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">תיאור SEO</label>
                    <textarea
                      value={form.metaDesc}
                      onChange={e => set('metaDesc', e.target.value)}
                      rows={3}
                      placeholder="תיאור למנועי חיפוש (מקסימום 160 תווים)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-mid transition-colors"
                    />
                    <p className="text-xs text-gray-400 mt-1">{form.metaDesc.length}/160 תווים</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">סטטוס</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid">
                <option value="draft">טיוטה</option>
                <option value="published">פורסם</option>
                <option value="hidden">מוסתר</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">תקופה</label>
              <select value={form.period} onChange={e => set('period', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid">
                {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">קטגוריה</label>
              <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid">
                <option value="">ללא קטגוריה</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">תגיות</label>
              <input
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="מענק, שחרור, כסף (מופרדות בפסיק)"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-mid"
              />
            </div>
          </div>

          <button onClick={() => save()} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-green-dark text-white font-bold px-4 py-3 rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50">
            <Save size={16} /> {saving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>
      </div>
    </div>
  )
}
