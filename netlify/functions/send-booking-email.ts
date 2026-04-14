/**
 * send-booking-email.ts
 * Netlify serverless function — relays booking confirmation emails via Resend.
 *
 * Setup (one-time):
 *  1. Sign up at https://resend.com (free — 3,000 emails/month)
 *  2. Go to API Keys → Create API Key → copy it
 *  3. Netlify: Site settings → Environment variables → add:
 *       RESEND_API_KEY = re_xxxxxxxxxxxxxxxxxxxxxxxx
 *  4. (Recommended) Resend → Domains → add doxaandco.co → add the 2 DNS records
 *     This lets emails send FROM ename@doxaandco.co instead of the sandbox sender.
 *  5. In Netlify env vars also add:
 *       VITE_RESEND_CONFIGURED = true
 *     This client-side flag tells the booking page that email is active.
 *  6. Redeploy. Done.
 */

const RESEND_API = 'https://api.resend.com/emails';

interface BookingEmailParams {
  name: string;
  email: string;
  company: string;
  meetingType: string;
  meetingDate: string;
  meetingTime: string;
  agenda: string;
  fee: string | null;
  feeNote: string | null;
  guests: string[];
}

function staffHtml(p: BookingEmailParams): string {
  const feeSection = p.fee
    ? `<strong>Session Fee:</strong> ${p.fee}${p.feeNote ? `<br><em>${p.feeNote}</em>` : ''}`
    : 'No session fee';
  const guestsList = p.guests.length ? p.guests.join(', ') : 'None';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1c1917;padding:28px 40px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#C9A44A;letter-spacing:.05em;">DOXA &amp; CO</p>
            <p style="margin:4px 0 0;font-size:11px;color:#78716c;letter-spacing:.15em;text-transform:uppercase;">New Booking Notification</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 24px;font-size:15px;color:#44403c;">You have a new booking. Details below.</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;width:38%;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${p.name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;"><a href="mailto:${p.email}" style="color:#059669;text-decoration:none;">${p.email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Company</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${p.company || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Meeting Type</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${p.meetingType}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Date</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${p.meetingDate}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Time</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${p.meetingTime}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Fee</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${feeSection}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:12px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Guests</td>
                <td style="padding:10px 0;border-bottom:1px solid #e7e5e4;font-size:14px;color:#1c1917;">${guestsList}</td>
              </tr>
            </table>

            <div style="margin-top:24px;background:#fafaf9;border-left:3px solid #C9A44A;padding:16px 20px;border-radius:0 4px 4px 0;">
              <p style="margin:0 0 6px;font-size:11px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Agenda / Notes</p>
              <p style="margin:0;font-size:14px;color:#1c1917;line-height:1.6;">${p.agenda}</p>
            </div>
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

function clientHtml(p: BookingEmailParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <!-- Header -->
        <tr>
          <td style="background:#1c1917;padding:28px 40px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:20px;color:#C9A44A;letter-spacing:.05em;">DOXA &amp; CO</p>
            <p style="margin:4px 0 0;font-size:11px;color:#78716c;letter-spacing:.15em;text-transform:uppercase;">Booking Confirmed</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 8px;font-size:18px;color:#1c1917;">Hi ${p.name},</p>
            <p style="margin:0 0 28px;font-size:15px;color:#57534e;line-height:1.6;">Your booking has been received. Here's a summary of what you've scheduled.</p>

            <!-- Booking card -->
            <div style="background:#fafaf9;border:1px solid #e7e5e4;border-radius:8px;padding:24px 28px;margin-bottom:28px;">
              <p style="margin:0 0 16px;font-size:11px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.12em;">Your Session</p>
              <p style="margin:0 0 6px;font-size:20px;color:#1c1917;font-family:Georgia,serif;">${p.meetingType}</p>
              <p style="margin:0 0 4px;font-size:14px;color:#57534e;">${p.meetingDate}</p>
              <p style="margin:0;font-size:14px;color:#57534e;">${p.meetingTime}</p>
            </div>

            ${p.agenda ? `<div style="margin-bottom:28px;">
              <p style="margin:0 0 8px;font-size:11px;font-family:sans-serif;color:#78716c;text-transform:uppercase;letter-spacing:.08em;">Your Notes / Agenda</p>
              <p style="margin:0;font-size:14px;color:#44403c;line-height:1.6;">${p.agenda}</p>
            </div>` : ''}

            <p style="margin:0 0 6px;font-size:14px;color:#57534e;line-height:1.6;">If you have any questions or need to reschedule, reply to this email or reach out at <a href="mailto:ename@doxaandco.co" style="color:#059669;text-decoration:none;">ename@doxaandco.co</a>.</p>
            <p style="margin:24px 0 0;font-size:14px;color:#57534e;">Looking forward to speaking with you.</p>
            <p style="margin:4px 0 0;font-size:14px;color:#1c1917;font-family:Georgia,serif;">— Enam Egyir</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#fafaf9;padding:20px 40px;border-top:1px solid #e7e5e4;">
            <p style="margin:0;font-size:11px;font-family:sans-serif;color:#a8a29e;">Doxa &amp; Co · Strategy · Product · Delivery</p>
            <p style="margin:4px 0 0;font-size:11px;font-family:sans-serif;color:#a8a29e;">doxaandco.co · ename@doxaandco.co</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[send-booking-email] RESEND_API_KEY not set');
    return new Response(JSON.stringify({ error: 'Email service not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let params: BookingEmailParams;
  try {
    params = await req.json() as BookingEmailParams;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Determine the from address. If the domain is verified in Resend, use the real address.
  // Otherwise Resend requires using onboarding@resend.dev for unverified domains.
  const fromAddress = 'Doxa & Co <ename@doxaandco.co>';

  async function sendEmail(to: string, subject: string, html: string) {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: fromAddress, to: [to], subject, html }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend error ${res.status}: ${body}`);
    }
    return res.json();
  }

  try {
    // Staff notification
    await sendEmail(
      'ename@doxaandco.co',
      `New Booking: ${params.name} — ${params.meetingType} on ${params.meetingDate}`,
      staffHtml(params)
    );

    // Client confirmation
    await sendEmail(
      params.email,
      `Your booking with Doxa & Co is confirmed — ${params.meetingDate}`,
      clientHtml(params)
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[send-booking-email]', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = { path: '/api/send-booking-email' };
