import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const adminPassword = await bcrypt.hash('Admin123!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@gozer.io' },
    update: {},
    create: {
      name: 'מנהל מערכת',
      email: 'admin@gozer.io',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  // Categories
  const cats = [
    { name: 'כספי', slug: 'financial' },
    { name: 'רפואי', slug: 'medical' },
    { name: 'לימודים', slug: 'education' },
    { name: 'תעסוקה', slug: 'employment' },
    { name: 'מילואים', slug: 'reserves' },
  ]
  for (const cat of cats) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat })
  }

  // Sample articles
  const financialCat = await prisma.category.findUnique({ where: { slug: 'financial' } })
  await prisma.article.upsert({
    where: { slug: 'meanak-shihrur' },
    update: {},
    create: {
      title: 'מענק השחרור — כל מה שצריך לדעת',
      slug: 'meanak-shihrur',
      content: `<h2>מה זה מענק שחרור?</h2><p>מענק שחרור הוא תשלום חד פעמי שמקבל כל חייל בתום שירותו הסדיר. הסכום משתנה בהתאם לתקופת השירות ולסיווג הרפואי.</p><h2>מי זכאי?</h2><p>כל חייל שהשלים שירות סדיר מלא — 32 חודשים לגברים ו-24 חודשים לנשים — זכאי למענק שחרור מלא.</p><h2>כמה מקבלים?</h2><p>הסכום מתעדכן מדי שנה. בדוק באתר מערך חשבות הצבא את הסכום העדכני.</p>`,
      excerpt: 'כל המידע על מענק השחרור — מי זכאי, כמה מקבלים, ואיך מקבלים אותו.',
      categoryId: financialCat!.id,
      tags: ['מענק', 'שחרור', 'כסף'],
      status: 'published',
      period: 'after',
    },
  })

  // Checklist items
  const checklistItems = [
    { title: 'פגישה עם קצין שחרור', description: 'קבע פגישה עם קצין השחרור ביחידתך לקבלת מידע על זכויותיך.', period: '3months', order: 1 },
    { title: 'בדוק זכאות למענק שחרור', description: 'וודא את סכום המענק שתקבל בהתאם לתקופת שירותך.', period: '3months', order: 2 },
    { title: 'פתח חשבון בנק אזרחי', description: 'אם אין לך חשבון בנק פעיל, פתח אחד לפני השחרור.', period: '3months', order: 3 },
    { title: 'הגש בקשה לקרן השתלמות', description: 'בדוק זכאותך לקרן השתלמות לחיילים משוחררים.', period: '1month', order: 1 },
    { title: 'ברר על ביטוח בריאות', description: 'בחר קופת חולים והירשם לפני יום השחרור.', period: '1month', order: 2 },
    { title: 'החזר ציוד צבאי', description: 'החזר את כל הציוד הצבאי שברשותך ל-RNR.', period: '1week', order: 1 },
    { title: 'קבל מסמך שחרור (תז"פ)', description: 'וודא שקיבלת את תעודת הזהות הפרטית שלך בחזרה.', period: 'release_day', order: 1 },
    { title: 'הרשם לביטוח לאומי', description: 'הרשם לביטוח לאומי תוך 3 חודשים מהשחרור לדמי אבטלה.', period: '1week_after', order: 1 },
    { title: 'עדכן כתובת בטבלה', description: 'עדכן את כתובתך במשרד הפנים ובצבא.', period: '1week_after', order: 2 },
  ]
  for (const item of checklistItems) {
    await prisma.checklistItem.upsert({
      where: { id: item.title },
      update: {},
      create: { ...item, id: Buffer.from(item.title).toString('base64').slice(0, 25) },
    })
  }

  // Trip destinations
  const destinations = [
    { name: 'תאילנד', nameEn: 'Thailand', region: 'דרום מזרח אסיה', flag: '🇹🇭', avgFlightIls: 3500, avgAccommodationIls: 120, avgFoodDaily: 80, avgTransportDaily: 50, avgActivitiesDaily: 100, tips: 'עונת הגשמים: מאי-אוקטובר. מומלץ לבקר בחוף ובצפון.' },
    { name: 'פרו', nameEn: 'Peru', region: 'דרום אמריקה', flag: '🇵🇪', avgFlightIls: 5500, avgAccommodationIls: 150, avgFoodDaily: 100, avgTransportDaily: 80, avgActivitiesDaily: 150, tips: 'מאצ\'ו פיצ\'ו וכוזקו — חובה. גובה גבוה — היערך מראש.' },
    { name: 'קולומביה', nameEn: 'Colombia', region: 'דרום אמריקה', flag: '🇨🇴', avgFlightIls: 5200, avgAccommodationIls: 130, avgFoodDaily: 90, avgTransportDaily: 70, avgActivitiesDaily: 120, tips: 'מדיין, קרטחנה ובוגוטה — ערים מדהימות.' },
    { name: 'ניו זילנד', nameEn: 'New Zealand', region: 'אוסטרליה ואוקיאניה', flag: '🇳🇿', avgFlightIls: 7000, avgAccommodationIls: 250, avgFoodDaily: 200, avgTransportDaily: 150, avgActivitiesDaily: 250, tips: 'מומלץ לשכור רכב. עונה טובה: נובמבר-מרץ.' },
    { name: 'פורטוגל', nameEn: 'Portugal', region: 'אירופה', flag: '🇵🇹', avgFlightIls: 2500, avgAccommodationIls: 300, avgFoodDaily: 200, avgTransportDaily: 120, avgActivitiesDaily: 150, tips: 'ליסבון ואלגרב — יעדים מומלצים. זול יחסית לאירופה.' },
    { name: 'יפן', nameEn: 'Japan', region: 'אסיה', flag: '🇯🇵', avgFlightIls: 4500, avgAccommodationIls: 350, avgFoodDaily: 200, avgTransportDaily: 200, avgActivitiesDaily: 200, tips: 'פסח הדובדבנים (מרץ-אפריל) יפהפה. קנו JR Pass.' },
  ]
  for (const dest of destinations) {
    await prisma.tripDestination.upsert({
      where: { id: dest.nameEn.toLowerCase() },
      update: {},
      create: { id: dest.nameEn.toLowerCase(), ...dest },
    })
  }

  // Courses
  const courses = [
    { name: 'Full Stack Development', provider: 'Elevation', url: 'https://elevation.ac.il', domain: 'tech', durationWeeks: 24, priceRange: 'מלגות זמינות', description: 'בוטקמפ פיתוח Full Stack — React, Node.js, PostgreSQL' },
    { name: 'Data Science', provider: 'ITC (Israel Tech Challenge)', url: 'https://www.itc.tech', domain: 'tech', durationWeeks: 28, priceRange: 'מלגה לחיילים משוחררים', description: 'Python, Machine Learning, Deep Learning' },
    { name: 'Cyber Security', provider: 'HackerU', url: 'https://hackeru.com', domain: 'tech', durationWeeks: 32, priceRange: '₪20,000-30,000', description: 'אבטחת מידע — Ethical Hacking, Network Security' },
    { name: 'UX/UI Design', provider: 'Shenkar', url: 'https://shenkar.ac.il', domain: 'design', durationWeeks: 40, priceRange: '₪15,000-25,000', description: 'עיצוב ממשק משתמש, Figma, מחקר משתמשים' },
    { name: 'MBA', provider: 'IDC Reichman University', url: 'https://runi.ac.il', domain: 'business', durationWeeks: 80, priceRange: 'הנחה לחיילים משוחררים', description: 'תואר MBA — ניהול עסקים, יזמות, מימון' },
    { name: 'Digital Marketing', provider: 'Google Certifications', url: 'https://grow.google', domain: 'marketing', durationWeeks: 6, priceRange: 'חינם', description: 'Google Analytics, Ads, SEO — הסמכה מוכרת' },
  ]
  for (const course of courses) {
    await prisma.course.create({ data: course }).catch(() => {})
  }

  // Quiz questions
  const questions = [
    { questionText: 'מה הכי מתאר אותך?', options: ['אני אוהב לפתור בעיות טכניות', 'אני נהנה לעבוד עם אנשים', 'אני יצירתי ואוהב לעצב', 'אני אוהב לנתח נתונים ומספרים'], domainWeights: { tech: [3,0,0,1], people: [0,3,0,0], design: [0,0,3,0], business: [1,1,0,3] }, order: 1 },
    { questionText: 'מה היית עושה בזמן חופשי?', options: ['לבנות משהו (אפליקציה, פרויקט)', 'לנהל אירוע או לארגן קבוצה', 'לצלם, לצייר, ליצור תוכן', 'לקרוא על עסקים והשקעות'], domainWeights: { tech: [3,0,0,0], people: [0,3,0,0], design: [0,0,3,0], business: [0,0,0,3] }, order: 2 },
    { questionText: 'מה חשוב לך בעבודה?', options: ['שכר גבוה', 'יצירתיות וחופש', 'יציבות ובטחון', 'השפעה והשפעה על אחרים'], domainWeights: { tech: [2,1,0,1], people: [1,0,1,3], design: [0,3,0,0], business: [3,0,0,1] }, order: 3 },
    { questionText: 'איזה תפקיד היה מתאים לך בצבא?', options: ['מחשבים וסייבר', 'קצונה וניהול', 'קשר ומידע', 'לוגיסטיקה ואדמיניסטרציה'], domainWeights: { tech: [3,0,1,0], people: [0,3,0,1], design: [0,0,2,0], business: [0,1,0,3] }, order: 4 },
    { questionText: 'מה הכי מרגש אותך בעתיד?', options: ['לבנות מוצר טכנולוגי', 'לפתוח עסק משלי', 'לעצב חוויות ומותגים', 'לרפא ולעזור לאנשים'], domainWeights: { tech: [3,1,0,0], people: [0,0,0,2], design: [0,0,3,0], business: [0,3,0,0] }, order: 5 },
  ]
  await prisma.quizQuestion.deleteMany()
  for (const q of questions) {
    await prisma.quizQuestion.create({ data: q })
  }

  console.log('✅ Seed complete!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
