import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { TripPlannerClient } from './TripPlannerClient'

export const metadata: Metadata = {
  title: 'מתכנן טיול',
  description: 'תכנן את הטיול שאחרי הצבא — מחשבון עלויות מפורט לכל יעד',
}

export default async function TiyulPage() {
  const destinations = await prisma.tripDestination.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
  return <TripPlannerClient destinations={destinations} />
}
