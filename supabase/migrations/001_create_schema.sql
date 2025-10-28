-- MY PACK MX Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('cliente', 'empleado', 'admin');
CREATE TYPE assignment_status AS ENUM ('pending_assignment', 'assigned', 'active', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE update_type AS ENUM ('automatic', 'manual', 'qr_scan');
CREATE TYPE service_type AS ENUM ('menudeo', 'mayoreo');

-- ============================================================
-- BRANCHES TABLE (Sucursales - Physical offices in Mexico)
-- ============================================================
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- USERS TABLE (Extends Clerk authentication)
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    role user_role DEFAULT 'cliente',
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on clerk_id for faster lookups
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================
-- ROUTES TABLE (Rutas predefinidas editables)
-- ============================================================
CREATE TABLE routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    states JSONB NOT NULL, -- Array of state names ["Pago Confirmado", "Recibido en Laredo", ...]
    description TEXT,
    estimated_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SHIPMENTS TABLE (Expanded per specifications)
-- ============================================================
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    customer_destination TEXT NOT NULL, -- What customer requested
    route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
    current_status TEXT,
    current_status_index INTEGER DEFAULT 0,
    assignment_status assignment_status DEFAULT 'pending_assignment',
    
    -- Package details
    dimensions JSONB, -- {length: number, width: number, height: number} in cm
    weight NUMERIC NOT NULL, -- in kg
    declared_value NUMERIC, -- in MXN
    
    -- Pricing
    insurance_purchased BOOLEAN DEFAULT false,
    insurance_cost NUMERIC DEFAULT 0,
    service_cost NUMERIC NOT NULL,
    total_cost NUMERIC NOT NULL,
    
    -- Destination
    destination_address TEXT NOT NULL,
    destination_city TEXT NOT NULL,
    destination_state TEXT NOT NULL,
    destination_zipcode TEXT,
    
    -- Documents
    qr_code_url TEXT,
    guide_pdf_url TEXT,
    
    -- Payment (Stripe)
    payment_intent_id TEXT,
    payment_status payment_status DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Moment of payment
    assigned_at TIMESTAMP WITH TIME ZONE, -- When admin assigned route
    estimated_delivery DATE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX idx_shipments_user_id ON shipments(user_id);
CREATE INDEX idx_shipments_assignment_status ON shipments(assignment_status);
CREATE INDEX idx_shipments_payment_status ON shipments(payment_status);
CREATE INDEX idx_shipments_route_id ON shipments(route_id);
CREATE INDEX idx_shipments_created_at ON shipments(created_at DESC);

-- ============================================================
-- STATUS_UPDATES TABLE (Historial de estados)
-- ============================================================
CREATE TABLE status_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location TEXT,
    notes TEXT,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    update_type update_type DEFAULT 'manual'
);

-- Create index for shipment status history queries
CREATE INDEX idx_status_updates_shipment_id ON status_updates(shipment_id);
CREATE INDEX idx_status_updates_timestamp ON status_updates(timestamp DESC);

-- ============================================================
-- PRICING_RULES TABLE (Reglas de precios)
-- ============================================================
CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_type service_type NOT NULL,
    min_weight NUMERIC NOT NULL,
    max_weight NUMERIC NOT NULL,
    base_price NUMERIC NOT NULL,
    price_per_kg NUMERIC NOT NULL,
    destination_zone TEXT NOT NULL, -- State or region
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pricing_rules_active ON pricing_rules(is_active);

-- ============================================================
-- INSURANCE_RATES TABLE (Tasas de seguro)
-- ============================================================
CREATE TABLE insurance_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    min_value NUMERIC NOT NULL,
    max_value NUMERIC NOT NULL,
    rate_percentage NUMERIC NOT NULL, -- e.g., 2.5 for 2.5%
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_insurance_rates_active ON insurance_rates(is_active);

-- ============================================================
-- FUNCTIONS FOR AUTO-UPDATING updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON pricing_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_rates_updated_at BEFORE UPDATE ON insurance_rates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

