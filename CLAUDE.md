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
├── api/
│   ├── auth/                     # NextAuth + register + verify
│   ├── admin/                    # CRUD לכל הישויות (admin only)
│   └── user/                     # checklist + trip + quiz (שמירה ל-DB)
├── checklist/                    # שמירה ב-DB ✅
├── tiyul/                        # שמירה ב-DB ✅
├── kariera/                      # שמירה ב-DB ✅
├── zchuyot/                      # מאמרים + [slug] עם SEO
├── profile/                      # פרופיל משתמש
├── sitemap.ts                    # ✅ sitemap דינמי
├── robots.ts                     # ✅ robots.txt
└── layout.tsx                    # ✅ SEO מלא + OG tags
```

## מפת דרכים

### ✅ שלב א' — תשתית (הושלם)
### ✅ שלב ב' — פאנל ניהול + שמירת נתונים (הושלם)
### ✅ שלב ג' — SEO + הכנה להשקה (הושלם)
- [x] sitemap.xml דינמי (כולל מאמרים)
- [x] robots.txt
- [x] metadata מלא + Open Graph + Twitter cards
- [x] Security headers ב-next.config.js
- [x] .env.example מפורט
- [x] DEPLOY.md — מדריך פריסה שלב-אחר-שלב (Supabase + Google OAuth + Vercel)

### ⏳ שלב ג' — נותר
- [ ] העלאת הכל ל-GitHub
- [ ] חיבור Supabase + הרצה מקומית מוצלחת
- [ ] פריסה ל-Vercel + דומיין gozer.io

### 🔮 שלב ד' — גרסה 2
- [ ] רב-לשוניות, Booking.com API, Claude API
- [ ] מחשבון כספי, פורום קהילתי, לוח מודעות

## הוראות לפיתוח עם Claude
1. תמיד קרא קובץ זה בתחילת כל שיחה
2. הורד את הקוד מ-GitHub לפני שמתחילים
3. כתוב קבצים **שלמים** — לא קטעי קוד
4. בסוף כל שלב — ארוז ZIP עם הקבצים החדשים בלבד
5. עדכן את ה-checkboxes במפת הדרכים
