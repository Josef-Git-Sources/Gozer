import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { User, Settings, MapPin, CheckSquare, Compass } from 'lucide-react'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/profile')

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: {
      trips: { include: { destination: true }, orderBy: { createdAt: 'desc' }, take: 3 },
      quizResults: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })
  if (!user) redirect('/login')

  const completedItems = await prisma.userChecklistItem.count({
    where: { userId: user.id, completed: true },
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-green-dark mb-8">הפרופיל שלי</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-green-light flex items-center justify-center text-3xl mx-auto mb-4" aria-hidden="true">
              {user.image ? (
                <img src={user.image} alt={user.name || ''} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={32} className="text-green-mid" />
              )}
            </div>
            <h2 className="font-bold text-xl text-gray-900 mb-1">{user.name}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-xs text-gray-300 mt-2">חבר מ-{formatDate(user.createdAt)}</p>

            <div className="mt-6 flex flex-col gap-2">
              <Link href="/profile/settings"
                className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Settings size={16} aria-hidden="true" />הגדרות
              </Link>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="md:col-span-2 space-y-4">
          {/* Checklist summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckSquare size={20} className="text-green-mid" aria-hidden="true" />
              <h3 className="font-bold text-gray-900">הצ'קליסט שלי</h3>
            </div>
            <p className="text-gray-500 text-sm mb-3">
              השלמת <strong className="text-green-dark">{completedItems}</strong> משימות
            </p>
            <Link href="/checklist" className="text-blue-mid text-sm font-medium hover:underline">
              המשך בצ'קליסט →
            </Link>
          </div>

          {/* Trips */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-gold" aria-hidden="true" />
                <h3 className="font-bold text-gray-900">הטיולים שלי</h3>
              </div>
              <Link href="/tiyul" className="text-blue-mid text-xs hover:underline">תכנן טיול +</Link>
            </div>
            {user.trips.length === 0 ? (
              <p className="text-gray-400 text-sm">עדיין לא תכננת טיולים</p>
            ) : (
              <div className="space-y-2">
                {user.trips.map(trip => (
                  <div key={trip.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium text-gray-700">
                      {trip.destination.flag} {trip.destination.name} — {trip.durationDays} ימים
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(trip.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Compass size={20} className="text-blue-mid" aria-hidden="true" />
                <h3 className="font-bold text-gray-900">הכוונה מקצועית</h3>
              </div>
              <Link href="/kariera" className="text-blue-mid text-xs hover:underline">מלא שאלון</Link>
            </div>
            {user.quizResults.length === 0 ? (
              <p className="text-gray-400 text-sm">עדיין לא מילאת את השאלון המקצועי</p>
            ) : (
              <p className="text-sm text-gray-600">
                מילאת שאלון לאחרונה ב-{formatDate(user.quizResults[0].createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
