import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  const [users, articles, trips, quizResults] = await Promise.all([
    prisma.user.count(),
    prisma.article.count({ where: { status: 'published' } }),
    prisma.userTrip.count(),
    prisma.userQuizResult.count(),
  ])
  return { users, articles, trips, quizResults }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')

  const stats = await getStats()

  const cards = [
    { label: 'משתמשים רשומים', value: stats.users, emoji: '👥', href: '/admin/users' },
    { label: 'מאמרים פורסמו', value: stats.articles, emoji: '📋', href: '/admin/articles' },
    { label: 'טיולים תוכננו', value: stats.trips, emoji: '✈️', href: '/admin/trips' },
    { label: 'שאלונים מולאו', value: stats.quizResults, emoji: '🎯', href: '/admin/quiz' },
  ]

  const quickLinks = [
    { href: '/admin/articles/new', label: '➕ מאמר חדש', color: 'bg-green-light border-green-mid/30 text-green-dark' },
    { href: '/admin/checklist', label: '✅ ניהול צ\'קליסט', color: 'bg-blue-light border-blue-mid/20 text-blue-mid' },
    { href: '/admin/destinations', label: '🌍 יעדי טיול', color: 'bg-gold-light border-gold/20 text-amber-700' },
    { href: '/admin/courses', label: '📚 ניהול קורסים', color: 'bg-gray-50 border-gray-200 text-gray-700' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-green-dark">🛠️ פאנל ניהול</h1>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← חזור לאתר</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map(card => (
          <Link key={card.href} href={card.href}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-green-mid/30 transition-all card-hover text-center">
            <div className="text-3xl mb-2" aria-hidden="true">{card.emoji}</div>
            <div className="font-display text-3xl font-bold text-green-dark">{card.value}</div>
            <div className="text-gray-400 text-sm mt-1">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="font-bold text-lg text-gray-700 mb-4">פעולות מהירות</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {quickLinks.map(link => (
          <Link key={link.href} href={link.href}
            className={`border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:opacity-80 ${link.color}`}>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Coming soon modules */}
      <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400">
        <div className="text-4xl mb-3" aria-hidden="true">🚧</div>
        <p className="font-medium">עורך מאמרים, ניהול משתמשים וסטטיסטיקות מפורטות — בפיתוח בשלב ב'</p>
      </div>
    </div>
  )
}
