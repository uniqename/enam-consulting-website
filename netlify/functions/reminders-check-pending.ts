/**
 * reminders-check-pending.ts
 * Netlify Scheduled Function - Runs every 10 minutes
 * Checks for pending meeting reminders and sends them via Resend
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

interface MeetingReminder {
  id: string;
  meeting_id: string;
  client_name: string;
  client_email: string;
  staff_email: string;
  guest_emails: string[];
  meeting_type: string;
  meeting_date: string;
  meeting_time: string;
  agenda: string;
  duration: number;
  reminder_type: '1day' | '1hour' | '30min';
  status: string;
  retry_count: number;
}

function getReminderHoursFromNow(reminderType: string): number {
  switch (reminderType) {
    case '1day':
      return 24;
    case '1hour':
      return 1;
    case '30min':
      return 0.5;
    default:
      return 0;
  }
}

function getEmailSubject(reminderType: string, meetingType: string): string {
  const timeMap = {
    '1day': 'tomorrow',
    '1hour': 'in 1 hour',
    '30min': 'in 30 minutes',
  };

  return `Reminder: ${meetingType} meeting ${timeMap[reminderType as keyof typeof timeMap] || 'soon'}`;
}

export default async (req: any, res: any) => {
  console.log('[reminders-check-pending] Cron job started');

  if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
    console.error('[reminders-check-pending] Missing environment variables');
    return res.status(503).json({ error: 'Service not configured' });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find pending reminders that should be sent now
    // A reminder should be sent when: NOW is within the window of (scheduled_time - reminder_buffer) to (scheduled_time - (reminder_buffer - 5 min))
    const now = new Date();

    // Get all pending reminders
    const { data: pendingReminders, error: fetchError } = await supabase
      .from('meeting_reminders')
      .select('*')
      .eq('status', 'pending')
      .lt('retry_count', 3); // Only try up to 3 times

    if (fetchError) {
      console.error('[reminders-check-pending] Failed to fetch pending reminders:', fetchError);
      return res.status(500).json({ error: fetchError.message });
    }

    console.log(`[reminders-check-pending] Found ${pendingReminders?.length || 0} pending reminders`);

    if (!pendingReminders || pendingReminders.length === 0) {
      return res.status(200).json({ success: true, reminders_sent: 0 });
    }

    let sentCount = 0;
    let failedCount = 0;

    // Process each reminder
    for (const reminder of pendingReminders) {
      try {
        // Parse meeting date/time to determine if this reminder should be sent
        // Format expected: "Thu July 23, 2026" and "2:00 PM – 2:30 PM EDT"
        const meetingDateStr = reminder.meeting_date; // e.g., "Thu July 23, 2026"
        const timeStr = reminder.meeting_time; // e.g., "2:00 PM – 2:30 PM EDT"

        // Extract start time
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s(AM|PM)/);
        if (!timeMatch) {
          console.warn(`[reminders-check-pending] Invalid time format: ${timeStr}`);
          continue;
        }

        // Parse meeting date and time
        const meetingDate = new Date(meetingDateStr);
        let hour = parseInt(timeMatch[1]);
        const minute = parseInt(timeMatch[2]);
        const period = timeMatch[3];

        // Convert to 24-hour format
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        meetingDate.setHours(hour, minute, 0, 0);

        // Calculate when this reminder should be sent
        const reminderHours = getReminderHoursFromNow(reminder.reminder_type);
        const scheduledSendTime = new Date(meetingDate.getTime() - reminderHours * 60 * 60 * 1000);

        // Check if we're within the 5-minute window to send this reminder
        const timeUntilSend = scheduledSendTime.getTime() - now.getTime();
        const withinWindow = timeUntilSend > -5 * 60 * 1000 && timeUntilSend < 5 * 60 * 1000;

        if (!withinWindow) {
          console.log(`[reminders-check-pending] Reminder ${reminder.id} not in send window yet`);
          continue;
        }

        // Send reminder emails
        const emailSubject = getEmailSubject(reminder.reminder_type, reminder.meeting_type);
        const allRecipients = [reminder.client_email, reminder.staff_email, ...reminder.guest_emails].filter(Boolean);

        console.log(`[reminders-check-pending] Sending reminder ${reminder.id} to ${allRecipients.length} recipients`);

        // Send email via Resend
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Doxa & Co <ename@doxaandco.co>',
            to: allRecipients,
            subject: emailSubject,
            html: generateReminderEmail(reminder),
          }),
        });

        if (!emailRes.ok) {
          const errorData = await emailRes.json();
          throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
        }

        const emailResult = await emailRes.json();

        // Mark reminder as sent
        const { error: updateError } = await supabase
          .from('meeting_reminders')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', reminder.id);

        if (updateError) {
          console.error(`[reminders-check-pending] Failed to mark reminder as sent:`, updateError);
          failedCount++;
        } else {
          console.log(`[reminders-check-pending] Reminder ${reminder.id} sent successfully`);
          sentCount++;
        }
      } catch (error) {
        console.error(`[reminders-check-pending] Error processing reminder ${reminder.id}:`, error);

        // Increment retry count
        await supabase
          .from('meeting_reminders')
          .update({
            retry_count: reminder.retry_count + 1,
            error_message: String(error),
          })
          .eq('id', reminder.id);

        failedCount++;
      }
    }

    console.log(`[reminders-check-pending] Job complete: ${sentCount} sent, ${failedCount} failed`);

    return res.status(200).json({
      success: true,
      reminders_sent: sentCount,
      reminders_failed: failedCount,
    });
  } catch (error) {
    console.error('[reminders-check-pending] Unhandled error:', error);
    return res.status(500).json({ error: String(error) });
  }
};

function generateReminderEmail(reminder: MeetingReminder): string {
  const timeMap = {
    '1day': 'tomorrow at',
    '1hour': 'in 1 hour at',
    '30min': 'in 30 minutes at',
  };

  const timeLabel = timeMap[reminder.reminder_type as keyof typeof timeMap] || 'soon';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1c1917;padding:20px 40px;text-align:center;">
            <img src="https://doxaandco.co/doxa-logo.jpg" alt="Doxa & Co" style="max-width:180px;height:auto;margin:0 auto;display:block;" />
            <p style="margin:12px 0 0;font-size:11px;color:#78716c;letter-spacing:.15em;text-transform:uppercase;">Meeting Reminder</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 20px;font-size:16px;color:#1c1917;line-height:1.6;">
              Your <strong>${reminder.meeting_type}</strong> meeting is <strong>${timeLabel} ${reminder.meeting_time}</strong>
            </p>

            <!-- Meeting Card -->
            <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:8px;padding:24px;margin-bottom:24px;">
              <p style="margin:0 0 12px;font-size:14px;color:#78716c;text-transform:uppercase;letter-spacing:.08em;font-weight:600;">Meeting Details</p>
              <p style="margin:0 0 8px;font-size:18px;color:#1c1917;font-family:Georgia,serif;">${reminder.meeting_type}</p>
              <p style="margin:0 0 4px;font-size:14px;color:#57534e;">${reminder.meeting_date}</p>
              <p style="margin:0;font-size:14px;color:#57534e;">${reminder.meeting_time}</p>
              ${reminder.agenda ? `<p style="margin:12px 0 0;font-size:13px;color:#78716c;border-top:1px solid #e7e5e4;padding-top:12px;">${reminder.agenda}</p>` : ''}
            </div>

            <!-- Google Meet Link -->
            <div style="background:#ecfdf5;border:2px solid #059669;border-radius:8px;padding:24px;margin-bottom:24px;text-align:center;">
              <p style="margin:0 0 12px;font-size:11px;font-family:sans-serif;color:#047857;text-transform:uppercase;letter-spacing:.08em;font-weight:600;">Join the Meeting</p>
              <table cellpadding="0" cellspacing="0" width="100%"><tr><td style="text-align:center;"><a href="https://meet.google.com/meet/${reminder.client_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${reminder.meeting_date.toLowerCase().replace(/[^a-z0-9]/g, '-')}" style="display:inline-block;background:#059669;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;font-family:sans-serif;border-radius:6px;">Open Google Meet</a></td></tr></table>
            </div>

            <p style="margin:0;font-size:13px;color:#78716c;line-height:1.6;">
              If you have any questions or need to reschedule, please reach out to <a href="mailto:ename@doxaandco.co" style="color:#059669;text-decoration:none;">ename@doxaandco.co</a>.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#fafaf9;padding:20px 40px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:11px;font-family:sans-serif;color:#a8a29e;">doxaandco.co · ename@doxaandco.co</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export const config = {
  schedule: '*/10 * * * *', // Run every 10 minutes
};
