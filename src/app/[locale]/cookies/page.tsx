import Link from 'next/link'
import { type Locale, getTranslation } from '@/lib/i18n'
import Footer from '@/components/Footer'

function LegalNav({ locale }: { locale: Locale }) {
  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
              <span className="text-white font-black text-lg leading-none">t</span>
            </div>
            <span className="text-xl font-black tracking-tight text-brand-800">taddam</span>
          </Link>
          <Link href={`/${locale}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            ← {locale === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
          </Link>
        </div>
      </div>
    </nav>
  )
}

const cookieTable = [
  { name: 'session', purpose: 'Maintains your authenticated session', duration: 'Session', type: 'Essential' },
  { name: 'locale', purpose: 'Remembers your language preference (EN/FR)', duration: '1 year', type: 'Essential' },
  { name: 'csrf_token', purpose: 'Protects against cross-site request forgery attacks', duration: 'Session', type: 'Essential' },
  { name: '_stripe_mid', purpose: 'Stripe fraud detection and payment flow', duration: '1 year', type: 'Essential' },
  { name: '_stripe_sid', purpose: 'Stripe session identifier for payment processing', duration: '30 min', type: 'Essential' },
  { name: '_ga', purpose: 'Google Analytics: distinguishes users (anonymized IP)', duration: '2 years', type: 'Analytics (optional)' },
  { name: '_ga_*', purpose: 'Google Analytics: session state', duration: '1 year', type: 'Analytics (optional)' },
]

export default function CookiesPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const updated = locale === 'fr' ? 'Dernière mise à jour : 1er janvier 2025' : 'Last updated: January 1, 2025'

  return (
    <div className="min-h-screen bg-white">
      <LegalNav locale={locale} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{t.footer.cookies}</h1>
          <p className="text-sm text-slate-400">{updated}</p>
        </div>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">What are cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They allow the site to remember your preferences and session state between page loads. We use cookies strictly to operate the taddam platform securely and to improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Essential cookies</h2>
            <p className="mb-4">
              Essential cookies are required for the platform to function. They cannot be disabled without breaking core features such as login, pool participation, and checkout.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Analytics cookies</h2>
            <p className="mb-4">
              We use Google Analytics with IP anonymization to understand aggregate usage patterns. These cookies are optional and do not identify you personally. You can opt out at any time via your account settings or by declining cookies in the consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Cookie inventory</h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Cookie name</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden sm:table-cell">Purpose</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Duration</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cookieTable.map((c) => (
                    <tr key={c.name} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-800">{c.name}</td>
                      <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{c.purpose}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.duration}</td>
                      <td className="px-4 py-3">
                        <span className={c.type === 'Essential' ? 'badge-blue' : 'badge-gray'}>
                          {c.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Third-party cookies</h2>
            <p>
              Stripe places their own cookies for fraud detection and payment flow management. These are governed by <a href="https://stripe.com/privacy" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">Stripe&rsquo;s Privacy Policy</a>. taddam does not control these cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Managing cookies</h2>
            <p>
              You can control cookies through your browser settings. Note that disabling essential cookies will prevent you from logging in or participating in pools. To opt out of analytics cookies specifically, visit your account&rsquo;s Privacy Settings or use the <a href="https://tools.google.com/dlpage/gaoptout" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Add-on</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Contact</h2>
            <p>
              Questions about our cookie practices? Contact us at <strong>privacy@taddam.com</strong>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
          <Link href={`/${locale}/privacy`} className="text-sm text-brand-600 hover:underline">{t.footer.privacy}</Link>
          <Link href={`/${locale}/terms`} className="text-sm text-brand-600 hover:underline">{t.footer.terms}</Link>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
