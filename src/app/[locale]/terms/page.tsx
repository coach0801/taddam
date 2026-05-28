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

export default function TermsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const updated = locale === 'fr' ? 'Dernière mise à jour : 1er janvier 2025' : 'Last updated: January 1, 2025'

  return (
    <div className="min-h-screen bg-white">
      <LegalNav locale={locale} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{t.footer.terms}</h1>
          <p className="text-sm text-slate-400">{updated}</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By registering for or using the taddam.com platform (&ldquo;Platform&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you are using the Platform on behalf of an organization, you represent that you have authority to bind that organization to these Terms.
            </p>
            <p className="mt-2">
              These Terms are governed by the laws of the Province of Québec and the federal laws of Canada applicable therein. Any disputes shall be resolved exclusively in the courts of Montréal, Québec.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Eligibility</h2>
            <p>To use taddam as a buyer or supplier, you must:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Be a legally registered Canadian business with a valid 9-digit Canada Revenue Agency Business Number (BN)</li>
              <li>Be 18 years of age or older and have legal capacity to enter contracts</li>
              <li>Provide accurate business information and maintain it up to date</li>
              <li>Comply with all applicable laws in your province and federally</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. The taddam Platform</h2>
            <p>
              taddam operates as a marketplace and technology platform that facilitates collective procurement by aggregating demand from multiple buyers and matching it with verified supplier offers. taddam is not a party to the sale transaction between buyers and suppliers — we facilitate the transaction and hold payments in escrow via Stripe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Demand Pools</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Pool creation:</strong> Any verified buyer may create a demand pool for a product in the taddam catalogue, specifying target quantity, minimum quantity, delivery region, and closing date</li>
              <li><strong>Pool participation:</strong> Joining a pool places a payment authorization hold via Stripe. You are only charged if the pool closes successfully and at or below your specified maximum price</li>
              <li><strong>Pool closing:</strong> Pools close automatically on the specified date. If the minimum quantity is not met, all payment holds are released and no charge is made</li>
              <li><strong>Price guarantee:</strong> The unit price can only decrease as more buyers join. Your payment is always at or below the authorized amount</li>
              <li><strong>Withdrawal:</strong> Buyers may withdraw from a pool at any time before it enters &ldquo;Locking&rdquo; state (typically 24 hours before closing)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Supplier Obligations</h2>
            <p>Verified suppliers agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Fulfil orders at the locked pool price and within agreed delivery timelines</li>
              <li>Provide accurate product descriptions, quantities, and delivery terms</li>
              <li>Maintain sufficient inventory capacity to fulfil committed pool volumes</li>
              <li>Use the taddam platform for order management and shipment updates</li>
              <li>Accept payment via Stripe Connect subject to taddam&rsquo;s commission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Payments and Commission</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All payments are processed by Stripe Payments Canada Ltd.</li>
              <li>taddam charges a platform commission of 3%–8% of the transaction value, deducted from the supplier payout</li>
              <li>Applicable taxes (GST/HST/PST/QST) are calculated based on the buyer&rsquo;s ship-to province via Stripe Tax</li>
              <li>Supplier payouts are released within 7 days of confirmed delivery, subject to any active dispute hold</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Disputes</h2>
            <p>
              If you receive incorrect, damaged, or non-conforming goods, you must raise a dispute within 7 days of delivery confirmation through the taddam platform. taddam will facilitate dispute resolution between the buyer and supplier. If unresolved within 14 days, taddam reserves the right to make a final determination, including issuing a full or partial refund to the buyer or releasing funds to the supplier.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Prohibited Uses</h2>
            <p>You may not use the Platform to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Provide false business information or impersonate another organization</li>
              <li>Manipulate pool pricing or collude with other participants</li>
              <li>Engage in fraudulent transactions or money laundering</li>
              <li>Circumvent platform fees through off-platform transactions</li>
              <li>Violate any applicable laws, including competition law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, taddam&rsquo;s total liability to any user shall not exceed the greater of (a) $500 CAD or (b) the total commission earned from that user in the 12 months preceding the claim. taddam is not liable for indirect, incidental, special, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Termination</h2>
            <p>
              taddam may suspend or terminate your account for material breach of these Terms, fraudulent activity, or failure to comply with applicable law. You may close your account at any time; outstanding obligations (including pending pool commitments) survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. Changes to Terms</h2>
            <p>
              We will notify registered users of material changes to these Terms by email at least 30 days before they take effect. Continued use of the Platform after the effective date constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">12. Contact</h2>
            <p>
              Questions about these Terms? Contact us at <strong>legal@taddam.com</strong> or write to:
              taddam.com Inc., Legal Department, Montréal, Québec, Canada.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
          <Link href={`/${locale}/privacy`} className="text-sm text-brand-600 hover:underline">{t.footer.privacy}</Link>
          <Link href={`/${locale}/cookies`} className="text-sm text-brand-600 hover:underline">{t.footer.cookies}</Link>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
