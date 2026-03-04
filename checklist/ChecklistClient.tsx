'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { CheckCircle, Circle, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistItem { id: string; title: string; description?: string | null }
interface Group { period: string; label: string; items: ChecklistItem[] }

export function ChecklistClient({ groups }: { groups: Group[] }) {
  const { data: session } = useSession()
  const totalItems = groups.flatMap(g => g.items).length
  const [checked, setChecked] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const progress = totalItems > 0 ? Math.round((checked.size / totalItems) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-green-dark mb-3">
          ✅ צ'קליסט שחרור
        </h1>
        <p className="text-gray-500 text-lg">כל מה שצריך לעשות — לפני ואחרי השחרור</p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-700">ההתקדמות שלך</span>
          <span className="font-bold text-green-dark text-xl">{checked.size}/{totalItems}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3" role="progressbar"
          aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
          aria-label={`${progress}% הושלם`}>
          <div className="bg-green-mid h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-gray-400 mt-2">{progress}% הושלם</p>
      </div>

      {/* Groups */}
      <div className="space-y-8">
        {groups.map(group => {
          const groupChecked = group.items.filter(i => checked.has(i.id)).length
          return (
            <section key={group.period} aria-labelledby={`period-${group.period}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 id={`period-${group.period}`} className="font-display text-xl font-bold text-green-dark">
                  {group.label}
                </h2>
                <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {groupChecked}/{group.items.length}
                </span>
              </div>
              <div className="space-y-3">
                {group.items.map(item => {
                  const done = checked.has(item.id)
                  return (
                    <button key={item.id} onClick={() => toggle(item.id)}
                      className={cn(
                        'w-full text-right flex items-start gap-4 p-4 rounded-xl border-2 transition-all',
                        done
                          ? 'bg-green-light border-green-mid/30 opacity-70'
                          : 'bg-white border-gray-100 hover:border-green-mid/40 hover:bg-gray-50'
                      )}
                      aria-pressed={done}
                      aria-label={`${done ? 'בטל סימון' : 'סמן כהושלם'}: ${item.title}`}>
                      <div className="mt-0.5 shrink-0">
                        {done
                          ? <CheckCircle size={22} className="text-green-mid" aria-hidden="true" />
                          : <Circle size={22} className="text-gray-300" aria-hidden="true" />}
                      </div>
                      <div>
                        <p className={cn('font-medium text-gray-900', done && 'line-through text-gray-400')}>
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* CTA if not logged in */}
      {!session && (
        <div className="mt-12 bg-green-light border-2 border-green-mid/30 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3" aria-hidden="true">💾</div>
          <h3 className="font-bold text-green-dark text-lg mb-2">שמור את ההתקדמות שלך</h3>
          <p className="text-gray-600 text-sm mb-5">הרשם בחינם כדי שההתקדמות תישמר גם כשתחזור</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register"
              className="bg-green-dark text-white font-bold px-6 py-3 rounded-xl hover:bg-green-800 transition-colors">
              הרשמה חינם
            </Link>
            <Link href="/login"
              className="flex items-center justify-center gap-2 border-2 border-green-dark text-green-dark font-bold px-6 py-3 rounded-xl hover:bg-green-dark hover:text-white transition-colors">
              <LogIn size={16} aria-hidden="true" />כניסה
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
