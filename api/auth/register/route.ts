import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { randomBytes } from 'crypto'

const schema = z.object({
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  email: z.string().email('כתובת מייל לא תקינה'),
  password: z.string()
    .min(8, 'סיסמה חייבת להכיל לפחות 8 תווים')
    .regex(/[A-Z]/, 'סיסמה חייבת להכיל אות גדולה')
    .regex(/[0-9]/, 'סיסמה חייבת להכיל ספרה'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'כתובת מייל זו כבר רשומה במערכת' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const verificationToken = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    })

    await prisma.verificationToken.create({
      data: { identifier: email, token: verificationToken, expires },
    })

    // Send verification email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'gozer <noreply@gozer.io>',
        to: email,
        subject: 'אמת את כתובת המייל שלך — גוזר',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #2D5016;">ברוך הבא לגוזר! 🪖</h2>
            <p>היי ${name},</p>
            <p>לחץ על הכפתור כדי לאמת את כתובת המייל שלך:</p>
            <a href="${verifyUrl}" style="display:inline-block;background:#2D5016;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
              אמת מייל
            </a>
            <p style="color:#666;font-size:13px;">הקישור תקף ל-24 שעות.</p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Email send error:', emailErr)
      // Don't fail registration if email fails
    }

    return NextResponse.json({ success: true, message: 'נשלח מייל אימות לכתובתך' })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'שגיאה בשרת, נסה שוב' }, { status: 500 })
  }
}
