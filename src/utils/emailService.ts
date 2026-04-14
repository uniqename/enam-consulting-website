/**
 * emailService.ts
 * Sends booking confirmation emails via a Netlify serverless function (Resend).
 *
 * Setup (one-time):
 *  1. Sign up at https://resend.com (free — 3,000 emails/month)
 *  2. Go to API Keys → Create API Key → copy it
 *  3. Netlify: Site settings → Environment variables → add:
 *       RESEND_API_KEY        = re_xxxxxxxxxxxxxxxxxxxxxxxx   (server-side, never exposed)
 *       VITE_RESEND_CONFIGURED = true                        (client-side flag)
 *  4. (Recommended) Resend → Domains → add doxaandco.co → add the 2 DNS records
 *     This lets emails send FROM ename@doxaandco.co instead of the sandbox sender.
 *  5. Redeploy. Done.
 *
 * The actual API key stays server-side in the Netlify function.
 * This file only uses VITE_RESEND_CONFIGURED to know whether to attempt sending.
 */

const CONFIGURED = import.meta.env.VITE_RESEND_CONFIGURED === 'true';

export interface BookingEmailParams {
  name: string;
  email: string;
  company: string;
  meetingType: string;
  meetingDate: string;   // e.g. "Thursday June 12, 2025"
  meetingTime: string;   // e.g. "10:00 AM – 10:30 AM EDT"
  agenda: string;
  fee: string | null;
  feeNote: string | null;
  guests: string[];
}

/** Returns true if the email relay is configured. */
export function emailConfigured(): boolean {
  return CONFIGURED;
}

/** Send the staff notification and client confirmation emails via Netlify function → Resend. */
export async function sendBookingEmails(params: BookingEmailParams): Promise<void> {
  if (!CONFIGURED) {
    console.warn(
      '[emailService] Email not configured. ' +
      'Set RESEND_API_KEY and VITE_RESEND_CONFIGURED=true in Netlify env vars.'
    );
    return;
  }

  const res = await fetch('/.netlify/functions/send-booking-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Email relay failed (${res.status}): ${body}`);
  }
}
