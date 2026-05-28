-- Taddam Seed Data
-- Run with: npx prisma db execute --url "$DATABASE_URL" --file prisma/seed.sql

-- Admin user
INSERT INTO "User" (id, email, "passwordHash", name, "businessName", province, "postalCode", role, "preferredLocale", "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'admin@taddam.ca',
  '$2a$12$PRvUidsHHbOd/eAQ8eEzK.tGq0tjgQ6StvUXLMPA0Y5X05liYMs8W',
  'Admin',
  'taddam Platform',
  'QC',
  'H1A1A1',
  'ADMIN',
  'en',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Supplier user 1 (GreenPack)
INSERT INTO "User" (id, email, "passwordHash", name, "businessName", province, "postalCode", role, "preferredLocale", "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'supplier1@greenpacks.ca',
  '$2a$12$HI/Czow957AxC0jgM8dMcOcMk3fMsgfQynwN7VJ5JwBuMGBJX8foG',
  'Marc Tremblay',
  'GreenPack Solutions',
  'QC',
  'G1A1A1',
  'SUPPLIER',
  'fr',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Supplier user 2 (CanSafe)
INSERT INTO "User" (id, email, "passwordHash", name, "businessName", province, "postalCode", role, "preferredLocale", "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'supplier2@cansafe.ca',
  '$2a$12$enasAegD9x0uQ9cr7kGILuNBBH0gmhZgqEQszcNDTCkmBqMzlUu76',
  'Sarah Chen',
  'CanSafe Supply Co.',
  'ON',
  'M1A1A1',
  'SUPPLIER',
  'en',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Supplier user 3 (Pacific Parts)
INSERT INTO "User" (id, email, "passwordHash", name, "businessName", province, "postalCode", role, "preferredLocale", "emailVerified", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'supplier3@pacificparts.ca',
  '$2a$12$sGfOdmcsFMI9iGDjUO9krOrp.ZJT4HE3Kqzqz91msVmfxZKeyCGPu',
  'Kevin Park',
  'Pacific Parts Distribution',
  'BC',
  'V1A1A1',
  'SUPPLIER',
  'en',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Supplier records
INSERT INTO "Supplier" (id, "userId", "companyName", "taxNumber", "businessType", website, description, approved, "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  u.id,
  'GreenPack Solutions',
  'BN123456789',
  'corporation',
  'https://greenpacks.ca',
  'Eco-friendly food-service packaging for restaurants and caterers across Eastern Canada.',
  true,
  NOW(),
  NOW()
FROM "User" u WHERE u.email = 'supplier1@greenpacks.ca'
ON CONFLICT ("userId") DO NOTHING;

INSERT INTO "Supplier" (id, "userId", "companyName", "taxNumber", "businessType", website, description, approved, "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  u.id,
  'CanSafe Supply Co.',
  'BN987654321',
  'corporation',
  'https://cansafe.ca',
  'Industrial safety equipment and PPE distributor serving construction trades Canada-wide.',
  true,
  NOW(),
  NOW()
FROM "User" u WHERE u.email = 'supplier2@cansafe.ca'
ON CONFLICT ("userId") DO NOTHING;

INSERT INTO "Supplier" (id, "userId", "companyName", "taxNumber", "businessType", website, description, approved, "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  u.id,
  'Pacific Parts Distribution',
  'BN456123789',
  'corporation',
  'https://pacificparts.ca',
  'Automotive parts and consumables for independent garages and tire shops in Western Canada.',
  true,
  NOW(),
  NOW()
FROM "User" u WHERE u.email = 'supplier3@pacificparts.ca'
ON CONFLICT ("userId") DO NOTHING;

-- SKUs
INSERT INTO "SKU" (id, "supplierId", "nameEn", "nameFr", category, unit, "soloPrice", "createdAt", "updatedAt")
SELECT
  'sku-kraft-box-9in',
  s.id,
  'Kraft Paper Takeout Box 9" (case of 200)',
  'Boîte repas kraft 9 po (caisse de 200)',
  'Food Service',
  'case',
  38.50,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'GreenPack Solutions'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "SKU" (id, "supplierId", "nameEn", "nameFr", category, unit, "soloPrice", "createdAt", "updatedAt")
SELECT
  'sku-sanitizer-4l',
  s.id,
  'Multi-Surface Sanitizer 4L (case of 4)',
  'Désinfectant multi-surfaces 4 L (caisse de 4)',
  'Cleaning',
  'case',
  42.00,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'GreenPack Solutions'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "SKU" (id, "supplierId", "nameEn", "nameFr", category, unit, "soloPrice", "createdAt", "updatedAt")
SELECT
  'sku-cut-gloves-l',
  s.id,
  'Level 5 Cut-Resistant Gloves (Large)',
  'Gants anti-coupure niveau 5 (Grand)',
  'PPE',
  'pair',
  6.80,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'CanSafe Supply Co.'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "SKU" (id, "supplierId", "nameEn", "nameFr", category, unit, "soloPrice", "createdAt", "updatedAt")
SELECT
  'sku-hard-hat-white',
  s.id,
  'Class E Hard Hat — White (Type II)',
  'Casque de sécurité classe E — Blanc (Type II)',
  'PPE',
  'each',
  28.00,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'CanSafe Supply Co.'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "SKU" (id, "supplierId", "nameEn", "nameFr", category, unit, "soloPrice", "createdAt", "updatedAt")
SELECT
  'sku-tire-205-55r16',
  s.id,
  '205/55R16 All-Season Tire',
  'Pneu toutes saisons 205/55R16',
  'Automotive',
  'unit',
  145.00,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'Pacific Parts Distribution'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "SKU" (id, "supplierId", "nameEn", "nameFr", category, unit, "soloPrice", "createdAt", "updatedAt")
SELECT
  'sku-motor-oil-5w30',
  s.id,
  'Synthetic Motor Oil 5W-30 4L (case of 6)',
  'Huile moteur synthétique 5W-30 4 L (caisse de 6)',
  'Automotive',
  'case',
  168.00,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'Pacific Parts Distribution'
ON CONFLICT (id) DO NOTHING;

-- Pools (OPEN, future close dates relative to seeding time)
INSERT INTO "Pool" (id, "supplierId", "skuId", "targetQty", "committedQty", "participantCount", "closesAt", status, region, "regionFr", tiers, "createdAt", "updatedAt")
SELECT
  'pool-kraft-qc-2026',
  s.id,
  'sku-kraft-box-9in',
  300,
  142,
  9,
  NOW() + INTERVAL '4 days',
  'OPEN',
  'Quebec',
  'Québec',
  '[{"minQty":1,"unitPrice":34.50},{"minQty":50,"unitPrice":28.00},{"minQty":150,"unitPrice":23.50},{"minQty":300,"unitPrice":19.00}]'::jsonb,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'GreenPack Solutions'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Pool" (id, "supplierId", "skuId", "targetQty", "committedQty", "participantCount", "closesAt", status, region, tiers, "createdAt", "updatedAt")
SELECT
  'pool-sanitizer-nat-2026',
  s.id,
  'sku-sanitizer-4l',
  500,
  87,
  6,
  NOW() + INTERVAL '7 days',
  'OPEN',
  'National',
  '[{"minQty":1,"unitPrice":39.00},{"minQty":100,"unitPrice":32.00},{"minQty":300,"unitPrice":27.00},{"minQty":500,"unitPrice":22.00}]'::jsonb,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'GreenPack Solutions'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Pool" (id, "supplierId", "skuId", "targetQty", "committedQty", "participantCount", "closesAt", status, region, tiers, "createdAt", "updatedAt")
SELECT
  'pool-gloves-on-2026',
  s.id,
  'sku-cut-gloves-l',
  1000,
  310,
  14,
  NOW() + INTERVAL '5 days',
  'OPEN',
  'Ontario',
  '[{"minQty":1,"unitPrice":5.80},{"minQty":200,"unitPrice":4.60},{"minQty":500,"unitPrice":3.90},{"minQty":1000,"unitPrice":3.10}]'::jsonb,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'CanSafe Supply Co.'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Pool" (id, "supplierId", "skuId", "targetQty", "committedQty", "participantCount", "closesAt", status, region, tiers, "createdAt", "updatedAt")
SELECT
  'pool-hardhat-ab-2026',
  s.id,
  'sku-hard-hat-white',
  600,
  195,
  11,
  NOW() + INTERVAL '9 days',
  'OPEN',
  'Alberta',
  '[{"minQty":1,"unitPrice":24.50},{"minQty":100,"unitPrice":19.00},{"minQty":300,"unitPrice":15.50},{"minQty":600,"unitPrice":12.00}]'::jsonb,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'CanSafe Supply Co.'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Pool" (id, "supplierId", "skuId", "targetQty", "committedQty", "participantCount", "closesAt", status, region, tiers, "createdAt", "updatedAt")
SELECT
  'pool-tire-bc-2026',
  s.id,
  'sku-tire-205-55r16',
  500,
  68,
  5,
  NOW() + INTERVAL '12 days',
  'OPEN',
  'British Columbia',
  '[{"minQty":1,"unitPrice":118.00},{"minQty":100,"unitPrice":98.00},{"minQty":250,"unitPrice":82.00},{"minQty":500,"unitPrice":67.00}]'::jsonb,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'Pacific Parts Distribution'
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Pool" (id, "supplierId", "skuId", "targetQty", "committedQty", "participantCount", "closesAt", status, region, tiers, "createdAt", "updatedAt")
SELECT
  'pool-oil-bc-2026',
  s.id,
  'sku-motor-oil-5w30',
  400,
  48,
  4,
  NOW() + INTERVAL '14 days',
  'OPEN',
  'British Columbia',
  '[{"minQty":1,"unitPrice":155.00},{"minQty":80,"unitPrice":132.00},{"minQty":200,"unitPrice":112.00},{"minQty":400,"unitPrice":94.00}]'::jsonb,
  NOW(),
  NOW()
FROM "Supplier" s WHERE s."companyName" = 'Pacific Parts Distribution'
ON CONFLICT (id) DO NOTHING;

SELECT 'Seed complete!' AS status,
  (SELECT COUNT(*) FROM "User") AS users,
  (SELECT COUNT(*) FROM "Supplier") AS suppliers,
  (SELECT COUNT(*) FROM "SKU") AS skus,
  (SELECT COUNT(*) FROM "Pool") AS pools;
