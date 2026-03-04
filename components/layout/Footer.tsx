import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-green-dark text-white mt-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl" aria-hidden="true">🪖</span>
              <span className="font-display text-xl font-bold">גוזר</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              המרכז הדיגיטלי לחייל המשוחרר — זכויות, תכנון, הכוונה.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold mb-3 text-white/90">מידע</h3>
            <ul className="space-y-2">
              {[
                { href: '/zchuyot', label: 'זכויות וחובות' },
                { href: '/checklist', label: 'צ\'קליסט שחרור' },
                { href: '/zchuyot?cat=financial', label: 'מידע כספי' },
                { href: '/zchuyot?cat=reserves', label: 'מילואים' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/65 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-white/90">כלים</h3>
            <ul className="space-y-2">
              {[
                { href: '/tiyul', label: 'מתכנן טיול' },
                { href: '/kariera', label: 'הכוונה מקצועית' },
                { href: '/profile', label: 'הפרופיל שלי' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/65 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-white/90">עוד</h3>
            <ul className="space-y-2">
              {[
                { href: '/accessibility', label: 'נגישות' },
                { href: '/login', label: 'כניסה' },
                { href: '/register', label: 'הרשמה חינם' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/65 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-white/50 text-sm">
          <p>© {new Date().getFullYear()} גוזר | gozer.io — כל הזכויות שמורות</p>
          <p>
            <Link href="/accessibility" className="hover:text-white transition-colors">הצהרת נגישות</Link>
            {' | '}
            <span>נבנה עם ❤️ לחיילי ישראל</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
