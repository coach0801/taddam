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
            {locale === 'fr' ? '← Retour à l\'accueil' : '← Back to home'}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default function TermsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const fr = locale === 'fr'

  return (
    <div className="min-h-screen bg-white">
      <LegalNav locale={locale} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            {fr ? 'Conditions d\'utilisation' : 'Terms of Service'}
          </h1>
          <p className="text-sm text-slate-400">
            {fr ? 'Version 1.0 — En vigueur le 1er juin 2025' : 'Version 1.0 — Effective June 1, 2025'}
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '1. Acceptation des conditions' : '1. Acceptance of Terms'}
            </h2>
            <p>
              {fr
                ? 'En vous inscrivant ou en utilisant la plateforme taddam.com (la « Plateforme »), vous acceptez d\'être lié par les présentes Conditions d\'utilisation (les « Conditions »). Si vous utilisez la Plateforme au nom d\'une organisation, vous déclarez avoir le pouvoir de lier cette organisation aux présentes Conditions.'
                : 'By registering for or using the taddam.com platform (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Platform on behalf of an organization, you represent that you have authority to bind that organization to these Terms.'}
            </p>
            <p className="mt-2">
              {fr
                ? 'Les présentes Conditions sont régies par les lois de la Province de Québec et les lois fédérales du Canada applicables. Tout litige sera résolu exclusivement devant les tribunaux de Montréal, Québec.'
                : 'These Terms are governed by the laws of the Province of Québec and the federal laws of Canada applicable therein. Any disputes shall be resolved exclusively in the courts of Montréal, Québec.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '2. Admissibilité' : '2. Eligibility'}
            </h2>
            <p>{fr ? 'Pour utiliser taddam en tant qu\'acheteur ou fournisseur, vous devez :' : 'To use taddam as a buyer or supplier, you must:'}</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>{fr ? 'Être une entreprise canadienne légalement constituée avec un numéro d\'entreprise valide à 9 chiffres de l\'Agence du revenu du Canada (NE)' : 'Be a legally registered Canadian business with a valid 9-digit Canada Revenue Agency Business Number (BN)'}</li>
              <li>{fr ? 'Avoir 18 ans ou plus et avoir la capacité juridique de conclure des contrats' : 'Be 18 years of age or older and have legal capacity to enter contracts'}</li>
              <li>{fr ? 'Fournir des informations commerciales exactes et les tenir à jour' : 'Provide accurate business information and maintain it up to date'}</li>
              <li>{fr ? 'Respecter toutes les lois applicables dans votre province et au niveau fédéral' : 'Comply with all applicable laws in your province and federally'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '3. La plateforme taddam' : '3. The taddam Platform'}
            </h2>
            <p>
              {fr
                ? 'taddam exploite une place de marché et une plateforme technologique qui facilite l\'approvisionnement collectif en agrégeant la demande de plusieurs acheteurs et en la faisant correspondre avec les offres de fournisseurs vérifiés. taddam n\'est pas partie à la transaction de vente entre acheteurs et fournisseurs — nous facilitons la transaction et retenons les paiements en fiducie via Stripe.'
                : 'taddam operates as a marketplace and technology platform that facilitates collective procurement by aggregating demand from multiple buyers and matching it with verified supplier offers. taddam is not a party to the sale transaction between buyers and suppliers — we facilitate the transaction and hold payments in escrow via Stripe.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '4. Groupes de demande' : '4. Demand Pools'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{fr ? 'Création d\'un groupe :' : 'Pool creation:'}</strong> {fr ? 'Tout acheteur vérifié peut créer un groupe de demande pour un produit dans le catalogue taddam, en précisant la quantité cible, la quantité minimum, la région de livraison et la date de fermeture.' : 'Any verified buyer may create a demand pool for a product in the taddam catalogue, specifying target quantity, minimum quantity, delivery region, and closing date.'}</li>
              <li><strong>{fr ? 'Participation au groupe :' : 'Pool participation:'}</strong> {fr ? 'Rejoindre un groupe place une retenue d\'autorisation de paiement via Stripe. Vous n\'êtes débité que si le groupe se ferme avec succès et à un prix inférieur ou égal à votre prix maximum spécifié.' : 'Joining a pool places a payment authorization hold via Stripe. You are only charged if the pool closes successfully and at or below your specified maximum price.'}</li>
              <li><strong>{fr ? 'Fermeture du groupe :' : 'Pool closing:'}</strong> {fr ? 'Les groupes se ferment automatiquement à la date spécifiée. Si la quantité minimum n\'est pas atteinte, toutes les retenues de paiement sont libérées et aucun prélèvement n\'est effectué.' : 'Pools close automatically on the specified date. If the minimum quantity is not met, all payment holds are released and no charge is made.'}</li>
              <li><strong>{fr ? 'Garantie de prix :' : 'Price guarantee:'}</strong> {fr ? 'Le prix unitaire ne peut que baisser à mesure que de nouveaux acheteurs rejoignent. Votre paiement est toujours égal ou inférieur au montant autorisé.' : 'The unit price can only decrease as more buyers join. Your payment is always at or below the authorized amount.'}</li>
              <li><strong>{fr ? 'Retrait :' : 'Withdrawal:'}</strong> {fr ? 'Les acheteurs peuvent se retirer d\'un groupe à tout moment avant qu\'il entre en état « Exécution » (généralement 24 heures avant la fermeture).' : 'Buyers may withdraw from a pool at any time before it enters "Fulfilling" state (typically 24 hours before closing).'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '5. Obligations du fournisseur' : '5. Supplier Obligations'}
            </h2>
            <p>{fr ? 'Les fournisseurs vérifiés acceptent de :' : 'Verified suppliers agree to:'}</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>{fr ? 'Exécuter les commandes au prix verrouillé du groupe et dans les délais de livraison convenus' : 'Fulfil orders at the locked pool price and within agreed delivery timelines'}</li>
              <li>{fr ? 'Fournir des descriptions de produits, des quantités et des conditions de livraison exactes' : 'Provide accurate product descriptions, quantities, and delivery terms'}</li>
              <li>{fr ? 'Maintenir une capacité de stock suffisante pour exécuter les volumes engagés dans le groupe' : 'Maintain sufficient inventory capacity to fulfil committed pool volumes'}</li>
              <li>{fr ? 'Utiliser la plateforme taddam pour la gestion des commandes et les mises à jour d\'expédition' : 'Use the taddam platform for order management and shipment updates'}</li>
              <li>{fr ? 'Accepter le paiement via Stripe Connect sous réserve de la commission de taddam' : 'Accept payment via Stripe Connect subject to taddam\'s commission'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '6. Paiements et commission' : '6. Payments and Commission'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'Tous les paiements sont traités par Stripe Payments Canada Ltée.' : 'All payments are processed by Stripe Payments Canada Ltd.'}</li>
              <li>{fr ? 'taddam prélève une commission de plateforme de 5 % de la valeur de la transaction, déduite du versement au fournisseur.' : 'taddam charges a platform commission of 5% of the transaction value, deducted from the supplier payout.'}</li>
              <li>{fr ? 'Les taxes applicables (TPS/TVH/TVP/TVQ) sont calculées en fonction de la province de livraison de l\'acheteur via Stripe Tax.' : 'Applicable taxes (GST/HST/PST/QST) are calculated based on the buyer\'s ship-to province via Stripe Tax.'}</li>
              <li>{fr ? 'Les versements aux fournisseurs sont libérés dans les 7 jours suivant la livraison confirmée, sous réserve de toute retenue en cas de litige actif.' : 'Supplier payouts are released within 7 days of confirmed delivery, subject to any active dispute hold.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '7. Litiges' : '7. Disputes'}
            </h2>
            <p>
              {fr
                ? 'Si vous recevez des marchandises incorrectes, endommagées ou non conformes, vous devez soumettre un litige dans les 7 jours suivant la confirmation de livraison via la plateforme taddam. taddam facilitera la résolution du litige entre l\'acheteur et le fournisseur. Si le litige n\'est pas résolu dans les 14 jours, taddam se réserve le droit de rendre une décision finale, y compris d\'émettre un remboursement complet ou partiel à l\'acheteur ou de libérer les fonds au fournisseur.'
                : 'If you receive incorrect, damaged, or non-conforming goods, you must raise a dispute within 7 days of delivery confirmation through the taddam platform. taddam will facilitate dispute resolution between the buyer and supplier. If unresolved within 14 days, taddam reserves the right to make a final determination, including issuing a full or partial refund to the buyer or releasing funds to the supplier.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '8. Utilisations interdites' : '8. Prohibited Uses'}
            </h2>
            <p>{fr ? 'Vous ne pouvez pas utiliser la Plateforme pour :' : 'You may not use the Platform to:'}</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>{fr ? 'Fournir de fausses informations commerciales ou usurper l\'identité d\'une autre organisation' : 'Provide false business information or impersonate another organization'}</li>
              <li>{fr ? 'Manipuler la tarification des groupes ou vous entendre avec d\'autres participants' : 'Manipulate pool pricing or collude with other participants'}</li>
              <li>{fr ? 'Effectuer des transactions frauduleuses ou blanchir de l\'argent' : 'Engage in fraudulent transactions or money laundering'}</li>
              <li>{fr ? 'Contourner les frais de plateforme par des transactions hors plateforme' : 'Circumvent platform fees through off-platform transactions'}</li>
              <li>{fr ? 'Violer toute loi applicable, y compris le droit de la concurrence' : 'Violate any applicable laws, including competition law'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '9. Limitation de responsabilité' : '9. Limitation of Liability'}
            </h2>
            <p>
              {fr
                ? 'Dans toute la mesure permise par la loi applicable, la responsabilité totale de taddam envers tout utilisateur ne dépassera pas le plus élevé des montants suivants : (a) 500 $ CAD ou (b) la commission totale perçue auprès de cet utilisateur au cours des 12 mois précédant la réclamation. taddam n\'est pas responsable des dommages indirects, accessoires, spéciaux ou consécutifs.'
                : 'To the maximum extent permitted by applicable law, taddam\'s total liability to any user shall not exceed the greater of (a) $500 CAD or (b) the total commission earned from that user in the 12 months preceding the claim. taddam is not liable for indirect, incidental, special, or consequential damages.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '10. Résiliation' : '10. Termination'}
            </h2>
            <p>
              {fr
                ? 'taddam peut suspendre ou résilier votre compte en cas de violation grave des présentes Conditions, d\'activité frauduleuse ou de non-conformité avec la loi applicable. Vous pouvez fermer votre compte à tout moment ; les obligations en cours (y compris les engagements de groupe en attente) survivent à la résiliation.'
                : 'taddam may suspend or terminate your account for material breach of these Terms, fraudulent activity, or failure to comply with applicable law. You may close your account at any time; outstanding obligations (including pending pool commitments) survive termination.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '11. Modifications des Conditions' : '11. Changes to Terms'}
            </h2>
            <p>
              {fr
                ? 'Nous informerons les utilisateurs enregistrés des modifications importantes des présentes Conditions par courriel au moins 30 jours avant leur entrée en vigueur. L\'utilisation continue de la Plateforme après la date d\'entrée en vigueur constitue l\'acceptation des Conditions révisées.'
                : 'We will notify registered users of material changes to these Terms by email at least 30 days before they take effect. Continued use of the Platform after the effective date constitutes acceptance of the revised Terms.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '12. Loi applicable et juridiction' : '12. Governing Law and Jurisdiction'}
            </h2>
            <p>
              {fr
                ? 'Les présentes Conditions sont régies par les lois de la Province de Québec et les lois fédérales du Canada. La Convention des Nations Unies sur les contrats de vente internationale de marchandises ne s\'applique pas. Tout litige découlant des présentes Conditions sera soumis à la compétence exclusive des tribunaux du Québec siégeant à Montréal.'
                : 'These Terms are governed by the laws of the Province of Québec and the federal laws of Canada. The United Nations Convention on Contracts for the International Sale of Goods does not apply. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Québec sitting in Montréal.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '13. Langue' : '13. Language'}
            </h2>
            <p>
              {fr
                ? 'Les présentes Conditions ont été rédigées en français et en anglais. En cas de conflit entre les deux versions, la version française prévaut pour les utilisateurs du Québec, conformément à la Charte de la langue française (Loi 101) et à la Loi modernisant des dispositions législatives en matière de protection des renseignements personnels (Loi 25).'
                : 'These Terms have been drafted in both French and English. In the event of any conflict between the two versions, the French version prevails for users in Québec, in accordance with the Charter of the French Language (Bill 101) and the Act to modernize legislative provisions as regards the protection of personal information (Law 25).'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '14. Contact' : '14. Contact'}
            </h2>
            <p>
              {fr
                ? 'Des questions sur ces Conditions? Contactez-nous à '
                : 'Questions about these Terms? Contact us at '}
              <strong>legal@taddam.com</strong>
              {fr
                ? ' ou écrivez à : taddam.com Inc., Département juridique, Montréal, Québec, Canada.'
                : ' or write to: taddam.com Inc., Legal Department, Montréal, Québec, Canada.'}
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
