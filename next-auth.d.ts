import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, nameEn, region, flag, avgFlightIls, avgAccommodationIls, avgFoodDaily, avgTransportDaily, avgActivitiesDaily, tips, isActive } = body

  const dest = await prisma.tripDestination.update({
    where: { id: params.id },
    data: {
      name, nameEn: nameEn || null, region, flag: flag || '',
      avgFlightIls: Number(avgFlightIls) || 0,
      avgAccommodationIls: Number(avgAccommodationIls) || 0,
      avgFoodDaily: Number(avgFoodDaily) || 0,
      avgTransportDaily: Number(avgTransportDaily) || 0,
      avgActivitiesDaily: Number(avgActivitiesDaily) || 0,
      tips: tips || null,
      isActive: isActive ?? true,
    },
  })
  return NextResponse.json(dest)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.tripDestination.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
