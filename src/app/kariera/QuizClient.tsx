'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CheckCircle, Loader2 } from 'lucide-react'

interface Question { id: string; questionText: string; options: any; domainWeights: any }
interface Course { id: string; name: string; provider: string; url: string; domain: string; durationWeeks?: number | null; priceRange?: string | null; description?: string | null }

const domainLabels: Record<string, { label: string; emoji: string; desc: string }> = {
  tech: { label: 'טכנולוגיה', emoji: '💻', desc: 'פיתוח תוכנה, סייבר, Data Science' },
  people: { label: 'עבודה עם אנשים', emoji: '🤝', desc: 'ניהול, חינוך, HR, רפואה' },
  design: { label: 'עיצוב ויצירה', emoji: '🎨', desc: 'UX/UI, גרפיקה, שיווק דיגיטלי' },
  business: { label: 'עסקים ויזמות', emoji: '📈', desc: 'MBA, ניהול, פיננסים, יזמות' },
}

export function QuizClient({ questions, courses }: { questions: Question[]; courses: Course[] }) {
  const { data: session } = useSession()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  function answer(questionId: string, optionIndex: number) {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
    setTimeout(() => {
      if (current < questions.length - 1) setCurrent(c => c + 1)
      else setDone(true)
    }, 300)
  }

  function calcResults() {
    const scores: Record<string, number> = {}
    questions.forEach(q => {
      const idx = answers[q.id]
      if (idx === undefined) return
      const weights = q.domainWeights as Record<string, number[]>
      Object.entries(weights).forEach(([domain, vals]) => {
        scores[domain] = (scores[domain] || 0) + (vals[idx] || 0)
      })
    })
    return Object.entries(scores).sort((a, b) => b[1] - a[1])
  }

  const results = done ? calcResults() : []
  const topDomains = results.slice(0, 2).map(([d]) => d)
  const recommendedCourses = courses.filter(c => topDomains.includes(c.domain))

  async function saveResults() {
    if (!done) return
    setSaving(true); setSaveError('')
    try {
      const domainScores = Object.fromEntries(results)
      const res = await fetch('/api/user/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainScores,
          recommendedCourses: recommendedCourses.map(c => c.id),
        }),
      })
      if (res.ok) {
        setSaved(true)
      } else {
        const data = await res.json()
        setSaveError(data.error || 'שגיאה בשמירה')
      }
    } catch {
      setSaveError('שגיאת רשת')
    }
    setSaving(false)
  }

  const progress = Math.round((Object.keys(answers).length / questions.length) * 100)
  const currentQ = questions[current]

  if (!done) return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold text-green-dark mb-3">🎯 הכוונה מקצועית</h1>
        <p className="text-gray-500">ענה על {questions.length} שאלות קצרות לקבלת המלצות אישיות</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>שאלה {current + 1} מתוך {questions.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2" role="progressbar"
          aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={questions.length}>
          <div className="bg-green-mid h-2 rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {currentQ && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm animate-slide-up" key={currentQ.id}>
          <h2 className="font-bold text-xl text-gray-900 mb-6">{currentQ.questionText}</h2>
          <div className="space-y-3">
            {(currentQ.options as string[]).map((option, idx) => (
              <button key={idx} onClick={() => answer(currentQ.id, idx)}
                className={cn(
                  'w-full text-right p-4 rounded-xl border-2 transition-all font-medium hover:border-green-mid hover:bg-green-light',
                  answers[currentQ.id] === idx ? 'border-green-dark bg-green-light' : 'border-gray-100 bg-gray-50'
                )}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3" aria-hidden="true">🎉</div>
        <h1 className="font-display text-3xl font-bold text-green-dark mb-2">התוצאות שלך</h1>
        <p className="text-gray-500">בהתאם לתשובותיך, הנה המסלולים המתאימים לך</p>
      </div>

      {/* Domain scores */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {results.map(([domain, score], i) => {
          const info = domainLabels[domain]
          if (!info) return null
          return (
            <div key={domain} className={cn(
              'bg-white rounded-2xl border-2 p-5 transition-all',
              i === 0 ? 'border-green-dark shadow-md' : 'border-gray-100'
            )}>
              {i === 0 && <div className="text-xs font-bold text-green-dark mb-2">🏆 ההתאמה הטובה ביותר</div>}
              <div className="text-3xl mb-2" aria-hidden="true">{info.emoji}</div>
              <div className="font-bold text-gray-900">{info.label}</div>
              <div className="text-xs text-gray-500 mt-1">{info.desc}</div>
              <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-green-mid h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (score / 15) * 100)}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommended courses */}
      {recommendedCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-green-dark mb-5">קורסים מומלצים עבורך</h2>
          <div className="space-y-4">
            {recommendedCourses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-light flex items-center justify-center text-lg shrink-0" aria-hidden="true">
                  {domainLabels[course.domain]?.emoji || '📚'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{course.name}</h3>
                    {course.priceRange && (
                      <span className="text-xs bg-gold-light text-amber-700 px-2 py-1 rounded-full font-medium shrink-0">
                        {course.priceRange}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {course.provider}
                    {course.durationWeeks && ` · ${course.durationWeeks} שבועות`}
                  </p>
                  {course.description && (
                    <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                  )}
                  <a href={course.url} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 text-blue-mid text-sm font-medium hover:underline">
                    למידע נוסף →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save CTA */}
      {!session ? (
        <div className="bg-green-light border-2 border-green-mid/30 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-3" aria-hidden="true">💾</div>
          <h3 className="font-bold text-green-dark text-lg mb-2">שמור את התוצאות שלך</h3>
          <p className="text-gray-600 text-sm mb-5">הרשם בחינם כדי לשמור את המלצות הקורסים</p>
          <Link href="/register" className="bg-green-dark text-white font-bold px-6 py-3 rounded-xl hover:bg-green-800 transition-colors">
            הרשמה חינם
          </Link>
        </div>
      ) : (
        <div>
          {saveError && (
            <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm mb-3">{saveError}</div>
          )}
          <button
            onClick={saveResults}
            disabled={saving || saved}
            className={cn(
              'w-full py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60',
              saved
                ? 'bg-green-light text-green-dark border-2 border-green-mid/30'
                : 'bg-green-dark text-white hover:bg-green-800'
            )}>
            {saving && <Loader2 size={18} className="animate-spin" />}
            {saved && <CheckCircle size={18} />}
            {saving ? 'שומר...' : saved ? 'נשמר לפרופיל שלך!' : 'שמור תוצאות לפרופיל'}
          </button>
          {saved && (
            <Link href="/profile" className="block text-center mt-2 text-sm text-blue-mid hover:underline">
              צפה בפרופיל שלי ←
            </Link>
          )}
        </div>
      )}

      <button onClick={() => { setDone(false); setCurrent(0); setAnswers({}); setSaved(false) }}
        className="w-full mt-3 py-3 text-gray-400 hover:text-gray-600 text-sm transition-colors">
        מלא את השאלון מחדש
      </button>
    </div>
  )
}
