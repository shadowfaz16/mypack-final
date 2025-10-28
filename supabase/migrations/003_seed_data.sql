-- MY PACK MX Seed Data
-- Run this AFTER running 001_create_schema.sql and 002_create_rls_policies.sql
-- This provides initial data for testing and development

-- ============================================================
-- SEED BRANCHES
-- ============================================================
INSERT INTO branches (name, address, city, state, phone, is_active) VALUES
    ('Monterrey Centro', 'Av. Constitución 1234, Col. Centro', 'Monterrey', 'Nuevo León', '+52 81 1234 5678', true),
    ('Chihuahua Norte', 'Blvd. Antonio Ortiz Mena 3456', 'Chihuahua', 'Chihuahua', '+52 614 234 5678', true),
    ('Coahuila Plaza', 'Blvd. Venustiano Carranza 789', 'Saltillo', 'Coahuila', '+52 844 345 6789', true);

-- ============================================================
-- SEED ROUTES
-- ============================================================
INSERT INTO routes (name, states, description, estimated_days, is_active) VALUES
    (
        'Laredo → Monterrey',
        '["Pago Confirmado", "Recibido en Laredo", "En Bodega Monterrey", "Entregado"]'::jsonb,
        'Ruta directa desde Laredo, TX hasta Monterrey y área metropolitana',
        3,
        true
    ),
    (
        'Laredo → Chihuahua',
        '["Pago Confirmado", "Recibido en Laredo", "En Tránsito", "En Bodega Chihuahua", "Entregado"]'::jsonb,
        'Ruta hacia Chihuahua con tiempo de tránsito adicional',
        5,
        true
    ),
    (
        'Laredo → Coahuila',
        '["Pago Confirmado", "Recibido en Laredo", "En Bodega Saltillo", "Entregado"]'::jsonb,
        'Ruta hacia Saltillo y región de Coahuila',
        3,
        true
    ),
    (
        'Laredo → Monterrey Express',
        '["Pago Confirmado", "Recibido en Laredo", "Entregado"]'::jsonb,
        'Servicio express sin paradas intermedias - 24-48 horas',
        2,
        true
    );

-- ============================================================
-- SEED PRICING RULES (Menudeo)
-- ============================================================
INSERT INTO pricing_rules (service_type, min_weight, max_weight, base_price, price_per_kg, destination_zone, is_active) VALUES
    -- Nuevo León (Monterrey y área metropolitana)
    ('menudeo', 0, 5, 150, 25, 'Nuevo León', true),
    ('menudeo', 5.01, 10, 200, 20, 'Nuevo León', true),
    ('menudeo', 10.01, 25, 300, 15, 'Nuevo León', true),
    ('menudeo', 25.01, 50, 450, 12, 'Nuevo León', true),
    
    -- Chihuahua
    ('menudeo', 0, 5, 200, 30, 'Chihuahua', true),
    ('menudeo', 5.01, 10, 250, 25, 'Chihuahua', true),
    ('menudeo', 10.01, 25, 400, 20, 'Chihuahua', true),
    ('menudeo', 25.01, 50, 550, 15, 'Chihuahua', true),
    
    -- Coahuila
    ('menudeo', 0, 5, 175, 28, 'Coahuila', true),
    ('menudeo', 5.01, 10, 225, 22, 'Coahuila', true),
    ('menudeo', 10.01, 25, 350, 18, 'Coahuila', true),
    ('menudeo', 25.01, 50, 500, 14, 'Coahuila', true);

-- ============================================================
-- SEED PRICING RULES (Mayoreo)
-- ============================================================
INSERT INTO pricing_rules (service_type, min_weight, max_weight, base_price, price_per_kg, destination_zone, is_active) VALUES
    -- Nuevo León - Mayoreo
    ('mayoreo', 50.01, 100, 600, 10, 'Nuevo León', true),
    ('mayoreo', 100.01, 250, 1000, 8, 'Nuevo León', true),
    ('mayoreo', 250.01, 500, 2000, 6, 'Nuevo León', true),
    ('mayoreo', 500.01, 1000, 3500, 5, 'Nuevo León', true),
    
    -- Chihuahua - Mayoreo
    ('mayoreo', 50.01, 100, 750, 12, 'Chihuahua', true),
    ('mayoreo', 100.01, 250, 1300, 10, 'Chihuahua', true),
    ('mayoreo', 250.01, 500, 2500, 8, 'Chihuahua', true),
    ('mayoreo', 500.01, 1000, 4500, 7, 'Chihuahua', true),
    
    -- Coahuila - Mayoreo
    ('mayoreo', 50.01, 100, 700, 11, 'Coahuila', true),
    ('mayoreo', 100.01, 250, 1200, 9, 'Coahuila', true),
    ('mayoreo', 250.01, 500, 2300, 7, 'Coahuila', true),
    ('mayoreo', 500.01, 1000, 4000, 6, 'Coahuila', true);

-- ============================================================
-- SEED INSURANCE RATES
-- ============================================================
INSERT INTO insurance_rates (min_value, max_value, rate_percentage, is_active) VALUES
    (0, 1000, 2.5, true),           -- 2.5% for values up to $1,000 MXN
    (1000.01, 5000, 2.0, true),     -- 2.0% for values $1,000-$5,000 MXN
    (5000.01, 20000, 1.5, true),    -- 1.5% for values $5,000-$20,000 MXN
    (20000.01, 50000, 1.0, true),   -- 1.0% for values $20,000-$50,000 MXN
    (50000.01, 999999999, 0.75, true); -- 0.75% for values over $50,000 MXN

-- ============================================================
-- NOTES FOR MANUAL SETUP
-- ============================================================
-- 
-- After running these migrations, you need to:
-- 
-- 1. Create a Storage bucket named 'shipment-guides' for PDF guides
--    - Make it public for reading
--    - Configure policies to allow authenticated users to upload
-- 
-- 2. Create a Storage bucket named 'qr-codes' for QR code images
--    - Make it public for reading
-- 
-- 3. Set up Supabase Auth integration with Clerk:
--    - Configure JWT template in Clerk to include user_id
--    - Set up webhook in Clerk to sync users to Supabase users table
-- 
-- 4. Create an admin user manually in the users table after first signup
--    UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
--

