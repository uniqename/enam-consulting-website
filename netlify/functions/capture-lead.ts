/**
 * capture-lead.ts
 * Netlify serverless function — capture email signups from Doxa website.
 *
 * Flow:
 *  1. User enters email on website (newsletter signup, lead magnet, etc.)
 *  2. Add to Mailchimp "Doxa Newsletter" list
 *  3. Track as LEAD in CRM pipeline
 *
 * Uses same Mailchimp config as booking integration.
 */

import { Handler } from '@netlify/functions';

interface CaptureInput {
  email: string;
  source?: string; // e.g., "landing-hero", "about-sidebar"
  name?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const server = process.env.MAILCHIMP_SERVER;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

  if (!apiKey || !server || !audienceId) {
    console.warn('[capture-lead] Mailchimp not configured');
    return {
      statusCode: 503,
      body: JSON.stringify({
        error: 'Email service not configured',
      }),
    };
  }

  try {
    const input: CaptureInput = JSON.parse(event.body || '{}');

    if (!input.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email' }),
      };
    }

    // Hash email for unique ID
    const crypto = require('crypto');
    const subscriber_hash = crypto.createHash('md5').update(input.email.toLowerCase()).digest('hex');

    const mailchimpUrl = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriber_hash}`;

    // Add to Mailchimp with "newsletter" tag
    const mailchimpRes = await fetch(mailchimpUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: input.email,
        status: 'subscribed',
        merge_fields: input.name
          ? {
              FNAME: input.name.split(' ')[0] || '',
              LNAME: input.name.split(' ').slice(1).join(' ') || '',
            }
          : {},
        tags: ['doxa-newsletter', `source-${input.source || 'unknown'}`],
      }),
    });

    if (!mailchimpRes.ok) {
      const errorBody = await mailchimpRes.text();
      console.error('[capture-lead] Mailchimp error:', mailchimpRes.status, errorBody);
      // Don't fail — Mailchimp duplicate subscribers return 400, which is fine
      if (mailchimpRes.status === 400 && errorBody.includes('already')) {
        // Email already subscribed
        return {
          statusCode: 200,
          body: JSON.stringify({
            success: true,
            message: 'Already subscribed',
          }),
        };
      }
      return {
        statusCode: mailchimpRes.status,
        body: JSON.stringify({
          error: 'Failed to add to mailing list',
        }),
      };
    }

    // Track in CRM pipeline
    try {
      await fetch(`${process.env.URL || 'https://doxaandco.co'}/.netlify/functions/track-pipeline-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: input.email,
          stage: 'LEAD',
          source: input.source || 'website-signup',
          metadata: {
            name: input.name,
          },
        }),
      });
    } catch (err) {
      console.error('[capture-lead] Failed to track pipeline (non-blocking):', err);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Email captured and added to newsletter',
      }),
    };
  } catch (error) {
    console.error('[capture-lead] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to capture lead',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
