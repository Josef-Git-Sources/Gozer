# 🪖 גוזר — gozer.io

המרכז הדיגיטלי לחייל המשוחרר.

## דרישות מקדמיות

- Node.js 18+ ([הורד כאן](https://nodejs.org))
- חשבון [Supabase](https://supabase.com) חינמי (מסד נתונים)
- חשבון [Google Cloud](https://console.cloud.google.com) (Google OAuth)
- חשבון [Resend](https://resend.com) חינמי (אימות מייל)

---

## הגדרה ראשונה — 5 שלבים

### שלב 1 — התקנת תלויות
```bash
npm install
```

### שלב 2 — הגדרת משתני סביבה
```bash
cp .env.example .env
```
ערוך את קובץ `.env` עם הפרטים שלך (ראה הוראות מטה).

### שלב 3 — חיבור מסד נתונים
```bash
npx prisma generate
npx prisma db push
```

### שלב 4 — הוספת נתוני ברירת מחדל
```bash
npm run db:seed
```
יוצר: משתמש מנהל (`admin@gozer.io` / `Admin123!`), קטגוריות, יעדי טיול, קורסים, שאלות שאלון.

### שלב 5 — הרצה מקומית
```bash
npm run dev
```
פתח [http://localhost:3000](http://localhost:3000)

---

## הגדרת שירותים חיצוניים

### Supabase (מסד נתונים)
1. צור פרויקט חדש ב-[supabase.com](https://supabase.com)
2. לך ל-Settings → Database → Connection String
3. העתק את ה-URI והדבק ב-`DATABASE_URL` ב-`.env`

### Google OAuth
1. פתח [Google Cloud Console](https://console.cloud.google.com)
2. צור פרויקט חדש
3. APIs & Services → Credentials → Create OAuth Client
4. סוג: Web Application
5. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. העתק Client ID ו-Client Secret ל-`.env`

### Resend (אימות מייל)
1. צור חשבון ב-[resend.com](https://resend.com)
2. API Keys → Create API Key
3. הדבק ב-`RESEND_API_KEY`

### NEXTAUTH_SECRET
הרץ בטרמינל:
```bash
openssl rand -base64 32
```
הדבק את התוצאה ב-`NEXTAUTH_SECRET`

---

## פריסה ל-Vercel

```bash
npm install -g vercel
vercel
```
הגדר את כל משתני הסביבה מ-`.env` ב-Vercel Dashboard.

---

## מבנה הפרויקט

```
src/
├── app/
│   ├── page.tsx           # דף הבית
│   ├── zchuyot/           # מרכז זכויות וחובות
│   ├── checklist/         # צ'קליסט שחרור
│   ├── tiyul/             # מתכנן טיול
│   ├── kariera/           # הכוונה מקצועית
│   ├── profile/           # פרופיל משתמש
│   ├── admin/             # פאנל ניהול
│   ├── login/             # כניסה
│   ├── register/          # הרשמה
│   └── api/               # API routes
├── components/
│   └── layout/            # Navbar, Footer, Providers
└── lib/
    ├── auth.ts            # NextAuth config
    ├── prisma.ts          # Prisma client
    └── utils.ts           # פונקציות עזר
prisma/
├── schema.prisma          # מבנה מסד הנתונים
└── seed.ts                # נתוני ברירת מחדל
```

---

## כניסה למנהל

לאחר הרצת `npm run db:seed`:
- מייל: `admin@gozer.io`
- סיסמה: `Admin123!`
- כתובת פאנל: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## טכנולוגיות

| שכבה | טכנולוגיה |
|------|-----------|
| Frontend | Next.js 14 + TypeScript |
| עיצוב | Tailwind CSS |
| Auth | NextAuth.js (Google + Credentials + 2FA) |
| DB | PostgreSQL (Supabase) + Prisma |
| Email | Resend |
| Hosting | Vercel |
