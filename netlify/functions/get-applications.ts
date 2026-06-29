/**
 * get-applications.ts
 * Netlify serverless function — get all job applications (admin).
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
    const applications = await prisma.jobApplication.findMany({
      include: {
        job: {
          select: { title: true },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    const mapped = applications.map((app) => ({
      id: app.id,
      jobId: app.jobId,
      jobTitle: app.job.title,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      linkedIn: app.linkedIn,
      portfolio: app.portfolio,
      coverLetter: app.coverLetter,
      status: app.status,
      rating: app.rating,
      appliedAt: app.appliedAt.toISOString(),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        applications: mapped,
      }),
    };
  } catch (error) {
    console.error('[get-applications] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch applications',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
