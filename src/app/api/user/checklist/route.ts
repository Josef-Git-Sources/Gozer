import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const items = await prisma.userChecklistItem.findMany({
    where: { userId, completed: true },
    select: { itemId: true },
  })
  return NextResponse.json(items.map(i => i.itemId))
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const { itemId, completed } = await req.json()
  if (!itemId) return NextResponse.json({ error: 'itemId נדרש' }, { status: 400 })

  const result = await prisma.userChecklistItem.upsert({
    where: { userId_itemId: { userId, itemId } },
    update: { completed, completedAt: completed ? new Date() : null },
    create: { userId, itemId, completed, completedAt: completed ? new Date() : null },
  })
  return NextResponse.json(result)
}
