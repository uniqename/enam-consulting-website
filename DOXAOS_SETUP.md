# DoxaOS Phase 0: Foundation Setup

## What's Been Done

✅ **Prisma Schema Complete**
- All 27 models from spec created
- Multi-tenant design with org_id on every model
- Soft deletes on all entities
- Proper relationships with disambiguated relation names
- Prisma client generated (`npx prisma generate`)

✅ **RLS Policies Created**
- Comprehensive Row Level Security policies in `prisma/rls-policies.sql`
- Multi-tenant isolation enforced at DB level
- Append-only audit log (no updates/deletes)
- Case notes immutable after 24 hours (app-side enforcement)

✅ **Serverless Foundation**
- Auth helper functions in `netlify/functions/lib/auth.ts`
- JWT verification
- Org access control
- Role checking (org_admin, super_admin)

✅ **Environment Setup**
- `.env.doxaos.example` template with all required variables
- Instructions for configuring Supabase, Stripe, Resend, R2

## Next Steps: Complete Phase 0

### 1. Set Up Supabase

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key from project settings
3. Create a service role key: Settings → API → Service Role Key
4. Get the database connection URL: Settings → Database → Connection String (use Prisma format)

### 2. Set Up Environment Variables

```bash
cp .env.doxaos.example .env.local
# Edit .env.local and fill in your Supabase credentials
```

### 3. Run Prisma Migrations

```bash
npx prisma migrate deploy
# This creates all tables from the schema
```

### 4. Apply RLS Policies

```bash
# Using psql (if you have it installed)
psql "$DATABASE_URL" -f prisma/rls-policies.sql

# OR via Supabase SQL editor:
# 1. Go to Supabase dashboard
# 2. SQL Editor
# 3. Copy contents of prisma/rls-policies.sql
# 4. Run the script
```

### 5. Configure Supabase Auth

1. Go to Supabase → Authentication → URL Configuration
2. Add redirect URLs:
   - `http://localhost:5173` (local dev)
   - `http://localhost:5173/**` (for auth callbacks)
   - `https://doxaandco.co` (production)
   - `https://doxaandco.co/**` (for auth callbacks)
3. Enable Email provider (default)
4. Optional: Enable Magic Link

### 6. Set Up Stripe (if implementing billing in Phase 7)

1. Create a Stripe account
2. Create products for pricing tiers:
   - Starter ($79/mo or $790/yr)
   - Growth ($179/mo or $1,790/yr)
   - Enterprise ($399+/mo)
3. Create prices and copy their IDs to `.env.local`
4. Create a webhook endpoint: `https://doxaandco.co/api/webhooks/stripe`

### 7. Set Up Resend (if implementing email)

1. Create account at https://resend.com
2. Copy API key to `.env.local`
3. Verify sender domain (for production)

### 8. Verify Setup

```bash
# Test Prisma client
npx prisma db seed

# Test Supabase connection
# (Create a test function in netlify/functions/)
```

## Architecture Notes

### Multi-Tenant Isolation

Every table has `orgId` (except User). RLS policies ensure:
- Users can only see data from organizations they're members of
- Super admin can see all data
- All queries are automatically scoped to user's orgs
- Audit log is append-only (no deletes)

### Serverless Functions

- Live at `netlify/functions/`
- Auth middleware in `lib/auth.ts`
- All functions must:
  1. Verify JWT token
  2. Check org access
  3. Log action to AuditLog
  4. Return typed responses

### Database Access Pattern

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Query with org isolation (RLS enforces this)
const { data } = await supabase
  .from('KPI')
  .select('*')
  .eq('orgId', orgId); // Always include orgId filter
```

## Phase 0 Checklist

- [ ] Supabase project created
- [ ] Environment variables set in `.env.local`
- [ ] Prisma migrations deployed (`npx prisma migrate deploy`)
- [ ] RLS policies applied (via SQL)
- [ ] Supabase Auth redirects configured
- [ ] Stripe products created (for later)
- [ ] Resend account created (for later)
- [ ] Test query works against Supabase

## Known Limitations & TODO

- **AI tokens tracking**: `Organization.aiTokenBudget` and `AIUsageLog` table exist but not yet integrated
- **File storage**: R2 integration not yet in functions (add in Phase 8)
- **Realtime**: Supabase Realtime subscriptions not yet wired in React (add in Phase 3+)
- **Email templates**: Resend integration not yet in functions (add as needed)

## Phase 1 Preview

Once Phase 0 is verified, Phase 1 will implement:
1. Login page (Supabase Auth)
2. Register page (org creation wizard)
3. Invite system (email invites)
4. Multi-org switcher
5. Role-based access control UI

See `/Users/enamegyir/.claude/plans/doxaos-vite-react-full.md` for full roadmap.
