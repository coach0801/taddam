'use client'

import { useEffect, useState } from 'react'
import { type Locale } from '@/lib/i18n'
import { type Pool } from '@/lib/mock-data'
import PoolDetailContent from '@/components/PoolDetailContent'

const CATEGORY_EMOJI: Record<string, string> = {
  'Automotive': '🚗',
  'Food Service': '🍽️',
  'PPE': '🦺',
  'Cleaning': '🧹',
  'Construction': '🏗️',
  'Retail & Office': '🏪',
}

function mapApiPoolToPool(raw: any, locale: string): Pool {
  const tiers = (raw.tiers as Array<{ minQty: number; unitPrice: number }>) ?? []
  const sorted = [...tiers].sort((a, b) => a.minQty - b.minQty)

  const mappedTiers = sorted.map((tier, i) => ({
    id: `t${i + 1}`,
    minQty: tier.minQty,
    maxQty: i < sorted.length - 1 ? sorted[i + 1].minQty - 1 : null,
    unitPrice: tier.unitPrice,
  }))

  const skuName = locale === 'fr' && raw.sku?.nameFr ? raw.sku.nameFr : (raw.sku?.nameEn ?? '')
  const category = raw.sku?.category ?? 'Other'
  const imageEmoji = CATEGORY_EMOJI[category] ?? '📦'
  const minimumQty = sorted[0]?.minQty ?? 1

  return {
    id: raw.id,
    skuId: raw.skuId,
    skuName,
    skuCategory: category,
    skuUnit: raw.sku?.unit ?? 'unit',
    creatorOrg: raw.supplier?.companyName ?? '',
    targetQty: raw.targetQty,
    minimumQty,
    committedQty: raw.committedQty,
    region: raw.region,
    closesAt: typeof raw.closesAt === 'string' ? raw.closesAt : new Date(raw.closesAt).toISOString(),
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date(raw.createdAt).toISOString(),
    state: raw.status,
    participantCount: raw.participantCount,
    imageEmoji,
    soloPrice: raw.sku?.soloPrice ?? 0,
    offer: {
      id: `offer-${raw.id}`,
      supplierName: raw.supplier?.companyName ?? '',
      supplierRating: 4.7,
      skuId: raw.skuId,
      regions: [raw.region],
      capacity: raw.targetQty,
      validTo: raw.closesAt
        ? (typeof raw.closesAt === 'string' ? raw.closesAt.slice(0, 10) : new Date(raw.closesAt).toISOString().slice(0, 10))
        : '',
      deliveryTerms: 'Delivery included. Lead time 5–7 business days.',
      tiers: mappedTiers,
    },
  }
}

export default function PoolDetailPage({ params }: { params: { locale: Locale; id: string } }) {
  const { locale, id } = params
  const [pool, setPool] = useState<Pool | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/pools/${id}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true)
          return
        }
        const data = await res.json()
        const raw = data.pool
        setPool(mapApiPoolToPool(raw, locale))
      })
      .catch(() => setNotFound(true))
  }, [id, locale])

  if (notFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Pool not found</h1>
          <p className="text-slate-500">This pool may have been removed or does not exist.</p>
        </div>
      </div>
    )
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
          <p className="text-sm text-slate-500">Loading pool...</p>
        </div>
      </div>
    )
  }

  return <PoolDetailContent locale={locale} pool={pool} />
}
