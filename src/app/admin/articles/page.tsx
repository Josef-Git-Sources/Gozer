'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Article {
  id: string
  title: string
  status: string
  period: string
  readTime: number
  updatedAt: string
  category?: { name: string } | null
}

const statusLabel: Record<string, string> = { published: 'פורסם', draft: 'טיוטה', hidden: 'מוסתר' }
const statusColor: Record<string, string> = {
  published: 'bg-green-light text-green-dark',
  draft: 'bg-gold-light text-amber-700',
  hidden: 'bg-gray-100 text-gray-500',
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/articles' + (filter ? `?status=${filter}` : ''))
    setArticles(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function deleteArticle(id: string, title: string) {
    if (!confirm(`למחוק את המאמר "${title}"?`)) return
    setDeleting(id)
    await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' })
    await load()
    setDeleting(null)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 mb-1 inline-block">← פאנל ניהול</Link>
          <h1 className="font-display text-2xl font-bold text-green-dark">📋 ניהול מאמרים</h1>
        </div>
        <Link href="/admin/articles/new"
          className="flex items-center gap-2 bg-green-dark text-white font-bold px-4 py-2 rounded-xl hover:bg-green-800 transition-colors">
          <Plus size={18} /> מאמר חדש
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'published', 'draft', 'hidden'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === s ? 'bg-green-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s === '' ? 'הכל' : statusLabel[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">טוען...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">📭</div>
          <p>אין מאמרים עדיין</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right text-xs font-bold text-gray-500 px-6 py-3">כותרת</th>
                <th className="text-right text-xs font-bold text-gray-500 px-4 py-3 hidden md:table-cell">קטגוריה</th>
                <th className="text-right text-xs font-bold text-gray-500 px-4 py-3">סטטוס</th>
                <th className="text-right text-xs font-bold text-gray-500 px-4 py-3 hidden md:table-cell">עודכן</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-sm leading-snug">{article.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{article.readTime} דקות קריאה</div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-gray-500">{article.category?.name || '—'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColor[article.status]}`}>
                      {statusLabel[article.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-xs text-gray-400">{formatDate(article.updatedAt)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/articles/${article.id}`}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-dark hover:bg-green-light transition-colors">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => deleteArticle(article.id, article.title)}
                        disabled={deleting === article.id}
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
