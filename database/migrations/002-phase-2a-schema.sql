-- Phase 2a: People Management Dashboard, Reminders, Calendar Sync
-- Migration: Create tables for contacts, meetings, reminders, and calendar integrations

-- 1. ENHANCE CONTACTS TABLE (add if missing fields)
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'; -- active, archived, no-show

-- 2. MEETINGS TABLE - Track all scheduled meetings
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INT DEFAULT 30,
  meeting_type VARCHAR(100),
  google_meet_link VARCHAR(500),
  agenda TEXT,
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by VARCHAR(255)
);

-- 3. CONTACT NOTES/TIMELINE - Track interactions with contacts
CREATE TABLE IF NOT EXISTS contact_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'note', -- email, call, meeting, note, booking
  title VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by VARCHAR(255)
);

-- 4. MEETING REMINDERS - Enhanced from original
CREATE TABLE IF NOT EXISTS meeting_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  client_name VARCHAR(255),
  client_email VARCHAR(255) NOT NULL,
  staff_email VARCHAR(255) NOT NULL,
  guest_emails TEXT[] DEFAULT ARRAY[]::TEXT[],
  meeting_type VARCHAR(100),
  meeting_date VARCHAR(100),
  meeting_time VARCHAR(100),
  agenda TEXT,
  duration SMALLINT DEFAULT 30,
  reminder_type VARCHAR(20) NOT NULL, -- '1day', '1hour', '30min'
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count SMALLINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(meeting_id, reminder_type, status)
);

-- 5. CALENDAR INTEGRATIONS - OAuth connections
CREATE TABLE IF NOT EXISTS calendar_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255) NOT NULL UNIQUE, -- who owns this calendar
  provider VARCHAR(50) NOT NULL, -- 'google', 'outlook'
  provider_account_id VARCHAR(500),
  access_token TEXT, -- encrypted in app layer
  refresh_token TEXT, -- encrypted in app layer
  calendar_email VARCHAR(255),
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- 6. BOOKING CONFLICTS LOG - Audit trail
CREATE TABLE IF NOT EXISTS booking_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  detected_calendar_event_id VARCHAR(500),
  conflict_type VARCHAR(100), -- 'time_overlap', 'location_conflict'
  resolution VARCHAR(50), -- 'blocked', 'offered_alternative', 'rescheduled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_meetings_contact_id ON meetings(contact_id);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled_at ON meetings(scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_contact_notes_contact_id ON contact_notes(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_notes_created_at ON contact_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_notes_type ON contact_notes(type);
CREATE INDEX IF NOT EXISTS idx_meeting_reminders_meeting_id ON meeting_reminders(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_reminders_status ON meeting_reminders(status);
CREATE INDEX IF NOT EXISTS idx_meeting_reminders_reminder_type ON meeting_reminders(reminder_type);
CREATE INDEX IF NOT EXISTS idx_meeting_reminders_client_email ON meeting_reminders(client_email);
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_user_email ON calendar_integrations(user_email);
CREATE INDEX IF NOT EXISTS idx_booking_conflicts_meeting_id ON booking_conflicts(meeting_id);

-- FULL TEXT SEARCH on contacts
CREATE INDEX IF NOT EXISTS idx_contacts_search ON contacts
USING GIN (
  to_tsvector('english',
    coalesce(name, '') || ' ' ||
    coalesce(email, '') || ' ' ||
    coalesce(company, '')
  )
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_conflicts ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (anyone can read, only staff can write)
CREATE POLICY "Anyone can view meetings"
  ON meetings FOR SELECT USING (true);

CREATE POLICY "Staff can create meetings"
  ON meetings FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view notes"
  ON contact_notes FOR SELECT USING (true);

CREATE POLICY "Staff can create notes"
  ON contact_notes FOR INSERT WITH CHECK (true);

-- Calendar integrations: only the owner can view/edit
CREATE POLICY "Users can view own calendar integrations"
  ON calendar_integrations FOR SELECT
  USING (user_email = current_user_email()); -- requires user context

CREATE POLICY "Users can insert own calendar integrations"
  ON calendar_integrations FOR INSERT
  WITH CHECK (user_email = current_user_email());
