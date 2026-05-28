export type PoolStatus = 'OPEN' | 'LOCKING' | 'SUCCEEDED' | 'FULFILLING' | 'COMPLETED' | 'FAILED' | 'DISPUTED'
export type ShipmentStatus = 'pending' | 'in_transit' | 'delivered' | 'exception'
export type OrgType = 'buyer' | 'supplier'
export type OrgStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export interface PriceTier {
  id: string
  minQty: number
  maxQty: number | null
  unitPrice: number
}

export interface SupplierOffer {
  id: string
  supplierName: string
  supplierRating: number
  skuId: string
  regions: string[]
  capacity: number
  validTo: string
  deliveryTerms: string
  tiers: PriceTier[]
}

export interface Pool {
  id: string
  skuId: string
  skuName: string
  skuCategory: string
  skuUnit: string
  creatorOrg: string
  targetQty: number
  minimumQty: number
  committedQty: number
  region: string
  closesAt: string
  createdAt: string
  state: PoolStatus
  lockedUnitPrice?: number
  participantCount: number
  offer: SupplierOffer
  imageEmoji: string
  soloPrice: number
}

export interface Participation {
  id: string
  poolId: string
  buyerOrg: string
  quantity: number
  shipTo: string
  status: string
}

export interface Order {
  id: string
  poolId: string
  poolName: string
  skuName: string
  quantity: number
  unitPrice: number
  taxAmount: number
  commissionAmount: number
  total: number
  status: PoolStatus
  shipmentStatus: ShipmentStatus
  trackingNumber?: string
  createdAt: string
  deliveredAt?: string
}

export const PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
]

export const REGIONS = [
  'Quebec',
  'Ontario',
  'British Columbia',
  'Alberta',
  'Prairies',
  'Atlantic Canada',
  'National',
]

export const CATEGORIES = [
  { id: 'auto', nameEn: 'Automotive', nameFr: 'Automobile', icon: '🚗' },
  { id: 'construction', nameEn: 'Construction', nameFr: 'Construction', icon: '🏗️' },
  { id: 'restaurant', nameEn: 'Food Service', nameFr: 'Restauration', icon: '🍽️' },
  { id: 'retail', nameEn: 'Retail & Office', nameFr: 'Commerce et bureau', icon: '🏪' },
]

export const MOCK_SKUS = [
  { id: 'sku-001', nameEn: '205/55R16 All-Season Tire — Brand X', nameFr: 'Pneu toutes saisons 205/55R16 — Marque X', categoryId: 'auto', unit: 'unit', soloPrice: 145 },
  { id: 'sku-002', nameEn: 'Level 5 Cut-Resistant Gloves (L)', nameFr: 'Gants anti-coupure niveau 5 (G)', categoryId: 'construction', unit: 'pair', soloPrice: 6.80 },
  { id: 'sku-003', nameEn: 'Kraft Paper Takeout Box 9" (case of 200)', nameFr: 'Boîte repas kraft 9 po (caisse de 200)', categoryId: 'restaurant', unit: 'case', soloPrice: 38.50 },
  { id: 'sku-004', nameEn: 'Industrial Cleaning Concentrate 20L', nameFr: 'Concentré de nettoyage industriel 20 L', categoryId: 'retail', unit: 'pail', soloPrice: 89 },
  { id: 'sku-005', nameEn: '10.5mm Galvanized Deck Screw 5 lb Box', nameFr: 'Vis à terrasse galvanisée 10,5 mm boîte de 5 lb', categoryId: 'construction', unit: 'box', soloPrice: 24 },
  { id: 'sku-006', nameEn: 'Synthetic Motor Oil 5W-30 4L (case of 6)', nameFr: 'Huile moteur synthétique 5W-30 4 L (caisse de 6)', categoryId: 'auto', unit: 'case', soloPrice: 168 },
]

