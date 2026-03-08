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

  const items = await prisma.checklistItem.findMany({
    orderBy: [{ period: 'asc' }, { order: 'asc' }],
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, period, order } = body

  if (!title || !period) return NextResponse.json({ error: 'כותרת ותקופה הם שדות חובה' }, { status: 400 })

  const item = await prisma.checklistItem.create({
    data: { title, description: description || null, period, order: order || 0 },
  })
  return NextResponse.json(item, { status: 201 })
}
