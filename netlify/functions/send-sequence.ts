/**
 * send-sequence.ts
 * Netlify serverless function — send automated email sequences.
 *
 * Triggered by a cron job or manual call:
 *  1. Find subscribers in a stage (LEAD, PROSPECT, PAID, CLIENT)
 *  2. Look up what emails they should get next
 *  3. Send via Resend
 *  4. Track in email_sequences table
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendSequenceInput {
  sequenceType: 'welcome' | 'post-booking' | 'nurture' | 'abandoned';
  stage: 'LEAD' | 'PROSPECT' | 'PAID' | 'CLIENT';
  limit?: number;
}

// Email templates for each sequence
const sequences: Record<string, Record<number, { subject: string; html: string }>> = {
  welcome: {
    1: {
      subject: 'Welcome to Doxa',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937;">Welcome to Doxa & Co</h1>
          <p>Thanks for signing up! We share actionable strategies for scaling your business.</p>
          <p style="margin-top: 30px;">Check out our latest insights in the next email.</p>
          <p style="margin-top: 30px; color: #6b7280;">Best,<br/>The Doxa Team</p>
        </div>
      `,
    },
    2: {
      subject: 'Your Business Operating System Awaits',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937;">Take Your Free Assessment</h1>
          <p>See how your business health stacks up against industry benchmarks.</p>
          <p style="margin-top: 20px;">
            <a href="https://doxaandco.co/clarityb/assessment" style="background: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
              Start Assessment
            </a>
          </p>
          <p style="margin-top: 30px; color: #6b7280;">Doxa & Co</p>
        </div>
      `,
    },
  },
  'post-booking': {
    1: {
      subject: 'Your Call is Scheduled',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937;">Great! Your call is booked.</h1>
          <p>You'll receive a calendar invite shortly. We're excited to discuss your business.</p>
          <p style="margin-top: 30px; color: #6b7280;">Best,<br/>The Doxa Team</p>
        </div>
      `,
    },
  },
  nurture: {
    1: {
      subject: 'The Hidden Cost of No SOPs',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937;">The Hidden Cost of No SOPs</h1>
          <p>Learn how documented processes save time, reduce errors, and unlock growth.</p>
          <p style="margin-top: 30px; color: #6b7280;">Doxa & Co</p>
        </div>
      `,
    },
    2: {
      subject: 'Scaling Without Burnout',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937;">Scaling Without Burnout</h1>
          <p>The frameworks that let you grow revenue while protecting your mental health.</p>
          <p style="margin-top: 30px; color: #6b7280;">Doxa & Co</p>
        </div>
      `,
    },
  },
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const input: SendSequenceInput = JSON.parse(event.body || '{}');
    const { sequenceType, stage, limit = 50 } = input;

    if (!sequenceType || !stage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing sequenceType or stage' }),
      };
    }

    // Find subscribers in this stage who haven't received this sequence
    const subscribers = await prisma.emailSubscriber.findMany({
      where: {
        stage,
        subscribed: true,
      },
      take: limit,
    });

    const template = sequences[sequenceType]?.[1];
    if (!template) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `No template for ${sequenceType}` }),
      };
    }

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        // Check if they already received this sequence
        const existing = await prisma.emailSequence.findFirst({
          where: {
            subscriber_id: subscriber.id,
            sequence_type: sequenceType,
            step: 1,
            sent_at: { not: null },
          },
        });

        if (existing) {
          console.log(`[send-sequence] ${subscriber.email} already received ${sequenceType}`);
          continue;
        }

        // Send via Resend
        const res = await resend.emails.send({
          from: 'Doxa <hello@doxaandco.co>',
          to: subscriber.email,
          subject: template.subject,
          html: template.html,
        });

        if (res.data?.id) {
          // Log the send
          await prisma.emailSequence.create({
            data: {
              subscriber_id: subscriber.id,
              sequence_type: sequenceType,
              step: 1,
              subject: template.subject,
              sent_at: new Date(),
            },
          });

          sent++;
          console.log(`[send-sequence] Sent to ${subscriber.email}`);
        } else {
          failed++;
          console.error(`[send-sequence] Failed to send to ${subscriber.email}:`, res.error);
        }
      } catch (err) {
        failed++;
        console.error(`[send-sequence] Error sending to ${subscriber.email}:`, err);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        sent,
        failed,
        total: subscribers.length,
      }),
    };
  } catch (error) {
    console.error('[send-sequence] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send sequence',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
