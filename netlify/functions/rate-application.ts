/**
 * rate-application.ts
 * Netlify serverless function — rate job application (admin).
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { applicationId, rating } = JSON.parse(event.body || '{}');

    if (!applicationId || !rating || rating < 1 || rating > 5) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid rating (must be 1-5)' }),
      };
    }

    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { rating },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Rating updated',
      }),
    };
  } catch (error) {
    console.error('[rate-application] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to rate application',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
