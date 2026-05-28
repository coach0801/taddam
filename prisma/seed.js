// Plain JS seed script (no TypeScript compilation needed)
// Passwords are pre-hashed with bcrypt cost 12
const { PrismaClient } = require('../node_modules/@prisma/client')
const prisma = new PrismaClient()

// Pre-hashed passwords:
// Admin123! => a
// Supplier1! => s1
// Supplier2! => s2
// Supplier3! => s3
const PW = {
  a:  '$2a$12$PRvUidsHHbOd/eAQ8eEzK.tGq0tjgQ6StvUXLMPA0Y5X05liYMs8W',
  s1: '$2a$12$HI/Czow957AxC0jgM8dMcOcMk3fMsgfQynwN7VJ5JwBuMGBJX8foG',
  s2: '$2a$12$enasAegD9x0uQ9cr7kGILuNBBH0gmhZgqEQszcNDTCkmBqMzlUu76',
  s3: '$2a$12$sGfOdmcsFMI9iGDjUO9krOrp.ZJT4HE3Kqzqz91msVmfxZKeyCGPu',
}

async function main() {
  console.log('Seeding database...')

  const admin = await prisma.user.upsert({
    where: { email: 'admin@taddam.ca' },
    update: {},
    create: {
      email: 'admin@taddam.ca', passwordHash: PW.a, name: 'Admin',
      businessName: 'taddam Platform', province: 'QC', postalCode: 'H1A1A1',
      role: 'ADMIN', preferredLocale: 'en', emailVerified: new Date(),
    },
  })
  console.log('Admin created:', admin.email)

  const sup1User = await prisma.user.upsert({
    where: { email: 'supplier1@greenpacks.ca' },
    update: {},
    create: {
      email: 'supplier1@greenpacks.ca', passwordHash: PW.s1, name: 'Marc Tremblay',
      businessName: 'GreenPack Solutions', province: 'QC', postalCode: 'G1A1A1',
      role: 'SUPPLIER', preferredLocale: 'fr', emailVerified: new Date(),
    },
  })

  const sup2User = await prisma.user.upsert({
    where: { email: 'supplier2@cansafe.ca' },
    update: {},
    create: {
      email: 'supplier2@cansafe.ca', passwordHash: PW.s2, name: 'Sarah Chen',
      businessName: 'CanSafe Supply Co.', province: 'ON', postalCode: 'M1A1A1',
      role: 'SUPPLIER', preferredLocale: 'en', emailVerified: new Date(),
    },
  })

  const sup3User = await prisma.user.upsert({
    where: { email: 'supplier3@pacificparts.ca' },
    update: {},
    create: {
      email: 'supplier3@pacificparts.ca', passwordHash: PW.s3, name: 'Kevin Park',
      businessName: 'Pacific Parts Distribution', province: 'BC', postalCode: 'V1A1A1',
      role: 'SUPPLIER', preferredLocale: 'en', emailVerified: new Date(),
    },
  })

  const sup1 = await prisma.supplier.upsert({
    where: { userId: sup1User.id }, update: {},
    create: {
      userId: sup1User.id, companyName: 'GreenPack Solutions', taxNumber: 'BN123456789',
      businessType: 'corporation', website: 'https://greenpacks.ca',
      description: 'Eco-friendly food-service packaging for restaurants and caterers across Eastern Canada.',
      approved: true,
    },
  })

  const sup2 = await prisma.supplier.upsert({
    where: { userId: sup2User.id }, update: {},
    create: {
      userId: sup2User.id, companyName: 'CanSafe Supply Co.', taxNumber: 'BN987654321',
      businessType: 'corporation', website: 'https://cansafe.ca',
      description: 'Industrial safety equipment and PPE distributor serving construction trades Canada-wide.',
      approved: true,
    },
  })

  const sup3 = await prisma.supplier.upsert({
    where: { userId: sup3User.id }, update: {},
    create: {
      userId: sup3User.id, companyName: 'Pacific Parts Distribution', taxNumber: 'BN456123789',
      businessType: 'corporation', website: 'https://pacificparts.ca',
      description: 'Automotive parts and consumables for independent garages and tire shops in Western Canada.',
      approved: true,
    },
  })
  console.log('Suppliers created')

  const sku1 = await prisma.sKU.upsert({
    where: { id: 'sku-kraft-box-9in' }, update: {},
    create: { id: 'sku-kraft-box-9in', supplierId: sup1.id, nameEn: 'Kraft Paper Takeout Box 9" (case of 200)', nameFr: 'Boîte repas kraft 9 po (caisse de 200)', category: 'Food Service', unit: 'case', soloPrice: 38.50 },
  })
  const sku2 = await prisma.sKU.upsert({
    where: { id: 'sku-sanitizer-4l' }, update: {},
    create: { id: 'sku-sanitizer-4l', supplierId: sup1.id, nameEn: 'Multi-Surface Sanitizer 4L (case of 4)', nameFr: 'Désinfectant multi-surfaces 4 L (caisse de 4)', category: 'Cleaning', unit: 'case', soloPrice: 42.00 },
  })
  const sku3 = await prisma.sKU.upsert({
    where: { id: 'sku-cut-gloves-l' }, update: {},
    create: { id: 'sku-cut-gloves-l', supplierId: sup2.id, nameEn: 'Level 5 Cut-Resistant Gloves (Large)', nameFr: 'Gants anti-coupure niveau 5 (Grand)', category: 'PPE', unit: 'pair', soloPrice: 6.80 },
  })
  const sku4 = await prisma.sKU.upsert({
    where: { id: 'sku-hard-hat-white' }, update: {},
    create: { id: 'sku-hard-hat-white', supplierId: sup2.id, nameEn: 'Class E Hard Hat — White (Type II)', nameFr: 'Casque de sécurité classe E — Blanc (Type II)', category: 'PPE', unit: 'each', soloPrice: 28.00 },
  })
  const sku5 = await prisma.sKU.upsert({
    where: { id: 'sku-tire-205-55r16' }, update: {},
    create: { id: 'sku-tire-205-55r16', supplierId: sup3.id, nameEn: '205/55R16 All-Season Tire', nameFr: 'Pneu toutes saisons 205/55R16', category: 'Automotive', unit: 'unit', soloPrice: 145.00 },
  })
  const sku6 = await prisma.sKU.upsert({
    where: { id: 'sku-motor-oil-5w30' }, update: {},
    create: { id: 'sku-motor-oil-5w30', supplierId: sup3.id, nameEn: 'Synthetic Motor Oil 5W-30 4L (case of 6)', nameFr: 'Huile moteur synthétique 5W-30 4 L (caisse de 6)', category: 'Automotive', unit: 'case', soloPrice: 168.00 },
  })
  console.log('SKUs created')

  const now = new Date()

  await prisma.pool.upsert({
    where: { id: 'pool-kraft-qc-2026' }, update: {},
    create: {
      id: 'pool-kraft-qc-2026', supplierId: sup1.id, skuId: sku1.id,
      targetQty: 300, committedQty: 142, participantCount: 9,
      closesAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      status: 'OPEN', region: 'Quebec', regionFr: 'Québec',
      tiers: [{ minQty: 1, unitPrice: 34.50 }, { minQty: 50, unitPrice: 28.00 }, { minQty: 150, unitPrice: 23.50 }, { minQty: 300, unitPrice: 19.00 }],
    },
  })

  await prisma.pool.upsert({
    where: { id: 'pool-sanitizer-nat-2026' }, update: {},
    create: {
      id: 'pool-sanitizer-nat-2026', supplierId: sup1.id, skuId: sku2.id,
      targetQty: 500, committedQty: 87, participantCount: 6,
      closesAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: 'OPEN', region: 'National',
      tiers: [{ minQty: 1, unitPrice: 39.00 }, { minQty: 100, unitPrice: 32.00 }, { minQty: 300, unitPrice: 27.00 }, { minQty: 500, unitPrice: 22.00 }],
    },
  })

  await prisma.pool.upsert({
    where: { id: 'pool-gloves-on-2026' }, update: {},
    create: {
      id: 'pool-gloves-on-2026', supplierId: sup2.id, skuId: sku3.id,
      targetQty: 1000, committedQty: 310, participantCount: 14,
      closesAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      status: 'OPEN', region: 'Ontario',
      tiers: [{ minQty: 1, unitPrice: 5.80 }, { minQty: 200, unitPrice: 4.60 }, { minQty: 500, unitPrice: 3.90 }, { minQty: 1000, unitPrice: 3.10 }],
    },
  })

  await prisma.pool.upsert({
    where: { id: 'pool-hardhat-ab-2026' }, update: {},
    create: {
      id: 'pool-hardhat-ab-2026', supplierId: sup2.id, skuId: sku4.id,
      targetQty: 600, committedQty: 195, participantCount: 11,
      closesAt: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      status: 'OPEN', region: 'Alberta',
      tiers: [{ minQty: 1, unitPrice: 24.50 }, { minQty: 100, unitPrice: 19.00 }, { minQty: 300, unitPrice: 15.50 }, { minQty: 600, unitPrice: 12.00 }],
    },
  })

  await prisma.pool.upsert({
    where: { id: 'pool-tire-bc-2026' }, update: {},
    create: {
      id: 'pool-tire-bc-2026', supplierId: sup3.id, skuId: sku5.id,
      targetQty: 500, committedQty: 68, participantCount: 5,
      closesAt: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      status: 'OPEN', region: 'British Columbia',
      tiers: [{ minQty: 1, unitPrice: 118.00 }, { minQty: 100, unitPrice: 98.00 }, { minQty: 250, unitPrice: 82.00 }, { minQty: 500, unitPrice: 67.00 }],
    },
  })

  await prisma.pool.upsert({
    where: { id: 'pool-oil-bc-2026' }, update: {},
    create: {
      id: 'pool-oil-bc-2026', supplierId: sup3.id, skuId: sku6.id,
      targetQty: 400, committedQty: 48, participantCount: 4,
      closesAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      status: 'OPEN', region: 'British Columbia',
      tiers: [{ minQty: 1, unitPrice: 155.00 }, { minQty: 80, unitPrice: 132.00 }, { minQty: 200, unitPrice: 112.00 }, { minQty: 400, unitPrice: 94.00 }],
    },
  })

  console.log('Pools created')
  console.log('')
  console.log('Seed complete!')
  console.log('Admin:      admin@taddam.ca / Admin123!')
  console.log('Supplier 1: supplier1@greenpacks.ca / Supplier1!')
  console.log('Supplier 2: supplier2@cansafe.ca / Supplier2!')
  console.log('Supplier 3: supplier3@pacificparts.ca / Supplier3!')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
