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
  const { name, provider, url, domain, durationWeeks, priceRange, description, isActive } = body

  const course = await prisma.course.update({
    where: { id: params.id },
    data: {
      name, provider, url, domain,
      durationWeeks: durationWeeks ? Number(durationWeeks) : null,
      priceRange: priceRange || null,
      description: description || null,
      isActive: isActive ?? true,
    },
  })
  return NextResponse.json(course)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.course.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
