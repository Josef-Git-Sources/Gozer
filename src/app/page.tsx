import Link from 'next/link'
import { ArrowLeft, CheckCircle, MapPin, Compass, BookOpen } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

async function getRecentArticles() {
  return prisma.article.findMany({
    where: { status: 'published' },
    orderBy: { updatedAt: 'desc' },
    take: 3,
    include: { category: true },
  })
}

const modules = [
  {
    href: '/zchuyot',
    icon: '📋',
    title: 'זכויות וחובות',
    desc: 'מענק שחרור, קרן השתלמות, ביטוח בריאות, מילואים ועוד.',
    color: 'from-blue-mid to-blue-600',
    bg: 'bg-blue-light',
    border: 'border-blue-mid/20',
  },
  {
    href: '/checklist',
    icon: '✅',
    title: 'צ\'קליסט שחרור',
    desc: 'רשימת משימות מדויקת — מה לעשות לפני ואחרי השחרור.',
    color: 'from-green-mid to-green-600',
    bg: 'bg-green-light',
    border: 'border-green-mid/20',
  },
  {
    href: '/tiyul',
    icon: '✈️',
    title: 'מתכנן טיול',
    desc: 'תכנן את הטיול שאחרי הצבא עם מחשבון עלויות מפורט.',
    color: 'from-amber-500 to-gold',
    bg: 'bg-gold-light',
    border: 'border-gold/20',
  },
  {
    href: '/kariera',
    icon: '🎯',
    title: 'הכוונה מקצועית',
    desc: 'שאלון נטיות + המלצות קורסים, מלגות ומסלולים מותאמים.',
    color: 'from-green-dark to-green-mid',
    bg: 'bg-green-light',
    border: 'border-green-dark/20',
  },
]

const stats = [
  { value: '11,000+', label: 'חיילים משתחררים בשנה' },
  { value: '47', label: 'ימי זכאות לדמי אבטלה' },
  { value: '3', label: 'שנות זכאות למלגות' },
]

export default async function HomePage() {
  const articles = await getRecentArticles()

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <section className="bg-hero text-white relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 text-8xl">🪖</div>
          <div className="absolute bottom-10 left-20 text-6xl">✈️</div>
          <div className="absolute top-1/2 left-1/3 text-5xl">📋</div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <span aria-hidden="true">🇮🇱</span>
            <span>המרכז הדיגיטלי לחייל המשוחרר</span>
          </div>
          <h1 id="hero-heading" className="font-display text-5xl md:text-7xl font-bold mb-4 leading-tight">
            גוזר
          </h1>
          <p className="text-xl md:text-2xl text-white/85 mb-8 max-w-2xl mx-auto">
            כל מה שצריך לדעת אחרי הצבא — זכויות, תכנון טיול, והכוונה לעתיד
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/zchuyot"
              className="bg-white text-green-dark font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg flex items-center justify-center gap-2">
              <BookOpen size={20} aria-hidden="true" />
              התחל לגלות זכויות
            </Link>
            <Link href="/checklist"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors text-lg flex items-center justify-center gap-2">
              <CheckCircle size={20} aria-hidden="true" />
              צ'קליסט שחרור
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100" aria-label="נתונים">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map(stat => (
              <div key={stat.value}>
                <div className="font-display text-3xl md:text-4xl font-bold text-green-dark">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" aria-labelledby="modules-heading">
        <div className="text-center mb-10">
          <h2 id="modules-heading" className="font-display text-3xl md:text-4xl font-bold text-green-dark mb-3">
            מה תמצא בגוזר?
          </h2>
          <p className="text-gray-500 text-lg">ארבעה כלים שיעזרו לך בכל שלב</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map(mod => (
            <Link key={mod.href} href={mod.href}
              className={`card-hover group relative p-6 rounded-2xl border-2 ${mod.bg} ${mod.border} flex items-start gap-5 hover:shadow-lg transition-all`}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-2xl shrink-0 shadow-md`}
                aria-hidden="true">
                {mod.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-green-dark transition-colors">
                  {mod.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{mod.desc}</p>
              </div>
              <ArrowLeft size={20} className="text-gray-400 group-hover:text-green-dark transition-colors mt-1 shrink-0 rotate-180" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent articles */}
      {articles.length > 0 && (
        <section className="bg-white py-16" aria-labelledby="articles-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 id="articles-heading" className="font-display text-2xl md:text-3xl font-bold text-green-dark">
                מידע עדכני
              </h2>
              <Link href="/zchuyot" className="text-blue-mid hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                כל המאמרים
                <ArrowLeft size={16} className="rotate-180" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map(article => (
                <Link key={article.id} href={`/zchuyot/${article.slug}`}
                  className="card-hover group bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-green-mid/30 transition-all">
                  {article.category && (
                    <span className="inline-block bg-green-light text-green-dark text-xs font-bold px-3 py-1 rounded-full mb-3">
                      {article.category.name}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-dark transition-colors leading-snug">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                  )}
                  <div className="mt-4 text-xs text-gray-400">
                    עודכן: {formatDate(article.updatedAt)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA register */}
      <section className="bg-green-light py-16" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 id="cta-heading" className="font-display text-2xl md:text-3xl font-bold text-green-dark mb-3">
            שמור את המידע שלך
          </h2>
          <p className="text-gray-600 mb-8">
            הרשם בחינם כדי לשמור את הצ'קליסט האישי שלך, תכנון הטיול, ותוצאות השאלון המקצועי.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"
              className="bg-green-dark text-white font-bold px-8 py-4 rounded-xl hover:bg-green-800 transition-colors">
              הרשמה חינם
            </Link>
            <Link href="/login"
              className="border-2 border-green-dark text-green-dark font-bold px-8 py-4 rounded-xl hover:bg-green-dark hover:text-white transition-colors">
              כניסה
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
