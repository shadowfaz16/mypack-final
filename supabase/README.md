# Supabase Database Migrations

## Setup Instructions

### 1. Run Migrations in Order

Go to your Supabase Dashboard → SQL Editor and run these files in order:

1. `migrations/001_create_schema.sql` - Creates all tables, enums, and triggers
2. `migrations/002_create_rls_policies.sql` - Sets up Row Level Security policies
3. `migrations/003_seed_data.sql` - Adds initial data (branches, routes, pricing)

### 2. Create Storage Buckets

In Supabase Dashboard → Storage, create these buckets:

#### shipment-guides
- Public bucket: Yes
- Allowed MIME types: `application/pdf`
- Max file size: 5MB

#### qr-codes
- Public bucket: Yes
- Allowed MIME types: `image/png, image/jpeg`
- Max file size: 1MB

### 3. Configure Clerk Integration

#### In Clerk Dashboard:
1. Go to JWT Templates
2. Create a new template
3. Add custom claim:
```json
{
  "sub": "{{user.id}}"
}
```

#### Sync Users to Supabase:
Create a webhook in Clerk (Settings → Webhooks):
- URL: `https://your-app.vercel.app/api/webhooks/clerk`
- Events: `user.created`, `user.updated`

### 4. Create First Admin User

After your first signup via Clerk, run this SQL to make yourself admin:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 5. Environment Variables

Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For server-side operations
```

## Database Schema Overview

### Core Tables

- **users** - User profiles (synced from Clerk)
- **branches** - Physical office locations in Mexico
- **routes** - Predefined shipping routes with custom states
- **shipments** - Main shipment records with payment and tracking info
- **status_updates** - History of all status changes
- **pricing_rules** - Dynamic pricing based on weight/destination
- **insurance_rates** - Insurance cost calculations

### Enums

- `user_role`: cliente, empleado, admin
- `assignment_status`: pending_assignment, assigned, active, completed
- `payment_status`: pending, paid, failed
- `update_type`: automatic, manual, qr_scan
- `service_type`: menudeo, mayoreo

## Testing the Database

After setup, test with:

```sql
-- View all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check routes
SELECT * FROM routes;

-- Check pricing rules
SELECT * FROM pricing_rules WHERE is_active = true;

-- Check insurance rates
SELECT * FROM insurance_rates WHERE is_active = true;
```

