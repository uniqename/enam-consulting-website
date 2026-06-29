/**
 * track-pipeline-event.ts
 * Netlify serverless function — track prospect movement through CRM pipeline.
 *
 * Pipeline stages:
 *   1. LEAD — captured email on website
 *   2. PROSPECT — booked a call
 *   3. PAID — completed payment
 *   4. CLIENT — active engagement (has portal access)
 *
 * Use this to track conversions and pipeline value.
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

interface PipelineEvent {
  email: string;
  stage: 'LEAD' | 'PROSPECT' | 'PAID' | 'CLIENT';
  source?: string; // e.g., "landing-page", "booking-form", "stripe-webhook"
  metadata?: Record<string, any>;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const input: PipelineEvent = JSON.parse(event.body || '{}');

    if (!input.email || !input.stage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email or stage' }),
      };
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    // If new user, create as LEAD
    if (!user && input.stage === 'LEAD') {
      user = await prisma.user.create({
        data: {
          email: input.email,
          fullName: input.metadata?.name || 'Unnamed Lead',
        },
      });
    } else if (!user) {
      // Trying to update non-existent user — create as LEAD first
      user = await prisma.user.create({
        data: {
          email: input.email,
          fullName: input.metadata?.name || 'Unnamed Lead',
        },
      });
    }

    // Log the pipeline event (using audit log for now; could create dedicated table)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: `PIPELINE_${input.stage}`,
        resourceType: 'Lead',
        resourceId: user.id,
        orgId: null,
        newValue: {
          stage: input.stage,
          source: input.source,
          ...input.metadata,
        },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `User moved to ${input.stage} stage`,
        userId: user.id,
      }),
    };
  } catch (error) {
    console.error('[track-pipeline-event] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to track pipeline event',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
