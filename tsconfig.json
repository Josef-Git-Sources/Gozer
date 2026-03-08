import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (session?.user && (session.user as any).role === 'ADMIN') {
    const cats = await prisma.category.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json(cats)
  }
  return NextResponse.json([])
}
