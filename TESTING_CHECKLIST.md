# MY PACK MX - Testing Checklist

## ✅ Pre-Testing Setup

Before you can test, ensure you have:
- [ ] Created `.env.local` with all API keys
- [ ] Created storage buckets in Supabase (shipment-guides, qr-codes)
- [ ] Configured Clerk webhook
- [ ] Configured Stripe webhook (or use Stripe CLI for local)
- [ ] Started dev server: `bun dev`

---

## 🧪 TESTING FLOWS

### 1. Public Pages Testing (No Auth Required)

**Landing Page** - http://localhost:3000
- [ ] Hero section displays correctly
- [ ] "Cómo funciona" steps are visible
- [ ] Benefits cards render
- [ ] Testimonials show
- [ ] CTAs link correctly
- [ ] Footer has correct links
- [ ] Mobile menu works on phone

**Services** - http://localhost:3000/servicios
- [ ] Menudeo and Mayoreo cards display
- [ ] Insurance section shows rates
- [ ] Reception process explained
- [ ] Delivery info visible
- [ ] Mobile layout works

**About** - http://localhost:3000/nosotros
- [ ] Mission statement visible
- [ ] Values cards display
- [ ] Team structure explained
- [ ] Why choose us section works

**FAQ** - http://localhost:3000/faq
- [ ] All 6 categories visible
- [ ] Accordion expands/collapses
- [ ] Questions readable
- [ ] Contact CTA at bottom works

**Contact** - http://localhost:3000/contacto
- [ ] Contact form displays
- [ ] WhatsApp button links correctly
- [ ] Warehouse info shows
- [ ] Form submission shows toast (mock)

---

### 2. Calculator Testing

**Navigate to** http://localhost:3000/cotizador

**Step 1: Package Details**
- [ ] Enter dimensions: 30 x 20 x 15 cm
- [ ] Enter weight: 5 kg
- [ ] Validation shows errors for invalid input
- [ ] Click "Siguiente" advances to step 2

**Step 2: Destination**
- [ ] Enter address: "Av. Constitución 123"
- [ ] Enter city: "Monterrey"
- [ ] Select state: "Nuevo León"
- [ ] Enter zipcode: "64000"
- [ ] Click "Atrás" returns to step 1
- [ ] Click "Siguiente" advances to step 3

**Step 3: Insurance**
- [ ] Checkbox for insurance works
- [ ] Declared value input appears when checked
- [ ] Enter value: 2000 MXN
- [ ] Insurance cost calculation shows (~$40)
- [ ] Click "Calcular Precio" shows loading state
- [ ] Advances to step 4

**Step 4: Price Display**
- [ ] Service cost displays (should be ~$200-300 MXN for this example)
- [ ] Insurance cost shows if selected
- [ ] Total cost is sum of service + insurance
- [ ] Service type shown (Menudeo for 5kg)
- [ ] "Pagar y Generar Guía" button visible
- [ ] If not signed in, click shows auth prompt

---

### 3. Authentication Testing

**Sign Up Flow:**
- [ ] Click "Registrarse" in navbar
- [ ] Clerk modal opens
- [ ] Can sign up with email
- [ ] Redirects back after signup
- [ ] UserButton appears in navbar
- [ ] User created in Supabase users table (check via SQL)

**Sign In Flow:**
- [ ] Click "Iniciar Sesión"
- [ ] Clerk modal opens
- [ ] Can sign in successfully
- [ ] UserButton appears
- [ ] Dashboard link appears in navbar

**Sign Out:**
- [ ] Click UserButton
- [ ] Select "Sign out"
- [ ] Returns to signed-out state
- [ ] Can sign back in

---

### 4. Payment Flow Testing (CRITICAL)

**Prerequisites:**
- You must be signed in
- Must have Stripe test keys in .env.local
- Webhook must be configured (use Stripe CLI for local)

