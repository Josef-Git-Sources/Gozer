import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { readTime } from '@/lib/utils'

const schema = z.object({
  title:      z.string().min(2, 'כותרת חובה'),
  slug:       z.string().min(2, 'slug חובה').regex(/^[a-z0-9-]+$/, 'slug יכול להכיל רק אותיות לטיניות, ספרות ומקף'),
  content:    z.string().min(10, 'תוכן חובה'),
  excerpt:    z.string().optional(),
  categoryId: z.string().optional(),
  tags:       z.string().optional(),
  status:     z.enum(['published', 'draft', 'hidden']).default('draft'),
  period:     z.string().optional(),
  metaTitle:  z.string().optional(),
  metaDesc:   z.string().optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  })
  return NextResponse.json(articles)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { tags, categoryId, ...data } = parsed.data

    // Check slug uniqueness
    const existing = await prisma.article.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug זה כבר קיים — בחר slug אחר' }, { status: 409 })
    }

    const article = await prisma.article.create({
      data: {
        ...data,
        excerpt:    data.excerpt || null,
        categoryId: categoryId || null,
        period:     data.period || null,
        metaTitle:  data.metaTitle || null,
        metaDesc:   data.metaDesc || null,
        tags:       tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        readTime:   readTime(data.content),
        authorId:   (session.user as any).id,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (err) {
    console.error('Article POST error:', err)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}
