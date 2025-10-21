# MyPack Final

A modern Next.js application with Supabase authentication and Clerk integration.

## Tech Stack

- **Framework**: Next.js 15.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Authentication**: Supabase Auth + Clerk
- **Database**: Supabase
- **Package Manager**: Bun

## Core Features

### Authentication & Database
- **Supabase Integration**: Full-stack authentication and database solution
  - Client-side auth (`src/utils/supabase/client.ts`)
  - Server-side auth (`src/utils/supabase/server.ts`)
  - Middleware session management (`src/utils/supabase/middleware.ts`)
  - PostgreSQL database with TypeScript type generation
- **Clerk Authentication**: Additional authentication layer with middleware integration

### Shipments Management
- **Shipments Tracking**: Track and manage package shipments
  - View all shipments with real-time status updates
  - Track sender and recipient information
  - Monitor shipment dimensions and weight
  - View shipping dates and delivery estimates
  - Access shipments at `/shipments`
- **Database Schema**: Fully typed shipments table with Row Level Security (RLS) enabled
- **TypeScript Types**: Auto-generated database types for type-safe queries

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- A Supabase account and project
- A Clerk account (if using Clerk features)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env.local` file based on `.env.local.example`:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key
   ```

### Development

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

Build for production:

```bash
bun run build
```

### Start Production Server

```bash
bun start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Clerk provider
│   ├── page.tsx           # Home page
│   ├── shipments/         # Shipments management
│   │   └── page.tsx       # Shipments list page
│   └── globals.css        # Global styles
├── middleware.ts          # Combined Clerk + Supabase middleware
├── types/
│   └── database.types.ts  # Auto-generated Supabase types
└── utils/
    └── supabase/          # Supabase utilities
        ├── client.ts      # Browser client
        ├── server.ts      # Server client (for Server Components)
        └── middleware.ts  # Middleware session handler
```

## Supabase Setup

### Client-Side Usage

For client components:

```typescript
'use client';

import { createClient } from '@/utils/supabase/client';

export default function ClientComponent() {
  const supabase = createClient();
  
  // Use supabase client...
}
```

### Server-Side Usage

For server components and actions:

```typescript
import { createClient } from '@/utils/supabase/server';

export default async function ServerComponent() {
  const supabase = await createClient();
  
  // Use supabase client...
}
```

### Middleware

The middleware automatically:
- Refreshes Supabase sessions on each request
- Integrates with Clerk authentication
- Handles cookie management for both auth providers

## Database

### Schema

#### Shipments Table
The `shipments` table stores package tracking information:

```typescript
interface Shipment {
  id: string                    // UUID primary key
  tracking_number: string       // Unique tracking number
  status: string                // pending | in_transit | out_for_delivery | delivered | cancelled
  sender_name: string           // Sender's name
  sender_address: string        // Sender's full address
  recipient_name: string        // Recipient's name
  recipient_address: string     // Recipient's full address
  weight: number                // Package weight in lbs
  dimensions: {                 // Package dimensions in inches
    height: number
    width: number
    length: number
  }
  shipped_date: string | null   // When the package was shipped
  estimated_delivery: string | null  // Estimated delivery date
  actual_delivery: string | null     // Actual delivery date
  created_at: string            // Record creation timestamp
  updated_at: string            // Record update timestamp
}
```

### TypeScript Types

Database types are automatically generated from the Supabase schema and located in `src/types/database.types.ts`. Use them for type-safe database queries:

```typescript
import type { Shipment, ShipmentInsert, ShipmentUpdate } from '@/types/database.types';

// Query shipments
const { data: shipments } = await supabase
  .from('shipments')
  .select('*');

// Insert a new shipment
const newShipment: ShipmentInsert = {
  tracking_number: 'TRACK-001',
  status: 'pending',
  // ... other fields
};
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