**Complete Flow:**
1. [ ] Go to calculator, complete all steps
2. [ ] Click "Pagar y Generar Guía"
3. [ ] Redirects to Stripe Checkout
4. [ ] Use test card: `4242 4242 4242 4242`
5. [ ] Enter any future expiry date
6. [ ] Enter any 3-digit CVC
7. [ ] Enter any ZIP code
8. [ ] Click "Pay"
9. [ ] Redirects to success page
10. [ ] Success page shows tracking number
11. [ ] Tracking number format: MPM-YYYYMMDD-XXXXX
12. [ ] Check your email for guide (PDF + QR)
13. [ ] PDF downloads correctly
14. [ ] QR code scannable (use phone camera)

**Verify in Database:**
```sql
SELECT * FROM shipments WHERE payment_status = 'paid' ORDER BY created_at DESC LIMIT 1;
SELECT * FROM status_updates ORDER BY timestamp DESC LIMIT 5;
```

---

### 5. Tracking Page Testing

**Before Route Assignment:**
- [ ] Visit tracking page: /tracking/YOUR-TRACKING-NUMBER
- [ ] Shows "Pago Confirmado - En Proceso de Asignación"
- [ ] Package details visible
- [ ] Download guide button works
- [ ] Message explains route will be assigned soon

**After Route Assignment:**
- [ ] Go to admin panel
- [ ] Assign a route to the shipment
- [ ] Refresh tracking page
- [ ] Now shows full timeline
- [ ] All route states visible
- [ ] Current state highlighted
- [ ] Completed states have checkmarks
- [ ] Pending states in gray

---

### 6. Client Dashboard Testing

**Navigate to** http://localhost:3000/dashboard

- [ ] Welcome message shows your name
- [ ] Stats cards show correct counts
- [ ] Quick track input present
- [ ] Active shipments tab works
- [ ] Completed shipments tab works
- [ ] Shipment cards display correctly
- [ ] "Rastrear" button links to tracking
- [ ] "Guía" button downloads PDF
- [ ] Empty states show when no shipments

---

### 7. Admin Panel Testing

**First, become admin:**
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

**Admin Dashboard** - http://localhost:3000/admin
- [ ] Can access admin panel (non-admins get redirected)
- [ ] Sidebar navigation visible
- [ ] KPI cards show correct stats
- [ ] Alert for pending assignments shows if any
- [ ] Recent activity feed displays
- [ ] Stats summary accurate

**Pending Shipments** - http://localhost:3000/admin/envios-pendientes
- [ ] Table shows unassigned shipments
- [ ] Search works
- [ ] Click "Asignar Ruta" opens dialog
- [ ] Shipment details show in dialog
- [ ] Can select a route from dropdown
- [ ] Route states preview appears
- [ ] Click "Confirmar Asignación" works
- [ ] Toast notification shows
- [ ] Shipment removed from pending list
- [ ] Client's tracking page now shows full timeline

**Active Shipments** - http://localhost:3000/admin/envios-activos
- [ ] Table shows assigned/active shipments
- [ ] Search filters work
- [ ] Status and route filters work
- [ ] Checkbox selection works
- [ ] Click "Actualizar" opens status dialog
- [ ] Can select new status
- [ ] Can add location and notes
- [ ] Update works and creates status_update
- [ ] Toast confirms update
- [ ] Bulk update works for multiple shipments

**Routes Management** - http://localhost:3000/admin/rutas
- [ ] Table shows all routes
- [ ] Create new route button works
- [ ] Route builder allows adding states
- [ ] Can reorder states with arrows
- [ ] Can delete states
- [ ] Preview shows timeline
- [ ] Save creates route successfully
- [ ] Edit route loads existing data
- [ ] Can update route
- [ ] Delete route shows confirmation
- [ ] Toggle active/inactive works

**Clients** - http://localhost:3000/admin/clientes
- [ ] Table shows all users with role='cliente'
- [ ] Stats cards accurate
- [ ] Search works
- [ ] Shows shipment count per client
- [ ] Shows total spent

**Pricing** - http://localhost:3000/admin/precios
- [ ] Pricing rules tab shows all rules
- [ ] Grouped by destination and type
- [ ] Insurance tab shows rates
- [ ] Can toggle active/inactive
- [ ] Examples show correctly

