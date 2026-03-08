'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { CheckCircle, Loader2 } from 'lucide-react'

interface Destination {
  id: string; name: string; nameEn?: string | null; region: string; flag?: string | null
  avgFlightIls: number; avgAccommodationIls: number; avgFoodDaily: number
  avgTransportDaily: number; avgActivitiesDaily: number; tips?: string | null
}

const durationOptions = [
  { value: 14, label: '2 שבועות' },
  { value: 21, label: '3 שבועות' },
  { value: 30, label: 'חודש' },
  { value: 60, label: 'חודשיים' },
  { value: 90, label: '3 חודשים' },
  { value: 120, label: '4 חודשים' },
  { value: 180, label: '6 חודשים' },
]

const accommodationTypes: Record<string, { label: string; multiplier: number }> = {
  hostel: { label: '🏨 הוסטל', multiplier: 0.6 },
  airbnb: { label: '🏠 Airbnb', multiplier: 1.0 },
  hotel: { label: '🏩 מלון', multiplier: 1.8 },
}

export function TripPlannerClient({ destinations }: { destinations: Destination[] }) {
  const { data: session } = useSession()
  const [step, setStep] = useState(1)
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null)
  const [duration, setDuration] = useState(30)
  const [accomType, setAccomType] = useState('hostel')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')

  const regions = [...new Set(destinations.map(d => d.region))]

  function calcBudget() {
    if (!selectedDest) return null
    const mult = accommodationTypes[accomType].multiplier
    const dailyCost = (selectedDest.avgAccommodationIls * mult) + selectedDest.avgFoodDaily + selectedDest.avgTransportDaily + selectedDest.avgActivitiesDaily
    const insurance = Math.round(duration * 15)
    const total = selectedDest.avgFlightIls + (dailyCost * duration) + insurance
    return {
      flight: selectedDest.avgFlightIls,
      accommodation: Math.round(selectedDest.avgAccommodationIls * mult * duration),
      food: selectedDest.avgFoodDaily * duration,
      transport: selectedDest.avgTransportDaily * duration,
      activities: selectedDest.avgActivitiesDaily * duration,
      insurance,
      total,
    }
  }

  const budget = step === 3 ? calcBudget() : null

  async function saveTrip() {
    if (!selectedDest || !budget) return
    setSaving(true); setSaveError('')
    try {
      const res = await fetch('/api/user/trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationId: selectedDest.id,
          durationDays: duration,
          budgetTotal: budget.total,
          notes: `סגנון לינה: ${accommodationTypes[accomType].label}`,
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-green-dark mb-3">✈️ מתכנן טיול</h1>
        <p className="text-gray-500 text-lg">תכנן את הטיול שאחרי הצבא — עלויות ריאליות</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2 mb-10" aria-label="שלבי התכנון">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step >= s ? 'bg-green-dark text-white' : 'bg-gray-100 text-gray-400'
            )} aria-current={step === s ? 'step' : undefined}>
              {s}
            </div>
            {s < 3 && <div className={cn('w-12 h-0.5', step > s ? 'bg-green-dark' : 'bg-gray-200')} />}
          </div>
        ))}
      </div>

      {/* Step 1: Choose destination */}
      {step === 1 && (
        <div className="animate-slide-up">
          <h2 className="font-bold text-xl text-gray-800 mb-6 text-center">לאן תרצה לטוס?</h2>
          {regions.map(region => (
            <div key={region} className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{region}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {destinations.filter(d => d.region === region).map(dest => (
                  <button key={dest.id}
                    onClick={() => { setSelectedDest(dest); setStep(2); setSaved(false) }}
                    className={cn(
                      'p-4 rounded-2xl border-2 text-right transition-all hover:border-green-mid hover:bg-green-light card-hover',
                      selectedDest?.id === dest.id ? 'border-green-dark bg-green-light' : 'border-gray-100 bg-white'
                    )}>
                    <div className="text-3xl mb-2" aria-hidden="true">{dest.flag}</div>
                    <div className="font-bold text-gray-900">{dest.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      טיסה: ~{formatCurrency(dest.avgFlightIls)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 2: Duration + accommodation */}
      {step === 2 && selectedDest && (
        <div className="animate-slide-up bg-white rounded-2xl border border-gray-100 p-8">
          <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1">
            ← שנה יעד
          </button>
          <h2 className="font-bold text-xl text-gray-800 mb-6">
            {selectedDest.flag} {selectedDest.name} — כמה זמן?
          </h2>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">משך הטיול</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {durationOptions.map(opt => (
                <button key={opt.value} onClick={() => setDuration(opt.value)}
                  className={cn(
                    'py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all',
                    duration === opt.value ? 'border-green-dark bg-green-light text-green-dark' : 'border-gray-100 hover:border-green-mid/40'
                  )}
                  aria-pressed={duration === opt.value}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">סגנון לינה</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(accommodationTypes).map(([key, val]) => (
                <button key={key} onClick={() => setAccomType(key)}
                  className={cn(
                    'py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all',
                    accomType === key ? 'border-green-dark bg-green-light text-green-dark' : 'border-gray-100 hover:border-green-mid/40'
                  )}
                  aria-pressed={accomType === key}>
                  {val.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => setStep(3)}
            className="w-full bg-green-dark text-white font-bold py-4 rounded-xl hover:bg-green-800 transition-colors text-lg">
            חשב תקציב ✈️
          </button>
        </div>
      )}

      {/* Step 3: Budget */}
      {step === 3 && selectedDest && budget && (
        <div className="animate-slide-up">
          <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1">
            ← חזור
          </button>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
            <h2 className="font-bold text-xl text-gray-800 mb-2">
              {selectedDest.flag} {selectedDest.name} — {durationOptions.find(d => d.value === duration)?.label}
            </h2>
            <p className="text-gray-400 text-sm mb-6">סגנון לינה: {accommodationTypes[accomType].label}</p>

            <div className="space-y-3 mb-6">
              {[
                { label: '✈️ טיסות הלוך ושוב', amount: budget.flight },
                { label: '🏨 לינה', amount: budget.accommodation },
                { label: '🍜 אוכל', amount: budget.food },
                { label: '🚌 תחבורה', amount: budget.transport },
                { label: '🎯 אטרקציות', amount: budget.activities },
                { label: '🏥 ביטוח נסיעות', amount: budget.insurance },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-600 text-sm">{item.label}</span>
                  <span className="font-medium text-gray-900 text-sm ltr">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>

            <div className="bg-green-light rounded-xl p-4 flex items-center justify-between">
              <span className="font-display font-bold text-green-dark text-lg">סה"כ משוער</span>
              <span className="font-display font-bold text-green-dark text-2xl ltr">{formatCurrency(budget.total)}</span>
            </div>

            {selectedDest.tips && (
              <div className="mt-4 bg-gold-light rounded-xl p-4 text-sm text-gray-700">
                <strong>💡 טיפ:</strong> {selectedDest.tips}
              </div>
            )}
          </div>

          {!session ? (
            <div className="bg-green-light border-2 border-green-mid/30 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3" aria-hidden="true">💾</div>
              <h3 className="font-bold text-green-dark text-lg mb-2">שמור את הטיול המתוכנן</h3>
              <p className="text-gray-600 text-sm mb-5">הרשם בחינם כדי לשמור ולהשוות בין יעדים שונים</p>
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
                onClick={saveTrip}
                disabled={saving || saved}
                className={cn(
                  'w-full py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-60',
                  saved
                    ? 'bg-green-light text-green-dark border-2 border-green-mid/30'
                    : 'bg-green-dark text-white hover:bg-green-800'
                )}>
                {saving && <Loader2 size={18} className="animate-spin" />}
                {saved && <CheckCircle size={18} />}
                {saving ? 'שומר...' : saved ? '✅ הטיול נשמר לפרופיל שלך!' : 'שמור לפרופיל'}
              </button>
              {saved && (
                <Link href="/profile" className="block text-center mt-2 text-sm text-blue-mid hover:underline">
                  צפה בפרופיל שלי ←
                </Link>
              )}
            </div>
          )}

          <button onClick={() => { setStep(1); setSelectedDest(null); setSaved(false) }}
            className="w-full mt-3 py-3 text-gray-400 hover:text-gray-600 text-sm transition-colors">
            תכנן יעד אחר
          </button>
        </div>
      )}
    </div>
  )
}
