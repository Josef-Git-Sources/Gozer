import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ArticleForm } from '../ArticleForm'

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') redirect('/')

  const article = await prisma.article.findUnique({ where: { id: params.id } })
  if (!article) redirect('/admin/articles')

  return (
    <ArticleForm initialData={{
      id: article.id,
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      categoryId: article.categoryId || '',
      tags: article.tags,
      status: article.status,
      period: article.period || 'all',
      metaTitle: article.metaTitle || '',
      metaDesc: article.metaDesc || '',
    }} />
  )
}
