/**
 * calendar-sync-event.ts
 * Creates a Google Calendar event after a successful booking
 * Stores the Google event ID in the meetings table
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

interface SyncEventRequest {
  meeting_id: string;
  user_email: string;
  title: string;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  description: string;
  guest_emails: string[];
  google_meet_link: string;
}

export default async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    meeting_id,
    user_email,
    title,
    start_time,
    end_time,
    description,
    guest_emails,
    google_meet_link,
  } = req.body as SyncEventRequest;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's calendar integration
    const { data: integration, error: integrationError } = await supabase
      .from('calendar_integrations')
      .select('*')
      .eq('user_email', user_email)
      .eq('is_active', true)
      .single();

    if (integrationError || !integration) {
      console.log('[calendar-sync-event] No calendar integration for:', user_email);
      // No calendar connected - skip syncing
      return res.status(200).json({ synced: false, message: 'No calendar integration' });
    }

    // Create event in Google Calendar
    const event = {
      summary: title,
      description,
      start: { dateTime: start_time, timeZone: 'America/New_York' },
      end: { dateTime: end_time, timeZone: 'America/New_York' },
      attendees: guest_emails.map(email => ({ email, responseStatus: 'needsAction' })),
      conferenceData: {
        createRequest: {
          requestId: `doxaandco-${meeting_id}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const createResponse = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${integration.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!createResponse.ok) {
      const error = await createResponse.json();
      console.error('[calendar-sync-event] Failed to create calendar event:', error);
      return res.status(200).json({ synced: false, error });
    }

    const createdEvent = await createResponse.json();
    const googleEventId = createdEvent.id;

    // Store Google event ID in meetings table
    const { error: updateError } = await supabase
      .from('meetings')
      .update({
        google_meet_link: createdEvent.conferenceData?.entryPoints?.[0]?.uri || google_meet_link,
      })
      .eq('id', meeting_id);

    if (updateError) {
      console.warn('[calendar-sync-event] Failed to update meeting with event ID:', updateError);
    }

    console.log('[calendar-sync-event] Event synced to Google Calendar:', googleEventId);

    return res.status(200).json({
      synced: true,
      google_event_id: googleEventId,
      meet_link: createdEvent.conferenceData?.entryPoints?.[0]?.uri,
    });
  } catch (error) {
    console.error('[calendar-sync-event] Error:', error);
    return res.status(500).json({ error: String(error) });
  }
};

export const config = {
  path: '/api/calendar/sync-event',
};
