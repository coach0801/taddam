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

export default function PrivacyPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)

  const title = locale === 'fr' ? t.footer.privacy : t.footer.privacy
  const updated = locale === 'fr' ? 'Dernière mise à jour : 1er janvier 2025' : 'Last updated: January 1, 2025'

  return (
    <div className="min-h-screen bg-white">
      <LegalNav locale={locale} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{title}</h1>
          <p className="text-sm text-slate-400">{updated}</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              taddam.com Inc. (&ldquo;taddam&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the taddam.com collective procurement platform. This Privacy Policy explains how we collect, use, disclose, and protect personal information about users of our platform in accordance with the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA), Québec <em>Law 25</em>, and applicable provincial privacy legislation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Information We Collect</h2>
            <p>We collect the following categories of personal information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Identity information:</strong> First name, last name, business name, and Canadian Business Number (BN)</li>
              <li><strong>Contact information:</strong> Work email address, business address, and telephone number</li>
              <li><strong>Account credentials:</strong> Hashed password (we never store plaintext passwords)</li>
              <li><strong>Transaction data:</strong> Purchase history, pool participation records, and payment authorization references</li>
              <li><strong>Technical data:</strong> IP address, browser type, device identifiers, and usage logs</li>
              <li><strong>Communications:</strong> Messages sent through the platform, support tickets, and dispute communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Create and manage your account and organizational profile</li>
              <li>Process pool participations, payment authorizations, and order fulfilment</li>
              <li>Verify your organization&rsquo;s business number and provincial registration</li>
              <li>Send transactional notifications (pool status updates, shipment tracking, invoices)</li>
              <li>Calculate and remit correct GST/HST/PST/QST based on your ship-to province</li>
              <li>Detect and prevent fraud, abuse, and unauthorized account access</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Improve our platform through aggregate analytics (anonymized)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. How We Share Your Information</h2>
            <p>We do not sell your personal information. We share it only in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>With suppliers:</strong> When a pool closes, verified suppliers receive buyer shipping addresses and order quantities necessary for fulfilment — only the minimum information required</li>
              <li><strong>With Stripe Inc.:</strong> For payment processing via Stripe Payments Canada Ltd., a PCI-DSS Level 1 certified processor. Stripe&rsquo;s own privacy policy applies to data they hold</li>
              <li><strong>With service providers:</strong> Cloud hosting (Canadian data centres), email delivery, and fraud detection — all bound by confidentiality agreements</li>
              <li><strong>For legal compliance:</strong> Where required by applicable law, court order, or regulatory authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Data Residency</h2>
            <p>
              All personal data is stored on servers located in Canada (Microsoft Azure Canada Central and Canada East regions). We do not transfer personal information outside Canada except where explicitly required for payment processing through Stripe&rsquo;s global infrastructure, subject to appropriate data transfer safeguards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Data Retention</h2>
            <p>
              We retain personal information for as long as your account is active and for up to 7 years following account closure to comply with Canadian tax and commercial record-keeping obligations. Transaction records may be retained for longer periods where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your account and associated data (subject to legal retention requirements)</li>
              <li>Withdraw consent for optional uses of your data</li>
              <li>Receive your data in a portable, structured format</li>
              <li>Lodge a complaint with the Office of the Privacy Commissioner of Canada (OPC) or the Commission d&rsquo;accès à l&rsquo;information du Québec (CAI)</li>
            </ul>
            <p className="mt-3">To exercise your rights, contact our Privacy Officer at <strong>privacy@taddam.com</strong>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Security</h2>
            <p>
              We implement industry-standard security measures including AES-256 encryption at rest, TLS 1.3 in transit, multi-factor authentication for administrative access, quarterly third-party penetration testing, and SOC 2 Type II audit controls. No payment card data is stored on our servers — all payment processing is delegated to Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Cookies</h2>
            <p>
              We use essential cookies required for platform operation and optional analytics cookies. See our <Link href={`/${locale}/cookies`} className="text-brand-600 hover:underline">Cookie Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Contact</h2>
            <p>
              Our Privacy Officer can be reached at:<br />
              <strong>taddam.com Inc.</strong><br />
              Privacy Officer<br />
              privacy@taddam.com<br />
              Montréal, Québec, Canada
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
          <Link href={`/${locale}/terms`} className="text-sm text-brand-600 hover:underline">{t.footer.terms}</Link>
          <Link href={`/${locale}/cookies`} className="text-sm text-brand-600 hover:underline">{t.footer.cookies}</Link>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
