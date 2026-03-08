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

  const courses = await prisma.course.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(courses)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, provider, url, domain, durationWeeks, priceRange, description } = body

  if (!name || !provider || !url || !domain) {
    return NextResponse.json({ error: 'שם, ספק, קישור ותחום הם שדות חובה' }, { status: 400 })
  }

  const course = await prisma.course.create({
    data: {
      name, provider, url, domain,
      durationWeeks: durationWeeks ? Number(durationWeeks) : null,
      priceRange: priceRange || null,
      description: description || null,
    },
  })
  return NextResponse.json(course, { status: 201 })
}
