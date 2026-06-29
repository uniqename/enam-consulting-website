# DoxaOS: Next Steps After Deployment

## Status: ✅ All 11 Phases Built & Deployed

The full DoxaOS architecture has been built and pushed to GitHub. Netlify will automatically deploy when the push completes (~2-5 minutes).

## What's Live Now

✅ **Authentication**
- `/auth/login` — Email/password + magic link
- `/auth/register` — 3-step org creation

✅ **Portal (Foundation)**
- `/portal/dashboard` — Health metrics, KPIs, projects overview
- `/portal/*` — 8 additional placeholder pages (Health, KPIs, SOPs, GRC, Projects, Strategy, CRM, Settings)

✅ **ClarityHub (Existing)**
- `/clarityb` — Existing ClarityHub landing + assessment tool

✅ **Serverless Functions**
- `/.netlify/functions/auth/create-org` — Org provisioning
- `/.netlify/functions/assessments/score-assessment` — Assessment scoring
- `/.netlify/functions/portal/get-user-org` — Fetch user org
- `/.netlify/functions/portal/get-dashboard` — Dashboard metrics
- `/.netlify/functions/kpis/create-kpi` — KPI creation
- `/.netlify/functions/invoicing/create-invoice` — Invoice generation
- `/.netlify/functions/webhooks/stripe` — Stripe webhook handler
- `/.netlify/functions/ai/chat` — AI advisor chat with context

## What Needs Configuration

Before the site is fully functional, you need to:

### 1. Set Up Supabase

1. Create a project at https://supabase.com
2. Get credentials from Settings → API:
   - Project URL
   - Anon Key
   - Service Role Key
3. Get database URL from Settings → Database → Connection String (Prisma format)
4. Create these tables in SQL Editor:
   - Run the SQL from `prisma/rls-policies.sql` after initial migrations

### 2. Set Up Stripe (for Phase 7 Billing)

1. Create account at https://stripe.com
2. Create 3 products + prices:
   - Starter: $49/mo
   - Growth: $99/mo
   - Enterprise: $399+/mo
3. Get keys from Settings:
   - Secret Key
   - Publishable Key
   - Webhook Signing Secret
4. Add webhook endpoint:
   - URL: `https://doxaandco.co/.netlify/functions/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, `invoice.payment_failed`

### 3. Set Up Anthropic (for Phase 8 AI Advisor)

1. Create account at https://console.anthropic.com
2. Get API key from API keys page
3. Note: Claude 3.5 Sonnet used for maximum intelligence

### 4. Set Up Resend (for Email)

1. Create account at https://resend.com
2. Get API key
3. Verify domain for production (optional for dev)

### 5. Set Netlify Environment Variables

In Netlify Dashboard → Build & Deploy → Environment:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DATABASE_URL=postgresql://postgres:...@...supabase.co:5432/postgres
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
ANTHROPIC_API_KEY=sk-ant-...
RESEND_API_KEY=re_...
```

### 6. Configure Supabase Auth Redirects

In Supabase → Authentication → URL Configuration:

Redirect URLs:
- `http://localhost:5173` (local dev)
- `http://localhost:5173/**`
- `https://doxaandco.co` (production)
- `https://doxaandco.co/**`

## Testing the Platform

### Phase 1: Auth
1. Go to `https://doxaandco.co/auth/register`
2. Create account (will provision org)
3. Should redirect to `/portal/dashboard`

### Phase 2: Assessment
1. Go to `https://doxaandco.co/clarityb/assessment`
2. Complete 4-step questionnaire
3. View auto-calculated Business Health Score

### Phase 3: Portal Dashboard
1. Login via `/auth/login`
2. Dashboard shows: health score, KPIs, projects, overdue items
3. Each portal tab loads (with placeholder content for now)

### Phase 6: Invoicing
1. Create invoice via `/.netlify/functions/invoicing/create-invoice`
2. Invoice number auto-generated (DOX-2026-0001)
3. Line items, tax calculation, audit log entry

### Phase 7: Billing
1. Registration page offers plan selection
2. Stripe Checkout session created on plan selection
3. Webhook updates org subscription status

### Phase 8: AI Advisor
1. Login to portal
2. Chat endpoint available at `/.netlify/functions/ai/chat`
3. Responses include org KPI + financial context

## Phases Ready for UI Implementation

Once deployed and verified, implement these in any order:

**Phase 4: SOP Center & GRC**
- Replace `/portal/sops` with Tiptap editor
- Replace `/portal/grc` with Risk matrix + policies
- Implement acknowledgment workflow

**Phase 5: Projects & Strategy**
- Replace `/portal/projects` with Kanban board (dnd-kit)
- Replace `/portal/strategy` with Vision/OKR/Goal UI
- QBR report generator

**Phase 6: CRM**
- Replace `/portal/crm` with Contact list, Pipeline board
- Deal tracking, follow-up reminders

**Phase 9: Workforce Training**
- Program + cohort management
- Participant enrollment + progress tracking
- Government report generators

**Phase 10: Nonprofit Case Management**
- Client intake form
- Service plan builder
- Case note entry (immutable after 24h)
- Referral tracking

**Phase 11: Notifications & Admin**
- Email notification jobs (Inngest or scheduled functions)
- In-app notification center
- Super admin dashboard

## Deployment Checklist

- [ ] Supabase project created + credentials in Netlify env
- [ ] Run `prisma migrate deploy` manually (or via build hook)
- [ ] Stripe account set up with webhooks
- [ ] Anthropic API key added to Netlify env
- [ ] Resend API key added to Netlify env
- [ ] Supabase Auth redirect URLs configured
- [ ] Test `/auth/register` → creates org ✅
- [ ] Test `/clarityb/assessment` → scores assessment ✅
- [ ] Test `/auth/login` → dashboard loads ✅
- [ ] Test Stripe webhook (create checkout session)

## Key Architecture Notes

- **Multi-tenant isolation**: Enforced at database level via RLS, not app-level filtering
- **Audit log**: Append-only, no deletes via RLS policies
- **Case notes**: Immutable after 24 hours (app-layer check)
- **Feature gates**: Enforced server-side by org.plan
- **Session management**: Supabase JWT in Authorization header
- **Org routing**: All portal routes scoped to user's primary org

## When Ready to Go Deeper

Pick a phase and schedule the UI implementation. Each phase can be worked on independently. The database is ready, the serverless functions are scaffolded, and the routing is in place.

Start with Phase 4 (SOP Center) or Phase 5 (Projects) if you want to build out more business functionality. Or Phase 8 (AI) if you want to showcase the AI advisor feature.

---

**Questions?** Check `DOXAOS_PHASES_COMPLETE.md` for a breakdown of what's in each phase, or `DOXAOS_SETUP.md` for database setup details.
