import dynamic from 'next/dynamic'
import type { Locale } from '@/lib/i18n'

// Load client-side only — avoids SSR timeout on Netlify free tier
const RegisterContent = dynamic(
  () => import('./RegisterContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
)

export default function RegisterPage({ params }: { params: { locale: Locale } }) {
  return <RegisterContent locale={params.locale} />
}
