/**
 * sync-mailchimp.ts
 * Netlify serverless function — add booking to Mailchimp list and tag them.
 *
 * Setup (one-time):
 *  1. Sign up at https://mailchimp.com (free tier: 500 contacts)
 *  2. Create audience named "Doxa Prospects"
 *  3. Go to Settings → API Keys → Create Key → copy it
 *  4. Get your Server Prefix (e.g., us1, us2) from API key docs
 *  5. Netlify: Site settings → Environment variables → add:
 *       MAILCHIMP_API_KEY = your_api_key_here
 *       MAILCHIMP_SERVER = us1 (or whatever yours is)
 *       MAILCHIMP_AUDIENCE_ID = your_audience_id_here
 *  6. Create automation in Mailchimp:
 *     - When tagged "doxa-prospect" → send welcome sequence
 *     - Include: intro email → assessment link → post-assessment follow-up
 *  7. Redeploy. Done.
 */

import { Handler } from '@netlify/functions';

interface MailchimpContactData {
  email: string;
  name: string;
  company: string;
  meetingType: string;
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
    console.warn('[sync-mailchimp] Mailchimp not configured');
    return {
      statusCode: 503,
      body: JSON.stringify({
        error: 'Mailchimp not configured',
        hint: 'Set MAILCHIMP_API_KEY, MAILCHIMP_SERVER, MAILCHIMP_AUDIENCE_ID in Netlify env',
      }),
    };
  }

  try {
    const data: MailchimpContactData = JSON.parse(event.body || '{}');

    if (!data.email || !data.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email or name' }),
      };
    }

    // Hash email for unique ID (Mailchimp requirement)
    const crypto = require('crypto');
    const subscriber_hash = crypto.createHash('md5').update(data.email.toLowerCase()).digest('hex');

    const mailchimpUrl = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriber_hash}`;

    // Add/update subscriber with tags
    const response = await fetch(mailchimpUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: data.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: data.name.split(' ')[0] || '',
          LNAME: data.name.split(' ').slice(1).join(' ') || '',
          COMPANY: data.company || '',
        },
        tags: ['doxa-prospect', `${data.meetingType.toLowerCase().replace(/\s+/g, '-')}`],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('[sync-mailchimp] Mailchimp error:', response.status, errorBody);
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: 'Failed to sync with Mailchimp',
          details: errorBody,
        }),
      };
    }

    const result = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Contact added to Mailchimp',
        subscriberId: result.id,
      }),
    };
  } catch (error) {
    console.error('[sync-mailchimp] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to sync Mailchimp',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
