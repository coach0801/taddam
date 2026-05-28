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
          <Link href={`/${locale}/supplier`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            {fr ? '← Portail fournisseur' : '← Supplier portal'}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default function SupplierAgreementPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const fr = locale === 'fr'

  return (
    <div className="min-h-screen bg-white">
      <LegalNav locale={locale} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            {fr ? 'Contrat de fournisseur' : 'Supplier Agreement'}
          </h1>
          <p className="text-sm text-slate-400">
            {fr ? 'Version 1.0 — En vigueur le 1er juin 2025' : 'Version 1.0 — Effective June 1, 2025'}
          </p>
        </div>

        <div className="mb-8 p-4 bg-brand-50 border border-brand-200 rounded-xl text-sm text-brand-700">
          {fr
            ? 'Ce contrat fait partie intégrante de votre inscription en tant que fournisseur sur la plateforme taddam. En soumettant une demande de fournisseur, vous acceptez les conditions ci-dessous.'
            : 'This agreement forms part of your registration as a supplier on the taddam platform. By submitting a supplier application, you agree to the terms below.'}
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '1. Portée du contrat' : '1. Scope of Agreement'}
            </h2>
            <p>
              {fr
                ? 'Le présent Contrat de fournisseur (le « Contrat ») est conclu entre taddam.com Inc. (« taddam ») et le fournisseur approuvé (le « Fournisseur »). Il régit l\'accès du Fournisseur à la plateforme d\'approvisionnement collectif taddam et sa participation à celle-ci, y compris la publication d\'offres, l\'exécution des commandes et la réception des paiements.'
                : 'This Supplier Agreement (the "Agreement") is entered into between taddam.com Inc. ("taddam") and the approved supplier (the "Supplier"). It governs the Supplier\'s access to and participation in the taddam collective procurement platform, including publishing offers, fulfilling orders, and receiving payments.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '2. Vérification et approbation' : '2. Verification and Approval'}
            </h2>
            <p>
              {fr
                ? 'L\'accès des fournisseurs est soumis à la vérification par taddam du numéro d\'entreprise (NE) du Fournisseur auprès de l\'Agence du revenu du Canada, de l\'inscription en vertu des lois provinciales sur les ventes applicables, et à la vérification KYC (Know Your Customer) par Stripe Connect pour les virements bancaires. taddam se réserve le droit d\'approuver, de suspendre ou de révoquer l\'accès des fournisseurs à sa seule discrétion.'
                : 'Supplier access is subject to taddam\'s verification of the Supplier\'s Business Number (BN) with the Canada Revenue Agency, registration under applicable provincial sales tax laws, and KYC (Know Your Customer) verification by Stripe Connect for bank payouts. taddam reserves the right to approve, suspend, or revoke supplier access at its sole discretion.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '3. Publication d\'offres' : '3. Publishing Offers'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'Les Fournisseurs peuvent publier des barèmes de prix pour les produits du catalogue taddam approuvés.' : 'Suppliers may publish price ladders for approved taddam catalogue products.'}</li>
              <li>{fr ? 'Toutes les offres doivent inclure : le prix unitaire par palier de quantité, la capacité maximale, les régions de livraison éligibles et la date de validité.' : 'All offers must include: unit price per quantity tier, maximum capacity, eligible delivery regions, and validity date.'}</li>
              <li>{fr ? 'Les prix publiés sont fermes et contraignants pour la durée de validité de l\'offre. Les modifications ne s\'appliquent pas aux groupes dans lesquels votre offre a déjà été engagée.' : 'Published prices are firm and binding for the offer validity period. Modifications do not apply to pools where your offer has already been committed.'}</li>
              <li>{fr ? 'Les Fournisseurs peuvent mettre en pause ou retirer des offres à tout moment, sous réserve des engagements existants.' : 'Suppliers may pause or withdraw offers at any time, subject to existing commitments.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '4. Exécution des commandes' : '4. Order Fulfilment'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'Lors de la fermeture réussie d\'un groupe, le Fournisseur recevra un manifeste de commande détaillant les adresses de livraison, les quantités et les conditions.' : 'Upon successful pool closure, the Supplier will receive an order manifest detailing delivery addresses, quantities, and terms.'}</li>
              <li>{fr ? 'La livraison doit être effectuée dans le délai indiqué dans l\'offre (par défaut 10 jours ouvrables).' : 'Delivery must be completed within the timeframe stated in the offer (default 10 business days).'}</li>
              <li>{fr ? 'Les Fournisseurs doivent mettre à jour le statut d\'expédition et les numéros de suivi via la plateforme taddam.' : 'Suppliers must update shipment status and tracking numbers through the taddam platform.'}</li>
              <li>{fr ? 'Le non-respect des délais de livraison sans préavis peut entraîner la suspension du compte et l\'engagement de la responsabilité envers les acheteurs affectés.' : 'Failure to meet delivery timelines without prior notice may result in account suspension and liability to affected buyers.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '5. Paiements et virements' : '5. Payments and Payouts'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'Les paiements sont traités par Stripe Connect. Les Fournisseurs doivent compléter la vérification Stripe avant de recevoir les fonds.' : 'Payments are processed through Stripe Connect. Suppliers must complete Stripe verification before receiving funds.'}</li>
              <li>{fr ? 'taddam déduit une commission de plateforme de 5 % avant de virer les fonds au Fournisseur.' : 'taddam deducts a platform commission of 5% before transferring funds to the Supplier.'}</li>
              <li>{fr ? 'Les virements sont initiés dans les 7 jours suivant la confirmation de livraison, sous réserve de la fenêtre de litige de 7 jours.' : 'Payouts are initiated within 7 days of delivery confirmation, subject to the 7-day dispute window.'}</li>
              <li>{fr ? 'Les virements peuvent être retenus en cas de litige actif ou de violation du présent Contrat.' : 'Payouts may be withheld in case of active dispute or breach of this Agreement.'}</li>
              <li>{fr ? 'Les Fournisseurs sont responsables de la déclaration et du paiement de leurs propres impôts sur les revenus perçus via la plateforme.' : 'Suppliers are responsible for reporting and paying their own taxes on income received through the platform.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '6. Normes de qualité et conformité' : '6. Quality Standards and Compliance'}
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>{fr ? 'Tous les produits doivent respecter les normes canadiennes applicables (CSA, UL, SCC) et les exigences réglementaires provinciales.' : 'All products must comply with applicable Canadian standards (CSA, UL, SCC) and provincial regulatory requirements.'}</li>
              <li>{fr ? 'Les Fournisseurs sont responsables de la conformité aux lois sur la sécurité des produits, aux réglementations douanières pour les importations et aux obligations d\'étiquetage bilingue en vertu de la Loi sur l\'emballage et l\'étiquetage des produits de consommation.' : 'Suppliers are responsible for compliance with product safety laws, customs regulations for imports, and bilingual labelling obligations under the Consumer Packaging and Labelling Act.'}</li>
              <li>{fr ? 'taddam peut exiger des certifications ou la preuve de conformité à tout moment.' : 'taddam may require certificates or proof of compliance at any time.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '7. Résolution des litiges' : '7. Dispute Resolution'}
            </h2>
            <p>
              {fr
                ? 'En cas de litige entre un acheteur et un Fournisseur, taddam agira à titre d\'intermédiaire. Si le litige n\'est pas résolu dans les 14 jours, taddam se réserve le droit de prendre une décision finale contraignante sur l\'allocation des fonds. Les Fournisseurs reconnaissent que la décision de taddam est définitive et sans appel dans les limites de la plateforme.'
                : 'In case of dispute between a buyer and a Supplier, taddam will act as intermediary. If the dispute is not resolved within 14 days, taddam reserves the right to make a binding final decision on fund allocation. Suppliers acknowledge that taddam\'s determination is final and non-appealable within the platform.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '8. Confidentialité' : '8. Confidentiality'}
            </h2>
            <p>
              {fr
                ? 'Les Fournisseurs acceptent de traiter comme confidentielles toutes les informations relatives aux acheteurs (y compris les adresses de livraison, les quantités de commande et les coordonnées) et de ne les utiliser qu\'aux fins de l\'exécution des commandes passées via taddam. Ces informations ne peuvent pas être utilisées pour contacter directement les acheteurs en dehors de la plateforme ou à des fins de marketing.'
                : 'Suppliers agree to treat all buyer information (including delivery addresses, order quantities, and contact details) as confidential and to use it only for fulfilling orders placed through taddam. Such information may not be used to contact buyers directly outside the platform or for marketing purposes.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '9. Résiliation' : '9. Termination'}
            </h2>
            <p>
              {fr
                ? 'L\'un ou l\'autre des partis peut résilier le présent Contrat avec un préavis de 30 jours. taddam peut résilier immédiatement en cas de : fraude ou fausse déclaration, incapacité répétée à exécuter les commandes, violation des lois sur la sécurité des produits, ou comportement nuisant à la réputation de la plateforme. Les obligations en cours (y compris les groupes en cours d\'exécution) survivent à la résiliation.'
                : 'Either party may terminate this Agreement with 30 days\' written notice. taddam may terminate immediately upon: fraud or misrepresentation, repeated failure to fulfil orders, violation of product safety laws, or conduct harmful to platform reputation. Outstanding obligations (including pools in fulfillment) survive termination.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '10. Contact' : '10. Contact'}
            </h2>
            <p>
              {fr
                ? 'Pour toute question concernant le présent Contrat, contactez notre équipe des partenariats fournisseurs à '
                : 'For any questions about this Agreement, contact our supplier partnerships team at '}
              <strong>suppliers@taddam.com</strong>.
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
