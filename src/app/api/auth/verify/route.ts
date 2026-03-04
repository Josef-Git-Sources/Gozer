import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const email = req.nextUrl.searchParams.get('email')

  if (!token || !email) {
    return NextResponse.redirect(new URL('/login?error=invalid_token', req.url))
  }

  const verificationToken = await prisma.verificationToken.findUnique({ where: { token } })

  if (!verificationToken || verificationToken.identifier !== email || verificationToken.expires < new Date()) {
    return NextResponse.redirect(new URL('/login?error=expired_token', req.url))
  }

  await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } })
  await prisma.verificationToken.delete({ where: { token } })

  return NextResponse.redirect(new URL('/login?verified=true', req.url))
}
