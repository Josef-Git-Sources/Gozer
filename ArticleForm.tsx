import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

async function getStats() {
  const [users, articles, drafts, trips, quizResults, checklist, destinations, courses] = await Promise.all([
    prisma.user.count(),
    prisma.article.count({ where: { status: 'published' } }),
    prisma.article.count({ where: { status: 'draft' } }),
    prisma.userTrip.count(),
    prisma.userQuizResult.count(),
    prisma.checklistItem.count({ where: { isActive: true } }),
    prisma.tripDestination.count({ where: { isActive: true } }),
    prisma.course.count({ where: { isActive: true } }),
  ])
  return { users, articles, drafts, trips, quizResults, checklist, destinations, courses }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')
  const stats = await getStats()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-green-dark">🛠️ פאנל ניהול</h1>
          <p className="text-gray-400 text-sm mt-1">שלום, {session.user?.name?.split(' ')[0]}</p>
        </div>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← חזור לאתר</Link>
      </div>

      <h2 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3">סטטיסטיקות</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'משתמשים', value: stats.users, emoji: '👥', href: '/admin/users', sub: 'רשומים' },
          { label: 'מאמרים', value: stats.articles, emoji: '📋', href: '/admin/articles', sub: stats.drafts + ' טיוטות' },
          { label: 'טיולים', value: stats.trips, emoji: '✈️', href: '/admin/destinations', sub: 'תוכננו' },
          { label: 'שאלונים', value: stats.quizResults, emoji: '🎯', href: '/admin/courses', sub: 'מולאו' },
        ].map(card => (
          <Link key={card.href} href={card.href}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-green-mid/30 hover:shadow-md transition-all text-center">
            <div className="text-3xl mb-2">{card.emoji}</div>
            <div className="font-display text-3xl font-bold text-green-dark">{card.value}</div>
            <div className="text-gray-500 text-sm font-medium mt-1">{card.label}</div>
            <div className="text-gray-400 text-xs mt-0.5">{card.sub}</div>
          </Link>
        ))}
      </div>

      <h2 className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-3">ניהול תוכן</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { emoji: '📋', title: 'מאמרים וזכויות', sub: stats.articles + ' פורסמו · ' + stats.drafts + ' טיוטות', href: '/admin/articles', newHref: '/admin/articles/new' },
          { emoji: '👥', title: 'משתמשים', sub: stats.users + ' רשומים במערכת', href: '/admin/users', newHref: null },
          { emoji: '✅', title: "צ'קליסט שחרור", sub: stats.checklist + ' פריטים פעילים', href: '/admin/checklist', newHref: null },
          { emoji: '🌍', title: 'יעדי טיול', sub: stats.destinations + ' יעדים פעילים', href: '/admin/destinations', newHref: null },
          { emoji: '📚', title: 'קורסים והכוונה', sub: stats.courses + ' קורסים פעילים', href: '/admin/courses', newHref: null },
        ].map(card => (
          <div key={card.href} className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{card.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{card.title}</h3>
                  <p className="text-xs text-gray-400">{card.sub}</p>
                </div>
              </div>
              {card.newHref && (
                <Link href={card.newHref}
                  className="bg-green-dark text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-green-800 transition-colors">
                  + חדש
                </Link>
              )}
            </div>
            <Link href={card.href}
              className="block w-full text-center bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium py-2 rounded-xl transition-colors">
              כניסה לניהול ←
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
