import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'זכויות וחובות',
  description: 'מרכז המידע לזכויות וחובות חיילים משוחררים — מענק שחרור, ביטוח בריאות, מילואים ועוד',
}

const periodLabels: Record<string, string> = {
  before: 'לפני שחרור',
  after: 'אחרי שחרור',
  reserves: 'מילואים',
  all: 'כללי',
}

const periodColors: Record<string, string> = {
  before: 'bg-blue-light text-blue-mid border border-blue-mid/20',
  after: 'bg-green-light text-green-dark border border-green-mid/20',
  reserves: 'bg-gold-light text-amber-700 border border-gold/20',
  all: 'bg-gray-100 text-gray-600 border border-gray-200',
}

async function getData(cat?: string) {
  const [articles, categories] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'published', ...(cat ? { category: { slug: cat } } : {}) },
      orderBy: { updatedAt: 'desc' },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
  ])
  return { articles, categories }
}

export default async function ZchuyotPage({ searchParams }: { searchParams: { cat?: string } }) {
  const { articles, categories } = await getData(searchParams.cat)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-green-dark mb-3">
          📋 זכויות וחובות
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          כל המידע שצריך לדעת — מענק שחרור, ביטוח בריאות, לימודים, תעסוקה ומילואים.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8" role="navigation" aria-label="סינון קטגוריות">
        <Link href="/zchuyot"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!searchParams.cat ? 'bg-green-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          aria-current={!searchParams.cat ? 'page' : undefined}>
          הכל
        </Link>
        {categories.map(cat => (
          <Link key={cat.id} href={`/zchuyot?cat=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${searchParams.cat === cat.slug ? 'bg-green-dark text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            aria-current={searchParams.cat === cat.slug ? 'page' : undefined}>
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Articles grid */}
      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4" aria-hidden="true">📭</div>
          <p className="text-lg">אין מאמרים בקטגוריה זו עדיין</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <Link key={article.id} href={`/zchuyot/${article.slug}`}
              className="card-hover group bg-white rounded-2xl border border-gray-100 p-6 hover:border-green-mid/30 transition-all flex flex-col">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {article.category && (
                  <span className="bg-green-light text-green-dark text-xs font-bold px-3 py-1 rounded-full">
                    {article.category.name}
                  </span>
                )}
                {article.period && (
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${periodColors[article.period] || periodColors.all}`}>
                    {periodLabels[article.period] || article.period}
                  </span>
                )}
              </div>
              <h2 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-green-dark transition-colors leading-snug flex-1">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{article.excerpt}</p>
              )}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">{formatDate(article.updatedAt)}</span>
                <span className="text-xs text-gray-400">{article.readTime} דקות קריאה</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
