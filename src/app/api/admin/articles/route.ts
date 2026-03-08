import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { readTime, slugify } from '@/lib/utils'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const cat = searchParams.get('cat')

  const articles = await prisma.article.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(cat ? { category: { slug: cat } } : {}),
    },
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })

  return NextResponse.json(articles)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, content, excerpt, categoryId, tags, status, period, metaTitle, metaDesc } = body

  if (!title || !content) return NextResponse.json({ error: 'כותרת ותוכן הם שדות חובה' }, { status: 400 })

  const slug = slugify(title) + '-' + Date.now().toString(36)
  const rt = readTime(content)

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      categoryId: categoryId || null,
      tags: tags || [],
      status: status || 'draft',
      period: period || 'all',
      metaTitle: metaTitle || null,
      metaDesc: metaDesc || null,
      authorId: (session!.user as any).id,
      readTime: rt,
    },
  })

  return NextResponse.json(article, { status: 201 })
}
