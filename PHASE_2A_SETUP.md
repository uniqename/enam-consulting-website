# Phase 2a Setup Guide

Complete checklist to activate Phase 2a features (People Management, Reminders, Calendar Sync).

## 1. Database Migration

Run the following SQL in Supabase SQL Editor:

```bash
# Copy contents of: database/migrations/002-phase-2a-schema.sql
# Paste into Supabase SQL Editor and execute
```

This creates tables for:
- `meetings` - Track all scheduled meetings
- `contact_notes` - Interaction timeline
- `meeting_reminders` - Scheduled reminders
- `calendar_integrations` - Google OAuth tokens
- `booking_conflicts` - Audit trail

## 2. Environment Variables

Add to Netlify environment variables:

### Already Set
- `VITE_SUPABASE_URL` ✓
- `VITE_SUPABASE_ANON_KEY` ✓
- `VITE_SUPABASE_SERVICE_KEY` / `SUPABASE_SERVICE_KEY` ✓
- `RESEND_API_KEY` ✓

### Google OAuth (NEW)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 credential (Web application)
3. Add authorized redirect URI:
   ```
   https://doxaandco.co/.netlify/functions/calendar-oauth-callback
   ```
4. Copy the Client ID and Secret

Add to Netlify:
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## 3. Features Unlocked

### People Dashboard (`/dashboard/contacts`)
- View all contacts with search & filters
- See interaction timeline for each contact
- Quick actions: schedule meeting, send email, add notes
- Filter by meeting type, status, date range

### Automated Reminders
- Sends 3 emails per meeting:
  - 1 day before
  - 1 hour before
  - 30 minutes before
- Recipients: Client + Staff + Any guests
- Runs every 10 minutes automatically
- Includes meeting details, Google Meet link, agenda

### Calendar Sync
- Connect Google Calendar to prevent double-booking
- Check for conflicts before confirming booking
- Suggest alternative times if conflict detected
- Auto-sync bookings to Google Calendar
- Token refresh handling for expired credentials

## 4. Testing Checklist

- [ ] Database migration runs without errors
- [ ] `/dashboard/contacts` page loads
- [ ] Contact list displays from database
- [ ] Search and filters work
- [ ] Click contact shows details panel
- [ ] Google Calendar connect button appears
- [ ] OAuth flow completes (redirects back with `?calendar_connected=true`)
- [ ] Create test meeting and verify reminder is scheduled
- [ ] Wait 10+ minutes and verify reminder email arrives
- [ ] Calendar shows booked meeting

## 5. Known Limitations

- Reminders run every 10 minutes (not exact timing)
- Google Calendar sync requires user OAuth connection
- Calendar conflicts only check if calendar connected
- Tokens refresh automatically when expired
- Business hours for suggested times: 9 AM - 5 PM ET

## 6. Troubleshooting

**Reminders not sending:**
- Check Netlify function logs: `reminders-check-pending`
- Verify `RESEND_API_KEY` is correct
- Check Supabase `meeting_reminders` table for pending items

**Calendar won't connect:**
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Verify redirect URI matches exactly
- Check browser console for OAuth errors

**Contacts not loading:**
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Verify RLS policies allow reads on `contacts` table
- Check Supabase for actual contact records

## 7. Next Steps (Phase 2b)

- Pipeline Management (sales funnel)
- Reports (booking analytics)
- Invoices (revenue tracking)
- Email Marketing (broadcast campaigns)
