/**
 * get-job-postings.ts
 * Netlify serverless function — get all open job postings.
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
    const jobs = await prisma.jobPosting.findMany({
      where: { status: 'OPEN' },
      orderBy: { postedAt: 'desc' },
      select: {
        id: true,
        title: true,
        department: true,
        location: true,
        type: true,
        compensation: true,
        description: true,
        postedAt: true,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        jobs,
      }),
    };
  } catch (error) {
    console.error('[get-job-postings] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch jobs',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