export const MOCK_OFFERS: SupplierOffer[] = [
  {
    id: 'offer-001',
    supplierName: 'Pacific Parts Distribution',
    supplierRating: 4.8,
    skuId: 'sku-001',
    regions: ['British Columbia', 'Alberta', 'National'],
    capacity: 2000,
    validTo: '2025-08-31',
    deliveryTerms: 'Delivery included on orders ≥ 100 units. Lead time 5–7 business days.',
    tiers: [
      { id: 't1', minQty: 1, maxQty: 99, unitPrice: 118 },
      { id: 't2', minQty: 100, maxQty: 249, unitPrice: 98 },
      { id: 't3', minQty: 250, maxQty: 499, unitPrice: 82 },
      { id: 't4', minQty: 500, maxQty: null, unitPrice: 67 },
    ],
  },
  {
    id: 'offer-002',
    supplierName: 'CanSafe Supply Co.',
    supplierRating: 4.6,
    skuId: 'sku-002',
    regions: ['Ontario', 'Quebec', 'National'],
    capacity: 10000,
    validTo: '2025-09-30',
    deliveryTerms: 'Free shipping on orders ≥ 500 pairs. Lead time 3–5 days.',
    tiers: [
      { id: 't1', minQty: 1, maxQty: 199, unitPrice: 5.80 },
      { id: 't2', minQty: 200, maxQty: 499, unitPrice: 4.60 },
      { id: 't3', minQty: 500, maxQty: 999, unitPrice: 3.90 },
      { id: 't4', minQty: 1000, maxQty: null, unitPrice: 3.10 },
    ],
  },
  {
    id: 'offer-003',
    supplierName: 'GreenPack Solutions',
    supplierRating: 4.9,
    skuId: 'sku-003',
    regions: ['Quebec', 'Ontario', 'Atlantic Canada'],
    capacity: 5000,
    validTo: '2025-07-31',
    deliveryTerms: 'Delivery included. Lead time 4–6 business days.',
    tiers: [
      { id: 't1', minQty: 1, maxQty: 49, unitPrice: 34.50 },
      { id: 't2', minQty: 50, maxQty: 149, unitPrice: 28.00 },
      { id: 't3', minQty: 150, maxQty: 299, unitPrice: 23.50 },
      { id: 't4', minQty: 300, maxQty: null, unitPrice: 19.00 },
    ],
  },
]

export const MOCK_POOLS: Pool[] = [
  {
    id: 'pool-001',
    skuId: 'sku-001',
    skuName: '205/55R16 All-Season Tire — Brand X',
    skuCategory: 'Automotive',
    skuUnit: 'unit',
    creatorOrg: 'Atelier Tremblay Auto',
    targetQty: 500,
    minimumQty: 100,
    committedQty: 287,
    region: 'Quebec',
    closesAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    state: 'OPEN',
    participantCount: 14,
    offer: MOCK_OFFERS[0],
    imageEmoji: '🚗',
    soloPrice: 145,
  },
  {
    id: 'pool-002',
    skuId: 'sku-002',
    skuName: 'Level 5 Cut-Resistant Gloves (L)',
    skuCategory: 'Construction',
    skuUnit: 'pair',
    creatorOrg: 'Kowalski Construction',
    targetQty: 1000,
    minimumQty: 200,
    committedQty: 156,
    region: 'Ontario',
    closesAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    state: 'OPEN',
    participantCount: 8,
    offer: MOCK_OFFERS[1],
    imageEmoji: '🏗️',
    soloPrice: 6.80,
  },
  {
    id: 'pool-003',
    skuId: 'sku-003',
    skuName: 'Kraft Paper Takeout Box 9" (case of 200)',
    skuCategory: 'Food Service',
    skuUnit: 'case',
    creatorOrg: 'La Cuisine du Marché',
    targetQty: 300,
    minimumQty: 50,
    committedQty: 241,
    region: 'Quebec',
    closesAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    state: 'OPEN',
    participantCount: 22,
    offer: MOCK_OFFERS[2],
    imageEmoji: '🍽️',
    soloPrice: 38.50,
  },
  {
    id: 'pool-004',
    skuId: 'sku-005',
    skuName: '10.5mm Galvanized Deck Screw 5 lb Box',
    skuCategory: 'Construction',
    skuUnit: 'box',
    creatorOrg: 'BuildRight Supplies',
    targetQty: 800,
    minimumQty: 150,
    committedQty: 412,
    region: 'Alberta',
    closesAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    state: 'OPEN',
    participantCount: 19,
    offer: {
      id: 'offer-004',
      supplierName: 'Prairie Fasteners Ltd.',
      supplierRating: 4.5,
      skuId: 'sku-005',
      regions: ['Alberta', 'Prairies'],
      capacity: 5000,
      validTo: '2025-08-15',
      deliveryTerms: 'Flat-rate shipping $15. Lead time 3–4 days.',
      tiers: [
        { id: 't1', minQty: 1, maxQty: 149, unitPrice: 22.00 },
        { id: 't2', minQty: 150, maxQty: 399, unitPrice: 18.50 },
        { id: 't3', minQty: 400, maxQty: 799, unitPrice: 15.00 },
        { id: 't4', minQty: 800, maxQty: null, unitPrice: 12.00 },
      ],
    },
    imageEmoji: '🔩',
    soloPrice: 24,
  },
  {
    id: 'pool-005',
    skuId: 'sku-006',
    skuName: 'Synthetic Motor Oil 5W-30 4L (case of 6)',
    skuCategory: 'Automotive',
    skuUnit: 'case',
    creatorOrg: 'Garage Express Auto',
    targetQty: 400,
    minimumQty: 80,
    committedQty: 68,
    region: 'British Columbia',
    closesAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    state: 'OPEN',
    participantCount: 5,
    offer: {
      id: 'offer-005',
      supplierName: 'Pacific Parts Distribution',
      supplierRating: 4.8,
      skuId: 'sku-006',
      regions: ['British Columbia'],
      capacity: 1500,
      validTo: '2025-09-01',
      deliveryTerms: 'Free delivery ≥ 100 cases. Lead time 5–7 days.',
      tiers: [
        { id: 't1', minQty: 1, maxQty: 79, unitPrice: 155.00 },
        { id: 't2', minQty: 80, maxQty: 199, unitPrice: 132.00 },
        { id: 't3', minQty: 200, maxQty: 399, unitPrice: 112.00 },
        { id: 't4', minQty: 400, maxQty: null, unitPrice: 94.00 },
      ],
    },
    imageEmoji: '🔧',
    soloPrice: 168,
  },
]

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2025-001847',
    poolId: 'pool-completed-1',
    poolName: 'Industrial Cleaning Concentrate — Ontario',
    skuName: 'Industrial Cleaning Concentrate 20L',
    quantity: 24,
    unitPrice: 61.00,
    taxAmount: 176.76,
    commissionAmount: 87.84,
    total: 1728.60,
    status: 'COMPLETED',
    shipmentStatus: 'delivered',
    trackingNumber: 'CP123456789CA',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-2025-002143',
    poolId: 'pool-001',
    poolName: '205/55R16 Tire Pool — Quebec',
    skuName: '205/55R16 All-Season Tire — Brand X',
    quantity: 20,
    unitPrice: 82.00,
    taxAmount: 204.36,
    commissionAmount: 98.40,
    total: 1844.36,
    status: 'FULFILLING',
    shipmentStatus: 'in_transit',
    trackingNumber: 'CP987654321CA',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ORD-2025-002201',
    poolId: 'pool-003',
    poolName: 'Kraft Box Pool — Quebec',
    skuName: 'Kraft Paper Takeout Box 9" (case of 200)',
    quantity: 50,
    unitPrice: 23.50,
    taxAmount: 146.50,
    commissionAmount: 70.50,
    total: 1391.50,
    status: 'FULFILLING',
    shipmentStatus: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export const MOCK_SUPPLIER_OFFERS = [
  {
    id: 'offer-s-001',
    sku: 'Industrial Cleaning Concentrate 20L',
    category: 'Retail & Office',
    regions: ['Ontario', 'Quebec'],
    capacity: 2000,
    tiers: [
      { range: '1–49', price: 79.00 },
      { range: '50–149', price: 68.00 },
      { range: '150–299', price: 58.00 },
      { range: '300+', price: 48.00 },
    ],
    activePools: 3,
    status: 'active',
    validTo: '2025-08-31',
  },
  {
    id: 'offer-s-002',
    sku: 'Multi-Surface Sanitizer 4L (case of 4)',
    category: 'Retail & Office',
    regions: ['National'],
    capacity: 5000,
    tiers: [
      { range: '1–99', price: 42.00 },
      { range: '100–299', price: 35.00 },
      { range: '300–699', price: 29.00 },
      { range: '700+', price: 23.00 },
    ],
    activePools: 1,
    status: 'active',
    validTo: '2025-09-30',
  },
  {
    id: 'offer-s-003',
    sku: 'Commercial Paper Towel Roll (case of 12)',
    category: 'Retail & Office',
    regions: ['Ontario'],
    capacity: 3000,
    tiers: [
      { range: '1–99', price: 28.00 },
      { range: '100–249', price: 22.50 },
      { range: '250+', price: 18.00 },
    ],
    activePools: 0,
    status: 'paused',
    validTo: '2025-07-15',
  },
]

