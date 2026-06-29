/**
 * delete-application.ts
 * Netlify serverless function — delete job application (admin).
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { applicationId } = JSON.parse(event.body || '{}');

    if (!applicationId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing applicationId' }),
      };
    }

    await prisma.jobApplication.delete({
      where: { id: applicationId },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Application deleted',
      }),
    };
  } catch (error) {
    console.error('[delete-application] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to delete application',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
