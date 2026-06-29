/**
 * get-subscriber-list.ts
 * Netlify serverless function — get email subscribers (admin only).
 *
 * Returns: all subscribers, filterable by stage or source
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { stage, source } = event.queryStringParameters || {};

    const where: any = {
      subscribed: true,
    };

    if (stage) {
      where.stage = stage;
    }
    if (source) {
      where.source = source;
    }

    const subscribers = await prisma.emailSubscriber.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { email_sequences: true },
        },
      },
    });

    // Count by stage
    const stageCounts = await Promise.all(
      ['LEAD', 'PROSPECT', 'PAID', 'CLIENT'].map(async (s) => ({
        stage: s,
        count: await prisma.emailSubscriber.count({
          where: { stage: s, subscribed: true },
        }),
      }))
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        subscribers: subscribers.map((s) => ({
          id: s.id,
          email: s.email,
          name: s.name,
          source: s.source,
          stage: s.stage,
          emailsSent: s._count.email_sequences,
          createdAt: s.createdAt,
        })),
        stats: {
          total: subscribers.length,
          byStage: stageCounts,
        },
      }),
    };
  } catch (error) {
    console.error('[get-subscriber-list] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch subscribers',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
