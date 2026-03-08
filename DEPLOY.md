# 🚀 הוראות השקה — גוזר

## שלב 1 — Supabase (מסד נתונים)

1. כנס ל-[supabase.com](https://supabase.com) → **New Project**
2. בחר שם פרויקט: `gozer` ← כתוב בדיוק ככה
3. בחר סיסמה חזקה ושמור אותה
4. אזור: **eu-central-1** (הכי קרוב לישראל)
5. לחץ **Create new project** — המתן ~2 דקות

**קבלת ה-DATABASE_URL:**
- לך ל: **Settings** → **Database** → **Connection string** → **URI**
- העתק את ה-URI
- החלף את `[YOUR-PASSWORD]` בסיסמה שבחרת

---

## שלב 2 — Google OAuth

1. כנס ל-[console.cloud.google.com](https://console.cloud.google.com)
2. **Select a project** → **New Project** → שם: `gozer`
3. בסרגל הצד: **APIs & Services** → **Credentials**
4. **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. שם: `Gozer`
7. **Authorized redirect URIs** — הוסף שני URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-app.vercel.app/api/auth/callback/google
   ```
   (את הכתובת של Vercel תוסיף אחרי הפריסה)
8. לחץ **Create** → שמור את Client ID ו-Client Secret

---

## שלב 3 — Resend (מיילים)

1. כנס ל-[resend.com](https://resend.com) → **Sign up**
2. **API Keys** → **Create API Key** → שם: `gozer`
3. שמור את המפתח (מתחיל ב-`re_`)
4. אם יש לך דומיין (gozer.io): **Domains** → **Add Domain** → עקוב אחר ההוראות

---

## שלב 4 — הרצה מקומית

```bash
# 1. שכפל את הפרויקט
git clone https://github.com/Josef-Git-Sources/Gozer.git
cd Gozer

# 2. התקן תלויות
npm install

# 3. הגדר משתני סביבה
cp .env.example .env
# ערוך את .env עם הפרטים שלך

# 4. צור את מסד הנתונים
npx prisma generate
npx prisma db push

# 5. הוסף נתונים ראשוניים (חשוב!)
npm run db:seed

# 6. הרץ
npm run dev
```

פתח [http://localhost:3000](http://localhost:3000)

**כניסה כמנהל:**
- מייל: `admin@gozer.io`
- סיסמה: `Admin123!`

---

## שלב 5 — פריסה ל-Vercel

### א. חבר GitHub ל-Vercel
1. כנס ל-[vercel.com](https://vercel.com) → **Sign up with GitHub**
2. **Add New Project** → בחר את הריפו **Gozer**
3. Framework Preset: **Next.js** (יזהה אוטומטית)

### ב. הגדר משתני סביבה ב-Vercel
לך ל: **Settings** → **Environment Variables** — הוסף את כולם:

| שם | ערך |
|----|-----|
| `DATABASE_URL` | ה-URI מ-Supabase |
| `NEXTAUTH_SECRET` | הרץ: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` |
| `GOOGLE_CLIENT_ID` | מ-Google Console |
| `GOOGLE_CLIENT_SECRET` | מ-Google Console |
| `RESEND_API_KEY` | מ-Resend |
| `RESEND_FROM_EMAIL` | `noreply@gozer.io` |

### ג. פרוס!
לחץ **Deploy** — תוך ~3 דקות האתר יהיה חי.

### ד. עדכן כתובות אחרי הפריסה
1. ב-Google Console → Credentials → הוסף את כתובת Vercel ל-Authorized redirect URIs
2. ב-Vercel → עדכן `NEXTAUTH_URL` ו-`NEXT_PUBLIC_APP_URL` לכתובת הסופית

---

## שלב 6 — דומיין מותאם אישית (gozer.io)

1. ב-Vercel: **Settings** → **Domains** → הוסף `gozer.io`
2. עקוב אחר הוראות ה-DNS (עדכן ב-Registrar שלך)
3. Vercel יתקין SSL אוטומטית

---

## בדיקות לאחר השקה

- [ ] דף הבית נטען
- [ ] הרשמה עובדת
- [ ] כניסה עם Google עובדת
- [ ] כניסה עם מייל/סיסמה עובדת
- [ ] צ'קליסט נשמר בין ביקורים
- [ ] מתכנן טיול שומר לפרופיל
- [ ] שאלון שומר לפרופיל
- [ ] פאנל ניהול נגיש למנהל
- [ ] sitemap.xml נגיש: `https://gozer.io/sitemap.xml`
- [ ] robots.txt נגיש: `https://gozer.io/robots.txt`
