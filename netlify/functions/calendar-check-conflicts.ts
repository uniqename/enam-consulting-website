/**
 * calendar-check-conflicts.ts
 * Checks if a proposed meeting time conflicts with user's Google Calendar
 * Returns list of conflicting events and suggested alternative times
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

interface ConflictCheckRequest {
  user_email: string;
  proposed_start_time: string; // ISO 8601
  proposed_end_time: string; // ISO 8601
  meeting_duration_minutes: number;
}

interface ConflictCheckResponse {
  has_conflict: boolean;
  conflicting_events: any[];
  suggested_times: string[];
}

export default async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_email, proposed_start_time, proposed_end_time, meeting_duration_minutes } = req.body as ConflictCheckRequest;

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
      console.log('[calendar-check-conflicts] No calendar integration found for:', user_email);
      // No calendar connected - no conflicts possible
      return res.status(200).json({
        has_conflict: false,
        conflicting_events: [],
        suggested_times: [],
      } as ConflictCheckResponse);
    }

    // Check if token is expired and refresh if needed
    let accessToken = integration.access_token;
    if (new Date(integration.expires_at) < new Date()) {
      console.log('[calendar-check-conflicts] Refreshing expired token for:', user_email);
      accessToken = await refreshGoogleToken(integration.refresh_token);

      if (!accessToken) {
        return res.status(200).json({
          has_conflict: false,
          conflicting_events: [],
          suggested_times: [],
        } as ConflictCheckResponse);
      }

      // Update token in database
      await supabase
        .from('calendar_integrations')
        .update({ access_token: accessToken })
        .eq('id', integration.id);
    }

    // Fetch user's calendar events for the proposed date
    const startTime = new Date(proposed_start_time);
    const endTime = new Date(proposed_end_time);

    const conflicts = await fetchConflictingEvents(accessToken, startTime, endTime);

    // Generate suggested alternative times (next 5 available slots)
    const suggestedTimes = await generateSuggestedTimes(
      accessToken,
      startTime,
      meeting_duration_minutes,
      5
    );

    console.log(`[calendar-check-conflicts] Found ${conflicts.length} conflicts for ${user_email}`);

    return res.status(200).json({
      has_conflict: conflicts.length > 0,
      conflicting_events: conflicts,
      suggested_times: suggestedTimes,
    } as ConflictCheckResponse);
  } catch (error) {
    console.error('[calendar-check-conflicts] Error:', error);
    return res.status(500).json({ error: String(error) });
  }
};

async function refreshGoogleToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      console.error('[calendar-check-conflicts] Token refresh failed');
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('[calendar-check-conflicts] Error refreshing token:', error);
    return null;
  }
}

async function fetchConflictingEvents(
  accessToken: string,
  startTime: Date,
  endTime: Date
): Promise<any[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${startTime.toISOString()}&` +
      `timeMax=${endTime.toISOString()}&` +
      `singleEvents=true&` +
      `orderBy=startTime`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      console.error('[calendar-check-conflicts] Failed to fetch calendar events');
      return [];
    }

    const data = await response.json();
    return (data.items || []).filter(
      (event: any) =>
        event.status !== 'cancelled' &&
        (!event.transparency || event.transparency === 'opaque')
    );
  } catch (error) {
    console.error('[calendar-check-conflicts] Error fetching events:', error);
    return [];
  }
}

async function generateSuggestedTimes(
  accessToken: string,
  startDate: Date,
  durationMinutes: number,
  count: number
): Promise<string[]> {
  const suggested: string[] = [];
  const businessHourStart = 9; // 9 AM
  const businessHourEnd = 17; // 5 PM

  let current = new Date(startDate);

  // Move to next day if past business hours
  if (current.getHours() >= businessHourEnd) {
    current.setDate(current.getDate() + 1);
    current.setHours(businessHourStart, 0, 0, 0);
  }

  while (suggested.length < count) {
    // Check if current time is in business hours
    if (current.getHours() >= businessHourStart && current.getHours() < businessHourEnd) {
      // Check for conflicts
      const proposedEnd = new Date(current.getTime() + durationMinutes * 60000);

      if (proposedEnd.getHours() <= businessHourEnd) {
        const conflicts = await fetchConflictingEvents(accessToken, current, proposedEnd);

        if (conflicts.length === 0) {
          suggested.push(current.toISOString());
        }
      }
    }

    // Move to next 30-minute slot
    current.setMinutes(current.getMinutes() + 30);

    // Skip to next day if past business hours
    if (current.getHours() >= businessHourEnd) {
      current.setDate(current.getDate() + 1);
      current.setHours(businessHourStart, 0, 0, 0);
    }
  }

  return suggested;
}

export const config = {
  path: '/api/calendar/check-conflicts',
};
