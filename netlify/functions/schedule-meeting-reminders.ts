import { createClient } from '@supabase/supabase-js';
import { sendBookingEmails } from '../utils/emailService';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;

export default async (req: any, res: any) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { clientName, clientEmail, staffEmail, guestEmails = [], meetingType, meetingDate, meetingTime, agenda, duration = 60 } = req.body;

  if (!clientName || !clientEmail || !meetingDate || !meetingTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse meeting date and time to calculate reminder times
    const [dateStr, timeStr] = [meetingDate, meetingTime];
    // Expected format: "Wed July 23, 2026" and "9:00 AM – 9:30 AM EDT"
    const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s(AM|PM)/);
    if (!timeMatch) {
      return res.status(400).json({ error: 'Invalid time format' });
    }

    // Store meeting reminder in database for cron job to process
    const { data, error } = await supabase
      .from('meeting_reminders')
      .insert({
        client_name: clientName,
        client_email: clientEmail,
        staff_email: staffEmail,
        guest_emails: guestEmails,
        meeting_type: meetingType,
        meeting_date: meetingDate,
        meeting_time: meetingTime,
        agenda: agenda,
        duration_minutes: duration,
        reminder_1day_sent: false,
        reminder_1hour_sent: false,
        reminder_30min_sent: false,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('[schedule-meeting-reminders] Database error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Note: Actual reminder sending will be handled by a cron function
    // For now, we're just scheduling them in the database
    console.log('[schedule-meeting-reminders] Reminders scheduled for:', clientEmail);

    return res.status(200).json({
      success: true,
      reminder: data?.[0],
      message: 'Meeting reminders scheduled (1 day, 1 hour, 30 min before)',
      note: 'Reminders will be sent via a scheduled cron job',
    });
  } catch (err: any) {
    console.error('[schedule-meeting-reminders] Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