export const MOCK_VERIFICATIONS = [
  { id: 'v-001', org: 'Dumont & Fils Plomberie', type: 'supplier', province: 'QC', bn: '123456789', submitted: '2025-05-20', status: 'pending', notes: 'References provided. Awaiting admin review.' },
  { id: 'v-002', org: 'Westcoast Produce Inc.', type: 'buyer', province: 'BC', bn: '987654321', submitted: '2025-05-22', status: 'pending', notes: 'BN verified. Email domain matches.' },
  { id: 'v-003', org: 'Great Plains Hardware', type: 'supplier', province: 'SK', bn: '456123789', submitted: '2025-05-24', status: 'pending', notes: 'Stripe Connect onboarding incomplete.' },
]

export function getCurrentTier(tiers: PriceTier[], qty: number): PriceTier {
  for (const tier of tiers) {
    if (qty >= tier.minQty && (tier.maxQty === null || qty <= tier.maxQty)) {
      return tier
    }
  }
  return tiers[0]
}

export function getNextTier(tiers: PriceTier[], qty: number): PriceTier | null {
  const current = getCurrentTier(tiers, qty)
  const idx = tiers.indexOf(current)
  return idx < tiers.length - 1 ? tiers[idx + 1] : null
}

export function formatCAD(amount: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount)
}

export function formatTimeLeft(isoDate: string): { days: number; hours: number; minutes: number } {
  const diff = new Date(isoDate).getTime() - Date.now()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { days, hours, minutes }
}

export function getSavingsPct(soloPrice: number, poolPrice: number): number {
  return Math.round(((soloPrice - poolPrice) / soloPrice) * 100)
}
