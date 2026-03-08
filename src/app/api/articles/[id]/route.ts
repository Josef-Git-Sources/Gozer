import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { readTime } from '@/lib/utils'

const schema = z.object({
  title:      z.string().min(2),
  slug:       z.string().min(2).regex(/^[a-z0-9-]+$/),
  content:    z.string().min(10),
  excerpt:    z.string().optional(),
  categoryId: z.string().optional(),
  tags:       z.string().optional(),
  status:     z.enum(['published', 'draft', 'hidden']),
  period:     z.string().optional(),
  metaTitle:  z.string().optional(),
  metaDesc:   z.string().optional(),
})

async function isAdmin() {
  const session = await getServerSession(authOptions)
  return session && (session.user as any).role === 'ADMIN'
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: { category: true },
  })
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { tags, categoryId, ...data } = parsed.data

    // Check slug uniqueness (excluding self)
    const existing = await prisma.article.findFirst({
      where: { slug: data.slug, NOT: { id: params.id } },
    })
    if (existing) {
      return NextResponse.json({ error: 'Slug זה כבר קיים' }, { status: 409 })
    }

    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        ...data,
        excerpt:    data.excerpt || null,
        categoryId: categoryId || null,
        period:     data.period || null,
        metaTitle:  data.metaTitle || null,
        metaDesc:   data.metaDesc || null,
        tags:       tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        readTime:   readTime(data.content),
      },
    })

    return NextResponse.json(article)
  } catch (err) {
    console.error('Article PUT error:', err)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.article.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'שגיאה במחיקה' }, { status: 500 })
  }
}
