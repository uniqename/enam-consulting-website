/**
 * update-application-status.ts
 * Netlify serverless function — update application status (admin).
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { applicationId, status } = JSON.parse(event.body || '{}');

    if (!applicationId || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing applicationId or status' }),
      };
    }

    const application = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
      include: {
        job: { select: { title: true } },
      },
    });

    // Send email notification based on status
    const statusMessages: Record<string, string> = {
      REVIEWED: 'Thanks for your interest! We\'ve reviewed your application.',
      SHORTLISTED: 'Great news! You\'ve been shortlisted for an interview.',
      INTERVIEW: 'You\'re invited for an interview! Check your email for details.',
      OFFERED: 'Congratulations! We\'d like to offer you the position.',
      REJECTED: 'Thanks for applying. We\'ve decided to move forward with other candidates.',
    };

    if (statusMessages[status]) {
      await resend.emails.send({
        from: 'Doxa Careers <careers@doxaandco.co>',
        to: application.email,
        subject: `Update on Your Application for ${application.job.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #1f2937;">Application Update</h1>
            <p>Hi ${application.fullName},</p>
            <p>${statusMessages[status]}</p>
            <p style="margin-top: 20px;">If you have any questions, feel free to reach out to us at careers@doxaandco.co.</p>
            <p style="margin-top: 30px; color: #6b7280;">Best,<br/>The Doxa Team</p>
          </div>
        `,
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Application status updated',
      }),
    };
  } catch (error) {
    console.error('[update-application-status] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to update application status',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
