import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const trips = await prisma.userTrip.findMany({
    where: { userId },
    include: { destination: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(trips)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const { destinationId, durationDays, budgetTotal, notes } = await req.json()
  if (!destinationId || !durationDays) {
    return NextResponse.json({ error: 'destinationId ו-durationDays נדרשים' }, { status: 400 })
  }

  const trip = await prisma.userTrip.create({
    data: {
      userId,
      destinationId,
      durationDays: Number(durationDays),
      budgetTotal: Number(budgetTotal) || 0,
      notes: notes || null,
    },
    include: { destination: true },
  })
  return NextResponse.json(trip, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const { searchParams } = new URL(req.url)
  const tripId = searchParams.get('id')
  if (!tripId) return NextResponse.json({ error: 'id נדרש' }, { status: 400 })

  // וודא שהטיול שייך למשתמש
  const trip = await prisma.userTrip.findFirst({ where: { id: tripId, userId } })
  if (!trip) return NextResponse.json({ error: 'לא נמצא' }, { status: 404 })

  await prisma.userTrip.delete({ where: { id: tripId } })
  return NextResponse.json({ ok: true })
}
