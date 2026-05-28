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

export default function PrivacyPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params
  const t = getTranslation(locale)
  const fr = locale === 'fr'

  return (
    <div className="min-h-screen bg-white">
      <LegalNav locale={locale} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{t.footer.privacy}</h1>
          <p className="text-sm text-slate-400">
            {fr ? 'Version 1.0 — En vigueur le 1er juin 2025' : 'Version 1.0 — Effective June 1, 2025'}
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '1. Introduction' : '1. Introduction'}
            </h2>
            <p>
              {fr
                ? 'taddam.com Inc. (« taddam », « nous », « notre ») exploite la plateforme d\'approvisionnement collectif taddam.com. La présente Politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons les renseignements personnels des utilisateurs de notre plateforme conformément à la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE), à la Loi 25 du Québec et à la législation provinciale applicable sur la protection de la vie privée.'
                : 'taddam.com Inc. ("taddam", "we", "us", or "our") operates the taddam.com collective procurement platform. This Privacy Policy explains how we collect, use, disclose, and protect personal information about users of our platform in accordance with the Personal Information Protection and Electronic Documents Act (PIPEDA), Québec Law 25, and applicable provincial privacy legislation.'}
            </p>
            <p className="mt-2">
              {fr
                ? 'Notre responsable de la protection des renseignements personnels peut être contacté à privacy@taddam.com. Nous répondons à toutes les demandes dans les 30 jours suivant leur réception.'
                : 'Our Privacy Officer can be reached at privacy@taddam.com. We respond to all requests within 30 days of receipt.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '2. Renseignements que nous collectons' : '2. Information We Collect'}
            </h2>
            <p>{fr ? 'Nous collectons les catégories suivantes de renseignements personnels :' : 'We collect the following categories of personal information:'}</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>{fr ? 'Informations d\'identité :' : 'Identity information:'}</strong> {fr ? 'Prénom, nom, nom de l\'entreprise et numéro d\'entreprise canadien (NE)' : 'First name, last name, business name, and Canadian Business Number (BN)'}</li>
              <li><strong>{fr ? 'Coordonnées :' : 'Contact information:'}</strong> {fr ? 'Adresse courriel professionnelle, adresse commerciale et numéro de téléphone' : 'Work email address, business address, and telephone number'}</li>
              <li><strong>{fr ? 'Identifiants de compte :' : 'Account credentials:'}</strong> {fr ? 'Mot de passe haché (nous ne stockons jamais les mots de passe en clair)' : 'Hashed password (we never store plaintext passwords)'}</li>
              <li><strong>{fr ? 'Données de transaction :' : 'Transaction data:'}</strong> {fr ? 'Historique des achats, dossiers de participation aux groupes et références d\'autorisation de paiement' : 'Purchase history, pool participation records, and payment authorization references'}</li>
              <li><strong>{fr ? 'Données techniques :' : 'Technical data:'}</strong> {fr ? 'Adresse IP, type de navigateur, identifiants d\'appareils et journaux d\'utilisation' : 'IP address, browser type, device identifiers, and usage logs'}</li>
              <li><strong>{fr ? 'Communications :' : 'Communications:'}</strong> {fr ? 'Messages envoyés via la plateforme, tickets d\'assistance et communications de litige' : 'Messages sent through the platform, support tickets, and dispute communications'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '3. Comment nous utilisons vos renseignements' : '3. How We Use Your Information'}
            </h2>
            <p>{fr ? 'Nous utilisons vos renseignements personnels pour :' : 'We use your personal information to:'}</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>{fr ? 'Créer et gérer votre compte et votre profil organisationnel' : 'Create and manage your account and organizational profile'}</li>
              <li>{fr ? 'Traiter les participations aux groupes, les autorisations de paiement et l\'exécution des commandes' : 'Process pool participations, payment authorizations, and order fulfilment'}</li>
              <li>{fr ? 'Vérifier le numéro d\'entreprise et l\'inscription provinciale de votre organisation' : 'Verify your organization\'s business number and provincial registration'}</li>
              <li>{fr ? 'Envoyer des notifications transactionnelles (mises à jour de l\'état du groupe, suivi des expéditions, factures)' : 'Send transactional notifications (pool status updates, shipment tracking, invoices)'}</li>
              <li>{fr ? 'Calculer et remettre les TPS/TVH/TVP/TVQ correctes en fonction de votre province de livraison' : 'Calculate and remit correct GST/HST/PST/QST based on your ship-to province'}</li>
              <li>{fr ? 'Détecter et prévenir les fraudes, abus et accès non autorisés aux comptes' : 'Detect and prevent fraud, abuse, and unauthorized account access'}</li>
              <li>{fr ? 'Respecter les obligations légales et réglementaires' : 'Comply with legal and regulatory obligations'}</li>
              <li>{fr ? 'Améliorer notre plateforme grâce à des analyses agrégées (anonymisées)' : 'Improve our platform through aggregate analytics (anonymized)'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '4. Comment nous partageons vos renseignements' : '4. How We Share Your Information'}
            </h2>
            <p>{fr ? 'Nous ne vendons pas vos renseignements personnels. Nous les partageons uniquement dans les circonstances suivantes :' : 'We do not sell your personal information. We share it only in the following circumstances:'}</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>{fr ? 'Avec les fournisseurs :' : 'With suppliers:'}</strong> {fr ? 'Lorsqu\'un groupe se ferme, les fournisseurs vérifiés reçoivent les adresses de livraison et les quantités de commande des acheteurs nécessaires à l\'exécution — uniquement les informations minimales requises.' : 'When a pool closes, verified suppliers receive buyer shipping addresses and order quantities necessary for fulfilment — only the minimum information required.'}</li>
              <li><strong>{fr ? 'Avec Stripe Inc. :' : 'With Stripe Inc.:'}</strong> {fr ? 'Pour le traitement des paiements via Stripe Payments Canada Ltée., un processeur certifié PCI-DSS niveau 1. La propre politique de confidentialité de Stripe s\'applique aux données qu\'il détient.' : 'For payment processing via Stripe Payments Canada Ltd., a PCI-DSS Level 1 certified processor. Stripe\'s own privacy policy applies to data they hold.'}</li>
              <li><strong>{fr ? 'Avec les prestataires de services :' : 'With service providers:'}</strong> {fr ? 'Hébergement cloud (centres de données canadiens), livraison de courriels et détection de fraude — tous liés par des accords de confidentialité.' : 'Cloud hosting (Canadian data centres), email delivery, and fraud detection — all bound by confidentiality agreements.'}</li>
              <li><strong>{fr ? 'Pour la conformité légale :' : 'For legal compliance:'}</strong> {fr ? 'Lorsque requis par la loi applicable, une ordonnance du tribunal ou une autorité réglementaire.' : 'Where required by applicable law, court order, or regulatory authority.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '5. Résidence des données' : '5. Data Residency'}
            </h2>
            <p>
              {fr
                ? 'Toutes les données personnelles sont stockées sur des serveurs situés au Canada (régions Microsoft Azure Canada Centre et Canada Est). Nous ne transférons pas de renseignements personnels hors du Canada, sauf lorsque cela est explicitement nécessaire pour le traitement des paiements via l\'infrastructure mondiale de Stripe, sous réserve de garanties appropriées pour le transfert de données.'
                : 'All personal data is stored on servers located in Canada (Microsoft Azure Canada Central and Canada East regions). We do not transfer personal information outside Canada except where explicitly required for payment processing through Stripe\'s global infrastructure, subject to appropriate data transfer safeguards.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '6. Conservation des données' : '6. Data Retention'}
            </h2>
            <p>
              {fr
                ? 'Nous conservons les renseignements personnels aussi longtemps que votre compte est actif et jusqu\'à 7 ans après la fermeture du compte pour nous conformer aux obligations fiscales et commerciales canadiennes en matière de tenue de dossiers. Les dossiers de transactions peuvent être conservés plus longtemps lorsque la loi l\'exige.'
                : 'We retain personal information for as long as your account is active and for up to 7 years following account closure to comply with Canadian tax and commercial record-keeping obligations. Transaction records may be retained for longer periods where required by law.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '7. Vos droits' : '7. Your Rights'}
            </h2>
            <p>{fr ? 'Vous avez le droit de :' : 'You have the right to:'}</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>{fr ? 'Accéder aux renseignements personnels que nous détenons à votre sujet' : 'Access the personal information we hold about you'}</li>
              <li>{fr ? 'Corriger des informations inexactes ou incomplètes' : 'Correct inaccurate or incomplete information'}</li>
              <li>{fr ? 'Demander la suppression de votre compte et des données associées (sous réserve des exigences légales de conservation)' : 'Request deletion of your account and associated data (subject to legal retention requirements)'}</li>
              <li>{fr ? 'Retirer votre consentement pour les utilisations facultatives de vos données' : 'Withdraw consent for optional uses of your data'}</li>
              <li>{fr ? 'Recevoir vos données dans un format portable et structuré' : 'Receive your data in a portable, structured format'}</li>
              <li>{fr ? 'Déposer une plainte auprès du Commissariat à la protection de la vie privée du Canada (CPVP) ou de la Commission d\'accès à l\'information du Québec (CAI)' : 'Lodge a complaint with the Office of the Privacy Commissioner of Canada (OPC) or the Commission d\'accès à l\'information du Québec (CAI)'}</li>
            </ul>
            <p className="mt-3">
              {fr
                ? 'Pour exercer vos droits, contactez notre responsable de la protection des renseignements personnels à '
                : 'To exercise your rights, contact our Privacy Officer at '}
              <strong>privacy@taddam.com</strong>
              {fr ? '. Nous répondrons dans les 30 jours.' : '. We will respond within 30 days.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '8. Sécurité' : '8. Security'}
            </h2>
            <p>
              {fr
                ? 'Nous mettons en œuvre des mesures de sécurité conformes aux normes de l\'industrie, notamment le chiffrement AES-256 au repos, TLS 1.3 en transit, l\'authentification multifacteur pour l\'accès administratif, des tests de pénétration trimestriels par des tiers et des contrôles d\'audit SOC 2 Type II. Aucune donnée de carte de paiement n\'est stockée sur nos serveurs — tout le traitement des paiements est délégué à Stripe.'
                : 'We implement industry-standard security measures including AES-256 encryption at rest, TLS 1.3 in transit, multi-factor authentication for administrative access, quarterly third-party penetration testing, and SOC 2 Type II audit controls. No payment card data is stored on our servers — all payment processing is delegated to Stripe.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '9. Témoins (cookies)' : '9. Cookies'}
            </h2>
            <p>
              {fr
                ? 'Nous utilisons des témoins essentiels requis pour le fonctionnement de la plateforme et des témoins d\'analyse facultatifs. Voir notre '
                : 'We use essential cookies required for platform operation and optional analytics cookies. See our '}
              <Link href={`/${locale}/cookies`} className="text-brand-600 hover:underline">
                {fr ? 'Politique des témoins' : 'Cookie Policy'}
              </Link>
              {fr ? ' pour plus de détails.' : ' for details.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '10. Modifications de cette politique' : '10. Changes to This Policy'}
            </h2>
            <p>
              {fr
                ? 'Nous vous informerons de toute modification importante à cette Politique de confidentialité par courriel au moins 30 jours avant leur entrée en vigueur. La date de « dernière mise à jour » en haut de cette page sera révisée. Votre utilisation continue de la Plateforme après toute modification constitue votre acceptation de la Politique de confidentialité révisée.'
                : 'We will notify you of any material changes to this Privacy Policy by email at least 30 days before they take effect. The "last updated" date at the top of this page will be revised. Your continued use of the Platform after any changes constitutes your acceptance of the revised Privacy Policy.'}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              {fr ? '11. Contact' : '11. Contact'}
            </h2>
            <p>
              {fr ? 'Notre responsable de la protection des renseignements personnels peut être joint à :' : 'Our Privacy Officer can be reached at:'}
            </p>
            <address className="not-italic mt-2 space-y-0.5">
              <p><strong>taddam.com Inc.</strong></p>
              <p>{fr ? 'Responsable de la protection des renseignements personnels' : 'Privacy Officer'}</p>
              <p>privacy@taddam.com</p>
              <p>{fr ? 'Montréal, Québec, Canada' : 'Montréal, Québec, Canada'}</p>
            </address>
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
