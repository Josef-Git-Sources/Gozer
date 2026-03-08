import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'הצהרת נגישות',
  description: 'הצהרת נגישות של אתר גוזר — gozer.io',
}

export default function AccessibilityPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="font-display text-4xl font-bold text-green-dark mb-2">♿ הצהרת נגישות</h1>
      <p className="text-gray-400 text-sm mb-10">עודכן: מרץ 2026</p>

      <div className="prose-he space-y-8">
        <section aria-labelledby="commitment">
          <h2 id="commitment">מחויבות לנגישות</h2>
          <p>גוזר (gozer.io) מחויב לנגישות דיגיטלית לאנשים עם מוגבלויות. אנו שואפים לעמוד בתקן הנגישות הישראלי SI 5568 המבוסס על הנחיות WCAG 2.1 ברמה AA.</p>
        </section>

        <section aria-labelledby="features">
          <h2 id="features">תכונות נגישות באתר</h2>
          <ul>
            <li>תמיכה מלאה בקורא מסך (NVDA, VoiceOver, JAWS)</li>
            <li>ניווט מלא באמצעות מקלדת בלבד</li>
            <li>Skip navigation — קישור לדילוג לתוכן הראשי</li>
            <li>ניגודיות צבעים עומדת בתקן WCAG 2.1 AA</li>
            <li>תגיות alt תיאוריות לכל תמונה</li>
            <li>ניתן להגדיל טקסט עד 200% ללא שבירת פריסה</li>
            <li>שימוש ב-ARIA landmarks לניווט קל</li>
            <li>טפסים עם תיוג מלא ובהיר</li>
          </ul>
        </section>

        <section aria-labelledby="limitations">
          <h2 id="limitations">מגבלות ידועות</h2>
          <p>אנו עובדים כל הזמן לשיפור הנגישות. אם נתקלת בבעיה, נשמח לשמוע.</p>
        </section>

        <section aria-labelledby="contact">
          <h2 id="contact">יצירת קשר בנושא נגישות</h2>
          <p>לדיווח על בעיית נגישות או לקבלת עזרה:</p>
          <ul>
            <li>מייל: <a href="mailto:accessibility@gozer.io">accessibility@gozer.io</a></li>
            <li>אנו מתחייבים לענות תוך 2 ימי עסקים</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