**Branches** - http://localhost:3000/admin/sucursales
- [ ] Table shows all branches
- [ ] Create new branch works
- [ ] Edit branch loads and updates
- [ ] Delete shows confirmation
- [ ] Toggle active works
- [ ] Employee count accurate

---

### 8. Mobile Responsiveness Testing

Test on mobile device or Chrome DevTools (F12 → Toggle device toolbar):

**iPhone/Android viewport:**
- [ ] Navbar collapses to hamburger menu
- [ ] Mobile menu opens/closes
- [ ] All pages readable on small screen
- [ ] Calculator form usable
- [ ] Tracking timeline readable
- [ ] Dashboard cards stack vertically
- [ ] Admin tables scroll horizontally
- [ ] All buttons touchable (not too small)
- [ ] Forms work with on-screen keyboard

---

### 9. Dark Mode Testing

Click the theme toggle in navbar:

- [ ] All pages switch to dark mode
- [ ] Text remains readable
- [ ] Cards have proper contrast
- [ ] Buttons visible in both modes
- [ ] Forms readable in dark mode
- [ ] Admin panel works in dark
- [ ] No white flash on page load

---

### 10. Role-Based Access Testing

**As Cliente (regular user):**
- [ ] Can access /dashboard
- [ ] Cannot access /admin (redirected)
- [ ] Can only see own shipments in dashboard
- [ ] Cannot see other users' data

**As Admin:**
- [ ] Can access /admin
- [ ] Can access /dashboard
- [ ] Can see all shipments
- [ ] Can see all users
- [ ] Can modify routes, pricing, branches

**Test RLS:**
```sql
-- Try to query as different users
-- Should only see own data
```

---

### 11. Error Handling Testing

**Test error scenarios:**
- [ ] Invalid tracking number → Shows 404
- [ ] Network error during payment → Shows error toast
- [ ] Invalid form data → Shows validation errors
- [ ] Deleted route → Handles gracefully
- [ ] Missing environment variables → Fails with clear message

---

### 12. Performance Testing

- [ ] Pages load in < 2 seconds
- [ ] No console errors
- [ ] No TypeScript errors (`bun run build`)
- [ ] Images load correctly
- [ ] Forms don't lag
- [ ] Database queries fast
- [ ] PDF generates in < 3 seconds

---

## 🎯 CRITICAL PATHS TO TEST

### Path 1: Complete User Journey
```
Landing → Calculator → Sign Up → Payment → Email → Tracking → Dashboard
```
**Expected time:** ~5 minutes
**Result:** User has shipment, guide, and can track

### Path 2: Complete Admin Flow
```
Login → Admin Dashboard → Pending Shipments → Assign Route → 
Active Shipments → Update Status → Client Sees Update
```
**Expected time:** ~3 minutes
**Result:** Shipment moves through states, client notified

### Path 3: Route Management
```
Admin → Routes → Create New Route → Edit Route → Assign to Shipment
```
**Expected time:** ~5 minutes
**Result:** Custom route created and usable

---

## 🐛 KNOWN LIMITATIONS (Minor)

1. **Contact form** - Currently shows toast but doesn't send email (can add later)
2. **Pricing CRUD** - Shows rules but create/edit dialogs disabled (add later if needed)
3. **Export feature** - Mentioned but not implemented (easy to add with CSV library)
4. **Charts** - Dashboard uses tables instead of visual charts (can add with recharts)

These are **non-critical** and can be added in Phase 2.

---

## ✅ WHEN ALL TESTS PASS

You're ready for production! 🚀

Deploy to Vercel:
```bash
vercel --prod
```

Update:
- [ ] Clerk webhook URL to production
- [ ] Stripe webhook URL to production
- [ ] NEXT_PUBLIC_APP_URL to production domain
- [ ] Test one complete flow in production

---

**Testing Status: Ready to begin after environment configuration**

Total estimated testing time: **1-2 hours** for comprehensive coverage.

Good luck! 🎊

