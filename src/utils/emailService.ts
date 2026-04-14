/**
 * emailService.ts
 * Sends booking confirmation emails via EmailJS.
 *
 * Setup (one-time):
 *  1. Sign up at https://emailjs.com (free — 200 emails/month)
 *  2. Add your Gmail / Outlook under Email Services → note the Service ID
 *  3. Create TWO email templates (see template variables below) → note each Template ID
 *  4. Copy your Public Key from Account → API Keys
 *  5. In Netlify: Site settings → Environment variables, add:
 *       VITE_EMAILJS_SERVICE_ID    = service_xxxxxxx
 *       VITE_EMAILJS_TEMPLATE_STAFF = template_xxxxxxx   (email to you)
 *       VITE_EMAILJS_TEMPLATE_CLIENT = template_xxxxxxx  (confirmation to booker)
 *       VITE_EMAILJS_PUBLIC_KEY    = xxxxxxxxxxxxxxxxxxxx
 *  6. Redeploy. Done.
 *
 * Template variables used:
 *  Staff template   → to_email, from_name, from_email, meeting_type, meeting_date,
 *                     meeting_time, agenda, company, fee_section, guests_list
 *  Client template  → to_name, to_email, meeting_type, meeting_date, meeting_time,
 *                     agenda, site_email
 */

import emailjs from '@emailjs/browser';

const SERVICE_ID    = import.meta.env.VITE_EMAILJS_SERVICE_ID    as string | undefined;
const TMPL_STAFF    = import.meta.env.VITE_EMAILJS_TEMPLATE_STAFF  as string | undefined;
const TMPL_CLIENT   = import.meta.env.VITE_EMAILJS_TEMPLATE_CLIENT as string | undefined;
const PUBLIC_KEY    = import.meta.env.VITE_EMAILJS_PUBLIC_KEY    as string | undefined;

const configured = !!(SERVICE_ID && TMPL_STAFF && TMPL_CLIENT && PUBLIC_KEY);

export interface BookingEmailParams {
  name: string;
  email: string;
  company: string;
  meetingType: string;
  meetingDate: string;   // e.g. "Thursday June 12, 2025"
  meetingTime: string;   // e.g. "10:00 AM"
  agenda: string;
  fee: string | null;
  feeNote: string | null;
  guests: string[];
}

/** Returns true if EmailJS env vars are configured. */
export function emailConfigured(): boolean {
  return configured;
}

/** Send the staff notification and client confirmation emails. */
export async function sendBookingEmails(params: BookingEmailParams): Promise<void> {
  if (!configured) {
    console.warn(
      '[emailService] EmailJS not configured. Set VITE_EMAILJS_* env vars in Netlify.'
    );
    return;
  }

  const feeSection = params.fee
    ? `Session Fee: ${params.fee}${params.feeNote ? `\n${params.feeNote}` : ''}`
    : 'No session fee';

  const guestsList = params.guests.length
    ? params.guests.join(', ')
    : 'None';

  // Email to Enam (staff notification)
  await emailjs.send(
    SERVICE_ID!,
    TMPL_STAFF!,
    {
      to_email:     'ename@doxaandco.co',
      from_name:    params.name,
      from_email:   params.email,
      meeting_type: params.meetingType,
      meeting_date: params.meetingDate,
      meeting_time: params.meetingTime,
      agenda:       params.agenda,
      company:      params.company || 'N/A',
      fee_section:  feeSection,
      guests_list:  guestsList,
    },
    PUBLIC_KEY
  );

  // Confirmation email to the person who booked
  await emailjs.send(
    SERVICE_ID!,
    TMPL_CLIENT!,
    {
      to_name:      params.name,
      to_email:     params.email,
      meeting_type: params.meetingType,
      meeting_date: params.meetingDate,
      meeting_time: params.meetingTime,
      agenda:       params.agenda,
      site_email:   'ename@doxaandco.co',
    },
    PUBLIC_KEY
  );
}
