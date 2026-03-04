import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ChecklistClient } from './ChecklistClient'

export const metadata: Metadata = {
  title: "צ'קליסט שחרור",
  description: "רשימת משימות מפורטת לפני ואחרי השחרור מהצבא — ממולא מראש, ניתן לשמירה",
}

const periodOrder = ['3months', '1month', '1week', 'release_day', '1week_after']
const periodLabels: Record<string, string> = {
  '3months': '3 חודשים לפני שחרור',
  '1month': 'חודש לפני שחרור',
  '1week': 'שבוע לפני שחרור',
  'release_day': 'יום השחרור',
  '1week_after': 'שבוע אחרי השחרור',
}

export default async function ChecklistPage() {
  const items = await prisma.checklistItem.findMany({
    where: { isActive: true },
    orderBy: [{ period: 'asc' }, { order: 'asc' }],
  })

  const grouped = periodOrder.map(period => ({
    period,
    label: periodLabels[period],
    items: items.filter(i => i.period === period),
  })).filter(g => g.items.length > 0)

  return <ChecklistClient groups={grouped} />
}
