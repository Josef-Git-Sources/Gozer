import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { readTime } from '@/lib/utils'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: { category: true },
  })
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, content, excerpt, categoryId, tags, status, period, metaTitle, metaDesc } = body

  const article = await prisma.article.update({
    where: { id: params.id },
    data: {
      title,
      content,
      excerpt: excerpt || null,
      categoryId: categoryId || null,
      tags: tags || [],
      status,
      period: period || 'all',
      metaTitle: metaTitle || null,
      metaDesc: metaDesc || null,
      readTime: readTime(content),
    },
  })

  return NextResponse.json(article)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.article.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
