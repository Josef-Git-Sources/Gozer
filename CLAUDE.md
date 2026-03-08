# גוזר (gozer.io) — הקשר לפיתוח עם Claude

## על הפרויקט
פלטפורמת ווב לחיילים משוחררים בישראל.
- **Stack:** Next.js 14 + TypeScript + Tailwind + PostgreSQL (Supabase) + Prisma + NextAuth
- **שפה:** עברית מלאה, RTL
- **דומיין:** gozer.io
- **GitHub:** github.com/Josef-Git-Sources/Gozer

## ארכיטקטורה
```
src/app/
├── admin/                        # פאנל ניהול מלא
│   ├── page.tsx                  # דשבורד + סטטיסטיקות
│   ├── ArticleForm.tsx           # טופס מאמר משותף
│   ├── articles/                 # רשימה / חדש / עריכה
│   ├── users/                    # ניהול משתמשים
│   ├── checklist/                # ניהול צ'קליסט
│   ├── destinations/             # ניהול יעדי טיול
│   └── courses/                  # ניהול קורסים
├── api/
│   ├── auth/                     # NextAuth + register + verify
│   ├── admin/                    # CRUD לכל הישויות (admin only)
│   │   ├── articles/[id]/
│   │   ├── users/[id]/
│   │   ├── checklist/[id]/
│   │   ├── destinations/[id]/
│   │   ├── courses/[id]/
│   │   └── categories/
│   └── user/                     # שמירת נתוני משתמש ל-DB
│       ├── checklist/            # GET + POST (toggle פריט)
│       ├── trip/                 # GET + POST + DELETE
│       └── quiz/                 # GET + POST (שמירת תוצאות)
├── checklist/                    # ChecklistClient — שמירה ב-DB
├── tiyul/                        # TripPlannerClient — שמירה ב-DB
├── kariera/                      # QuizClient — שמירה ב-DB
├── zchuyot/                      # מאמרים + [slug] עם SEO
├── profile/                      # פרופיל משתמש (קורא מ-DB)
├── sitemap.ts                    # sitemap דינמי
├── robots.ts                     # robots.txt
└── layout.tsx                    # SEO מלא + OG tags
```

## מפת דרכים

### ✅ שלב א' — תשתית (הושלם)
- Next.js 14 + TypeScript + Tailwind RTL
- Prisma schema מלא
- NextAuth — Google OAuth + Credentials + 2FA (TOTP)
- כל דפי המשתמש + הרשמה + כניסה + אימות מייל
- Navbar + Footer + נגישות

### ✅ שלב ב' — פאנל ניהול + שמירת נתונים (הושלם — קוד בלבד)
- [x] פאנל ניהול מלא (מאמרים, משתמשים, צ'קליסט, יעדים, קורסים)
- [x] API routes לכל הישויות (CRUD)
- [x] שמירת צ'קליסט אישי ב-DB (סנכרון אמיתי)
- [x] שמירת תוכנית טיול ב-DB
- [x] שמירת תוצאות שאלון ב-DB

### ✅ שלב ג' — SEO + הכנה להשקה (הושלם — קוד בלבד)
- [x] sitemap.xml דינמי (כולל מאמרים)
- [x] robots.txt
- [x] metadata מלא + Open Graph + Twitter cards
- [x] Security headers ב-next.config.js
- [x] .env.example מפורט
- [x] DEPLOY.md — מדריך פריסה שלב-אחר-שלב

### ⏳ שלב ד' — חיבור שירותים + השקה (הבא — הכרחי לפני שהאפליקציה עובדת)
- [ ] יצירת פרויקט Supabase + קבלת DATABASE_URL
- [ ] הרצת `prisma db push` ליצירת טבלאות
- [ ] הרצת `prisma db seed` להוספת תוכן ראשוני
- [ ] הגדרת Google OAuth (Client ID + Secret)
- [ ] הגדרת Resend (שליחת מיילים)
- [ ] פריסה ל-Vercel + הגדרת משתני סביבה
- [ ] בדיקת Build מוצלחת
- [ ] חיבור דומיין gozer.io

> ⚠️ שלבים א'-ג' הם קוד מוכן לפריסה אך האפליקציה לא תעבוד
> עד שלב ד' יושלם (אין DB אמיתי, אין OAuth, אין מיילים).

### 🔮 שלב ה' — גרסה 2 (עתידי)
- [ ] רב-לשוניות
- [ ] Booking.com API
- [ ] Claude API לתוכן חכם
- [ ] מחשבון כספי
- [ ] פורום קהילתי
- [ ] לוח מודעות תעסוקה

## הוראות לפיתוח עם Claude
1. תמיד קרא קובץ זה בתחילת כל שיחה
2. הורד את הקוד מ-GitHub לפני שמתחילים
3. כתוב קבצים **שלמים** — לא קטעי קוד
4. בסוף כל שלב — ארוז ZIP עם הקבצים החדשים בלבד
5. עדכן את ה-checkboxes במפת הדרכים
