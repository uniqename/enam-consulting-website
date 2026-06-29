/**
 * get-job-posting.ts
 * Netlify serverless function — get single job posting by ID.
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

  const jobId = event.queryStringParameters?.jobId;

  if (!jobId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing jobId' }),
    };
  }

  try {
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobId },
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

    if (!job) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Job not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        job,
      }),
    };
  } catch (error) {
    console.error('[get-job-posting] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch job',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
