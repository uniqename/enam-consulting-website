/**
 * capture-lead.ts
 * Netlify serverless function — capture email signups.
 *
 * Flow:
 *  1. User enters email on website (newsletter signup, lead magnet, etc.)
 *  2. Add to email_subscribers table in database
 *  3. Track as LEAD in CRM pipeline
 *
 * No external dependencies — all data stored in Supabase.
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

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

  try {
    const input: CaptureInput = JSON.parse(event.body || '{}');

    if (!input.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email' }),
      };
    }

    // Add to email_subscribers table (upsert in case email already exists)
    const subscriber = await prisma.emailSubscriber.upsert({
      where: { email: input.email },
      update: {
        subscribed: true,
        updatedAt: new Date(),
      },
      create: {
        email: input.email,
        name: input.name,
        source: input.source || 'website-signup',
        stage: 'LEAD',
        subscribed: true,
      },
    });

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
        message: 'Email captured',
        subscriberId: subscriber.id,
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
