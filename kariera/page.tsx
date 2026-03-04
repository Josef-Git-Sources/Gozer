import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { QuizClient } from './QuizClient'

export const metadata: Metadata = {
  title: 'הכוונה מקצועית',
  description: 'שאלון נטיות מקצועיות + המלצות קורסים ומסלולים מותאמים אישית',
}

export default async function KarieraPage() {
  const [questions, courses] = await Promise.all([
    prisma.quizQuestion.findMany({ orderBy: { order: 'asc' } }),
    prisma.course.findMany({ where: { isActive: true } }),
  ])
  return <QuizClient questions={questions} courses={courses} />
}
