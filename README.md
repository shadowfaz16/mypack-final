# MY PACK MX - Servicio de Paquetería USA-México

<div align="center">

**Plataforma de Importación y Logística Transfronteriza**

![Status](https://img.shields.io/badge/Status-Production_Ready-success)
![Progress](https://img.shields.io/badge/Phase_1-95%25_Complete-blue)
![Tech](https://img.shields.io/badge/Next.js-15.5.6-black)

Envíos desde Estados Unidos a México con rastreo en tiempo real

[Demo](#) • [Documentación](#documentación) • [Configuración](#configuración-rápida)

</div>

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
bun install

# 2. Configure environment variables (see below)
cp .env.example .env.local
# Edit .env.local with your API keys

# 3. Storage buckets must be created in Supabase Dashboard
# - shipment-guides (public)
# - qr-codes (public)

# 4. Start development server
bun dev

# 5. Open http://localhost:3000
```

---

## ✨ Features

### For Customers
- 📦 **Calculator** - Instant quotes with volumetric weight calculation
- 💳 **Secure Payments** - Stripe integration with test mode
- 📧 **Instant Guides** - PDF shipping guides with QR codes sent immediately
- 🔍 **Real-time Tracking** - Two-stage tracking system
- 📱 **Mobile-First** - Optimized for smartphones
- 🌙 **Dark Mode** - Full dark mode support

### For Admins
- 📊 **Dashboard** - KPIs, stats, and recent activity
- ⚡ **Route Assignment** - Assign shipping routes to paid orders
- 🔄 **Status Updates** - Update shipment status with notes
- 🛣️ **Route Management** - Create custom routes with flexible states
- 👥 **Client Management** - View all clients and their history
- 💰 **Pricing Control** - Manage pricing rules and insurance rates
- 🏢 **Branches** - Manage physical office locations

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Clerk** - Authentication

### Backend
- **Supabase** - PostgreSQL database
- **Stripe** - Payment processing
- **Resend** - Email delivery
- **@react-pdf/renderer** - PDF generation

### Libraries
- **zod** - Schema validation
- **react-hook-form** - Form management
- **date-fns** - Date utilities
- **qrcode** - QR code generation

---

## 📋 Database Schema

### Tables
- `users` - User profiles with roles (cliente, empleado, admin)
- `branches` - Physical offices in Mexico
- `routes` - Shipping routes with custom states
- `shipments` - Main shipment records with tracking
- `status_updates` - Audit trail of all status changes
- `pricing_rules` - Dynamic pricing by weight/destination
- `insurance_rates` - Insurance cost tiers

### Roles
- **Cliente** - Regular users (can view own shipments)
- **Empleado** - Employees (can view branch shipments)
- **Admin** - Full access to all features

---

## ⚙️ Configuración Rápida

### 1. Supabase Setup

**Database migrations already applied via MCP:**
- ✅ All tables created
- ✅ RLS policies enabled
- ✅ Seed data loaded

**Manual steps needed:**
1. Go to Supabase Dashboard → Storage
2. Create bucket: `shipment-guides` (public)
3. Create bucket: `qr-codes` (public)

### 2. Environment Variables

Create `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@mypackmx.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
LAREDO_WAREHOUSE_ADDRESS=123 Warehouse St, Laredo, TX 78040
LAREDO_WAREHOUSE_PHONE=+1 956 123 4567
```

### 3. Webhooks Configuration

**Clerk Webhook:**
- URL: `https://your-domain.com/api/webhooks/clerk`
- Events: `user.created`, `user.updated`

**Stripe Webhook:**
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `checkout.session.completed`

For local testing, use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 4. Create Admin User

After first signup:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

---

## 📁 Project Structure

```
mypack-final/
├── src/
│   ├── app/
│   │   ├── page.tsx                           # Landing
│   │   ├── servicios/                         # Services
│   │   ├── nosotros/                          # About
│   │   ├── faq/                               # FAQ
│   │   ├── contacto/                          # Contact
│   │   ├── cotizador/                         # Calculator
│   │   ├── tracking/[trackingNumber]/         # Public tracking
│   │   ├── pago/success/                      # Payment success
│   │   ├── dashboard/                         # Client dashboard
│   │   ├── admin/                             # Admin panel (9 pages)
│   │   └── api/                               # API routes
│   ├── components/
│   │   ├── navbar.tsx                         # Main navigation
│   │   ├── footer.tsx                         # Site footer
│   │   ├── route-builder.tsx                  # Route state editor
│   │   └── ui/                                # shadcn components
│   ├── lib/
│   │   ├── tracking-number.ts                 # ID generation
│   │   ├── pricing.ts                         # Cost calculation
│   │   ├── qr-generator.ts                    # QR codes
│   │   ├── pdf-guide.ts                       # PDF generation
│   │   ├── email.ts                           # Email sending
│   │   └── auth-utils.ts                      # Auth helpers
│   └── types/
│       └── database.types.ts                  # TypeScript types
├── supabase/
│   └── migrations/                            # Applied via MCP
└── Documentation/
    ├── 🎉_COMPLETE_SUMMARY.md                # Start here!
    ├── DEPLOYMENT_GUIDE.md                    # Deployment steps
    ├── TESTING_CHECKLIST.md                   # Testing guide
    └── SETUP_GUIDE.md                         # Initial setup
```

---

## 📖 Documentación

**Start Here:**
1. [🎉 Complete Summary](./🎉_COMPLETE_SUMMARY.md) - Overview of everything
2. [Setup Guide](./SETUP_GUIDE.md) - Storage buckets and setup
3. [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment
4. [Testing Checklist](./TESTING_CHECKLIST.md) - Comprehensive testing

**Technical:**
- [Implementation Status](./IMPLEMENTATION_STATUS.md) - Technical details
- [Progress Report](./PROGRESS_REPORT.md) - Feature breakdown
- [Project Specifications](./project-specifications.md) - Original requirements

---

## 🎯 User Flows

### Customer Flow
```
Landing Page → Calculator (4 steps) → Sign Up → 
Payment (Stripe) → Receive Guide (Email) → 
Track Shipment → Receive Package
```

### Admin Flow
```
Login → See Pending Shipments → Assign Route → 
Client Sees Timeline → Update Status → 
Client Gets Notification → Mark Delivered
```

---

## 🔐 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Role-based access control (RBAC)
- ✅ Secure payment processing (Stripe)
- ✅ Environment variables for secrets
- ✅ JWT-based authentication (Clerk)
- ✅ HTTPS required in production

---

## 🌍 Supported Destinations

Currently delivering to:
- **Nuevo León** (Monterrey y área metropolitana)
- **Chihuahua** (Chihuahua y región)
- **Coahuila** (Saltillo y región)

Expanding to more states soon!

---

## 💳 Payment Options

- Credit/Debit Cards (Visa, Mastercard, AMEX)
- Processed securely through Stripe
- MXN and USD support
- Test mode available

---

## 📧 Email Notifications

Automatic emails sent for:
- ✅ Payment confirmation (with PDF guide)
- ✅ Status updates
- ✅ Delivery confirmation

---

## 🧪 Testing

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for complete testing guide.

---

## 🚀 Deployment

```bash
# Deploy to Vercel (recommended)
vercel --prod

# Or deploy to any platform that supports Next.js
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for details.

---

## 📊 Current Status

### Completed (95%)
- ✅ Database schema with seed data
- ✅ All user-facing features
- ✅ Complete admin panel
- ✅ Payment integration
- ✅ Email system
- ✅ PDF generation
- ✅ Tracking system
- ✅ Role-based security

### Configuration Needed (5%)
- ⏳ Environment variables
- ⏳ Storage buckets
- ⏳ Webhooks
- ⏳ Admin user creation

---

## 🤝 Contributing

This is a private commercial project. For questions or support, contact the development team.

---

## 📄 License

Proprietary - © 2025 MY PACK MX

---

## 🎊 Ready to Launch!

All code is production-ready. Just configure your environment and you're live!

For detailed setup instructions, see [🎉_COMPLETE_SUMMARY.md](./🎉_COMPLETE_SUMMARY.md)

---

**Built with ❤️ for seamless USA-Mexico shipping**
