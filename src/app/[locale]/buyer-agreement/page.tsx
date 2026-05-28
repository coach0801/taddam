import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import Footer from '@/components/Footer'

function LegalNav({ locale }: { locale: Locale }) {
  const fr = locale === 'fr'
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
          <Link href={`/${locale}/dashboard`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            {fr ? '← Tableau de bord' : '← Dashboard'}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default function BuyerAgreementPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const fr = locale === 'fr'

  return (
    <div className="min-h-screen bg-white">
      <LegalNav locale={locale} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            {fr ? 'Contrat d\'acheteur' : 'Buyer Agreement'}
          </h1>
          <p className="text-sm text-slate-400">
            {fr ? 'Version 1.0 — En vigueur le 1er juin 2025' : 'Version 1.0 — Effective June 1, 2025'}
          </p>
        </div>

        <div className="mb-8 p-4 bg-brand-50 border border-brand-200 rounded-xl text-sm text-brand-700">
          {fr
            ? 'Ce contrat fait partie intégrante de votre inscription en tant qu\'acheteur sur la plateforme taddam. En créant un compte acheteur, vous acceptez les conditions ci-dessous.'
            : 'This agreement forms part of your registration as a buyer on the taddam platform. By creating a buyer account, you agree to the terms below.'}
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '1. Portée du contrat' : '1. Scope of Agreement'}
            </h2>
            <p>
              {fr
                ? 'Le présent Contrat d\'acheteur (le « Contrat ») est conclu entre taddam.com Inc. (« taddam ») et l\'acheteur inscrit (l\' « Acheteur »). Il régit l\'accès de l\'Acheteur à la plateforme taddam, sa participation aux groupes de demande et son droit d\'accéder aux prix collectifs offerts par les fournisseurs vérifiés.'
                : 'This Buyer Agreement (the "Agreement") is entered into between taddam.com Inc. ("taddam") and the registered buyer (the "Buyer"). It governs the Buyer\'s access to the taddam platform, participation in demand pools, and right to access collective pricing offered by verified suppliers.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '2. Admissibilité des acheteurs' : '2. Buyer Eligibility'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'L\'Acheteur doit être une entreprise ou organisation commerciale légalement constituée au Canada.' : 'The Buyer must be a legally incorporated or registered business or commercial organization in Canada.'}</li>
              <li>{fr ? 'Un numéro d\'entreprise canadien (NE) valide délivré par l\'ARC est requis pour l\'inscription.' : 'A valid Canadian Business Number (BN) issued by the CRA is required for registration.'}</li>
              <li>{fr ? 'Les comptes personnels (non commerciaux) ne sont pas autorisés sur la plateforme taddam.' : 'Personal (non-business) accounts are not permitted on the taddam platform.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '3. Participation aux groupes de demande' : '3. Participation in Demand Pools'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>{fr ? 'Engagement :' : 'Commitment:'}</strong> {fr ? 'Rejoindre un groupe constitue un engagement ferme d\'achat à un prix unitaire égal ou inférieur au prix autorisé, conditionnel à la fermeture réussie du groupe.' : 'Joining a pool constitutes a binding commitment to purchase at a unit price equal to or less than the authorized price, conditional on successful pool closure.'}</li>
              <li><strong>{fr ? 'Autorisation de paiement :' : 'Payment authorization:'}</strong> {fr ? 'En rejoignant un groupe, une retenue d\'autorisation est placée sur votre moyen de paiement pour le montant estimé. Aucun débit n\'est effectué avant la fermeture réussie du groupe.' : 'By joining a pool, an authorization hold is placed on your payment method for the estimated amount. No charge occurs until the pool closes successfully.'}</li>
              <li><strong>{fr ? 'Prix maximum :' : 'Maximum price:'}</strong> {fr ? 'Vous pouvez définir un prix unitaire maximum acceptable. Votre engagement est automatiquement annulé si le prix final dépasse ce montant.' : 'You may set a maximum acceptable unit price. Your commitment is automatically cancelled if the final price exceeds this amount.'}</li>
              <li><strong>{fr ? 'Retrait :' : 'Withdrawal:'}</strong> {fr ? 'Vous pouvez vous retirer d\'un groupe à tout moment avant qu\'il passe à l\'état « Exécution » (généralement 24 heures avant la fermeture). Une fois en exécution, le retrait n\'est pas garanti.' : 'You may withdraw from a pool at any time before it enters "Fulfilling" status (typically 24 hours before closure). Once in fulfilment, withdrawal is not guaranteed.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '4. Paiement et facturation' : '4. Payment and Billing'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'Tous les paiements sont traités par Stripe Payments Canada Ltée., un processeur certifié PCI-DSS niveau 1.' : 'All payments are processed by Stripe Payments Canada Ltd., a PCI-DSS Level 1 certified processor.'}</li>
              <li>{fr ? 'Le montant final facturé est le prix unitaire verrouillé du groupe multiplié par votre quantité engagée, plus les taxes applicables (TPS/TVH/TVP/TVQ) selon votre province de livraison.' : 'The final amount charged is the locked pool unit price multiplied by your committed quantity, plus applicable taxes (GST/HST/PST/QST) based on your ship-to province.'}</li>
              <li>{fr ? 'Une facture conforme à la législation fiscale canadienne est générée automatiquement pour chaque commande réussie.' : 'A tax-compliant invoice is automatically generated for each successful order.'}</li>
              <li>{fr ? 'En cas d\'échec d\'un groupe, votre autorisation de paiement est immédiatement libérée et aucun débit n\'est effectué.' : 'If a pool fails, your payment authorization is immediately released and no charge is made.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '5. Livraison et réception' : '5. Delivery and Receipt'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'Les livraisons sont effectuées à l\'adresse de livraison que vous avez fournie lors de votre participation au groupe.' : 'Deliveries are made to the ship-to address you provided when joining the pool.'}</li>
              <li>{fr ? 'Les délais de livraison estimés sont indiqués dans les détails du groupe et sont fournis par le fournisseur sélectionné. taddam ne garantit pas les dates de livraison.' : 'Estimated delivery timelines are shown in pool details and are provided by the selected supplier. taddam does not guarantee delivery dates.'}</li>
              <li>{fr ? 'Vous êtes responsable d\'inspecter les marchandises à la réception et de signaler tout problème dans les 7 jours.' : 'You are responsible for inspecting goods upon receipt and reporting any issues within 7 days.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '6. Litiges et remboursements' : '6. Disputes and Refunds'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'Les litiges doivent être soumis via la plateforme taddam dans les 7 jours suivant la confirmation de livraison.' : 'Disputes must be submitted through the taddam platform within 7 days of delivery confirmation.'}</li>
              <li>{fr ? 'taddam agira à titre d\'intermédiaire entre l\'Acheteur et le Fournisseur.' : 'taddam will act as intermediary between the Buyer and the Supplier.'}</li>
              <li>{fr ? 'Si le litige n\'est pas résolu dans les 14 jours, taddam rendra une décision finale contraignante.' : 'If unresolved within 14 days, taddam will make a binding final determination.'}</li>
              <li>{fr ? 'Les remboursements approuvés sont traités via le mode de paiement original dans les 5 à 10 jours ouvrables.' : 'Approved refunds are processed to the original payment method within 5–10 business days.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '7. Création de groupes' : '7. Creating Pools'}
            </h2>
            <p>
              {fr
                ? 'Les Acheteurs peuvent créer des groupes de demande pour des produits dans le catalogue taddam. En tant que créateur d\'un groupe, vous vous engagez à : (a) fournir des informations exactes sur les exigences du groupe, (b) participer vous-même au groupe avec une quantité minimale, et (c) ne pas créer de groupes dans l\'intention de les annuler ou de manipuler les prix.'
                : 'Buyers may create demand pools for products in the taddam catalogue. As a pool creator, you commit to: (a) providing accurate pool requirement information, (b) participating in the pool yourself with a minimum quantity, and (c) not creating pools with the intent to cancel or manipulate pricing.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '8. Utilisation acceptable' : '8. Acceptable Use'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'La plateforme taddam est réservée aux achats B2B légitimes pour usage commercial.' : 'The taddam platform is for legitimate B2B purchasing for commercial use only.'}</li>
              <li>{fr ? 'La revente de produits achetés via taddam est autorisée, sauf indication contraire dans les conditions du groupe.' : 'Resale of products purchased through taddam is permitted unless pool terms specify otherwise.'}</li>
              <li>{fr ? 'Il est interdit de créer de faux engagements, de manipuler les prix des groupes ou de vous entendre avec d\'autres participants.' : 'Creating fictitious commitments, manipulating pool pricing, or colluding with other participants is prohibited.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '9. Contact' : '9. Contact'}
            </h2>
            <p>
              {fr
                ? 'Pour toute question concernant le présent Contrat, contactez notre équipe de support à '
                : 'For any questions about this Agreement, contact our support team at '}
              <strong>support@taddam.com</strong>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
          <Link href={`/${locale}/terms`} className="text-sm text-brand-600 hover:underline">
            {fr ? 'Conditions d\'utilisation' : 'Terms of Service'}
          </Link>
          <Link href={`/${locale}/privacy`} className="text-sm text-brand-600 hover:underline">
            {fr ? 'Politique de confidentialité' : 'Privacy Policy'}
          </Link>
        </div>
      </div>

      <Footer locale={locale} />
    </div>
  )
}
