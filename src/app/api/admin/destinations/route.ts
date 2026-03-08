import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const destinations = await prisma.tripDestination.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(destinations)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, nameEn, region, flag, avgFlightIls, avgAccommodationIls, avgFoodDaily, avgTransportDaily, avgActivitiesDaily, tips } = body

  if (!name || !region) return NextResponse.json({ error: 'שם ואזור הם שדות חובה' }, { status: 400 })

  const dest = await prisma.tripDestination.create({
    data: {
      name, nameEn: nameEn || null, region, flag: flag || '',
      avgFlightIls: Number(avgFlightIls) || 0,
      avgAccommodationIls: Number(avgAccommodationIls) || 0,
      avgFoodDaily: Number(avgFoodDaily) || 0,
      avgTransportDaily: Number(avgTransportDaily) || 0,
      avgActivitiesDaily: Number(avgActivitiesDaily) || 0,
      tips: tips || null,
    },
  })
  return NextResponse.json(dest, { status: 201 })
}
