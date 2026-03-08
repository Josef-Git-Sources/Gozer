import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) return {}
  return {
    title: article.metaTitle || article.title,
    description: article.metaDesc || article.excerpt || '',
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, status: 'published' },
    include: { category: true },
  })
  if (!article) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="ניווט מיקום" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-green-dark transition-colors">בית</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/zchuyot" className="hover:text-green-dark transition-colors">זכויות וחובות</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-gray-900 font-medium truncate">{article.title}</li>
        </ol>
      </nav>

      <article>
        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4">
          {article.category && (
            <Link href={`/zchuyot?cat=${article.category.slug}`}
              className="bg-green-light text-green-dark text-sm font-bold px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
              {article.category.name}
            </Link>
          )}
          {article.tags.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">{tag}</span>
          ))}
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-green-dark mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
          <span>עודכן: {formatDate(article.updatedAt)}</span>
          <span>•</span>
          <span>{article.readTime} דקות קריאה</span>
        </div>

        {/* Content */}
        <div className="prose-he"
          dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>

      {/* Share */}
      <div className="mt-10 pt-8 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-3 font-medium">שתף את המאמר:</p>
        <div className="flex gap-3">
          <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' — ' + typeof window !== 'undefined' ? window.location.href : '')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
            <span aria-hidden="true">📲</span> WhatsApp
          </a>
        </div>
      </div>

      <Link href="/zchuyot"
        className="inline-flex items-center gap-2 mt-8 text-blue-mid hover:text-blue-700 text-sm font-medium transition-colors">
        <ArrowRight size={16} aria-hidden="true" />
        חזור לכל המאמרים
      </Link>
    </div>
  )
}
