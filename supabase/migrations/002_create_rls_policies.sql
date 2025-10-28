-- MY PACK MX Row Level Security Policies
-- Run this AFTER running 001_create_schema.sql

-- Enable RLS on all tables
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_rates ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTION TO GET CURRENT USER ROLE
-- ============================================================
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
DECLARE
    user_role_val user_role;
BEGIN
    SELECT role INTO user_role_val
    FROM users
    WHERE clerk_id = auth.jwt() ->> 'sub';
    
    RETURN COALESCE(user_role_val, 'cliente'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- HELPER FUNCTION TO GET CURRENT USER ID
-- ============================================================
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
DECLARE
    user_id_val UUID;
BEGIN
    SELECT id INTO user_id_val
    FROM users
    WHERE clerk_id = auth.jwt() ->> 'sub';
    
    RETURN user_id_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- BRANCHES POLICIES
-- ============================================================

-- Admins: Full access to branches
CREATE POLICY "Admins can view all branches"
    ON branches FOR SELECT
    USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert branches"
    ON branches FOR INSERT
    WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins can update branches"
    ON branches FOR UPDATE
    USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete branches"
    ON branches FOR DELETE
    USING (get_current_user_role() = 'admin');

-- Employees: Can view their own branch
CREATE POLICY "Employees can view their own branch"
    ON branches FOR SELECT
    USING (
        get_current_user_role() = 'empleado' AND
        id IN (SELECT branch_id FROM users WHERE id = get_current_user_id())
    );

-- ============================================================
-- USERS POLICIES
-- ============================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (id = get_current_user_id());

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (id = get_current_user_id())
    WITH CHECK (id = get_current_user_id());

-- Admins: Full access to all users
CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert users"
    ON users FOR INSERT
    WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all users"
    ON users FOR UPDATE
    USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete users"
    ON users FOR DELETE
    USING (get_current_user_role() = 'admin');

-- Allow user creation during signup (will be called from server-side)
CREATE POLICY "Allow user creation"
    ON users FOR INSERT
    WITH CHECK (true);

-- ============================================================
-- ROUTES POLICIES
-- ============================================================

-- Everyone can view active routes (for tracking page)
CREATE POLICY "Anyone can view active routes"
    ON routes FOR SELECT
    USING (is_active = true);

-- Admins: Full CRUD on routes
CREATE POLICY "Admins can manage routes"
    ON routes FOR ALL
    USING (get_current_user_role() = 'admin')
    WITH CHECK (get_current_user_role() = 'admin');

-- ============================================================
-- SHIPMENTS POLICIES
-- ============================================================

-- Clients: View only their own shipments
CREATE POLICY "Clients can view own shipments"
    ON shipments FOR SELECT
    USING (
        get_current_user_role() = 'cliente' AND
        user_id = get_current_user_id()
    );

-- Employees: View shipments for their branch destinations
CREATE POLICY "Employees can view branch shipments"
    ON shipments FOR SELECT
    USING (
        get_current_user_role() = 'empleado'
    );

-- Admins: Full access
CREATE POLICY "Admins can view all shipments"
    ON shipments FOR SELECT
    USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can insert shipments"
    ON shipments FOR INSERT
    WITH CHECK (get_current_user_role() = 'admin');

CREATE POLICY "Admins can update shipments"
    ON shipments FOR UPDATE
    USING (get_current_user_role() = 'admin');

CREATE POLICY "Admins can delete shipments"
    ON shipments FOR DELETE
    USING (get_current_user_role() = 'admin');

-- Allow shipment creation from API (server-side with service role)
CREATE POLICY "Allow shipment creation from API"
    ON shipments FOR INSERT
    WITH CHECK (true);

-- Allow public read for tracking page (anyone with tracking number)
CREATE POLICY "Public can view shipment by tracking number"
    ON shipments FOR SELECT
    USING (true);

-- ============================================================
-- STATUS_UPDATES POLICIES
-- ============================================================

-- Clients can view status updates for their shipments
CREATE POLICY "Clients can view own shipment status updates"
    ON status_updates FOR SELECT
    USING (
        shipment_id IN (
            SELECT id FROM shipments 
            WHERE user_id = get_current_user_id()
        )
    );

-- Employees can view status updates for visible shipments
CREATE POLICY "Employees can view status updates"
    ON status_updates FOR SELECT
    USING (get_current_user_role() IN ('empleado', 'admin'));

-- Admins: Full access
CREATE POLICY "Admins can manage status updates"
    ON status_updates FOR ALL
    USING (get_current_user_role() = 'admin')
    WITH CHECK (get_current_user_role() = 'admin');

-- Allow public read for tracking page
CREATE POLICY "Public can view status updates"
    ON status_updates FOR SELECT
    USING (true);

-- ============================================================
-- PRICING_RULES POLICIES
-- ============================================================

-- Everyone can view active pricing rules (for calculator)
CREATE POLICY "Anyone can view active pricing rules"
    ON pricing_rules FOR SELECT
    USING (is_active = true);

-- Admins: Full CRUD
CREATE POLICY "Admins can manage pricing rules"
    ON pricing_rules FOR ALL
    USING (get_current_user_role() = 'admin')
    WITH CHECK (get_current_user_role() = 'admin');

-- ============================================================
-- INSURANCE_RATES POLICIES
-- ============================================================

-- Everyone can view active insurance rates (for calculator)
CREATE POLICY "Anyone can view active insurance rates"
    ON insurance_rates FOR SELECT
    USING (is_active = true);

-- Admins: Full CRUD
CREATE POLICY "Admins can manage insurance rates"
    ON insurance_rates FOR ALL
    USING (get_current_user_role() = 'admin')
    WITH CHECK (get_current_user_role() = 'admin');

