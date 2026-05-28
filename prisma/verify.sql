SELECT
  (SELECT COUNT(*) FROM "User") AS total_users,
  (SELECT COUNT(*) FROM "Supplier") AS total_suppliers,
  (SELECT COUNT(*) FROM "SKU") AS total_skus,
  (SELECT COUNT(*) FROM "Pool") AS total_pools,
  (SELECT email FROM "User" WHERE role = 'ADMIN' LIMIT 1) AS admin_email,
  (SELECT COUNT(*) FROM "Pool" WHERE status = 'OPEN') AS open_pools;
