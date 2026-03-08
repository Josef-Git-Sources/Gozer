import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const result = await prisma.userQuizResult.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(result || null)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const { domainScores, recommendedCourses } = await req.json()
  if (!domainScores) return NextResponse.json({ error: 'domainScores נדרש' }, { status: 400 })

  const result = await prisma.userQuizResult.create({
    data: { userId, domainScores, recommendedCourses: recommendedCourses || [] },
  })
  return NextResponse.json(result, { status: 201 })
}
