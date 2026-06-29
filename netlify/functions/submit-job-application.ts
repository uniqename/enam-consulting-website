/**
 * submit-job-application.ts
 * Netlify serverless function — submit job application.
 *
 * Handles:
 *  - File upload for resume
 *  - Create JobApplication record
 *  - Send confirmation email
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
    // Parse form data (multipart)
    // In production, use a library like busboy for proper parsing
    // For now, we'll handle JSON + file separately
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

    const { jobId, fullName, email, phone, linkedIn, portfolio, coverLetter } = body;

    if (!jobId || !fullName || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Check job exists
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Job not found' }),
      };
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        fullName,
        email,
        phone,
        linkedIn,
        portfolio,
        coverLetter,
        status: 'SUBMITTED',
      },
    });

    // Send confirmation email to applicant
    await resend.emails.send({
      from: 'Doxa Careers <careers@doxaandco.co>',
      to: email,
      subject: `Application Received for ${job.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937;">Application Received</h1>
          <p>Hi ${fullName},</p>
          <p>Thanks for applying for the <strong>${job.title}</strong> role at Doxa & Co. We've received your application and will review it carefully.</p>
          <p style="margin-top: 20px;">We typically get back to strong candidates within 2-3 weeks. In the meantime, feel free to follow us on LinkedIn or check out our work at doxaandco.co.</p>
          <p style="margin-top: 30px; color: #6b7280;">Best,<br/>The Doxa Team</p>
        </div>
      `,
    });

    // Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'consulting.enam@gmail.com';
    await resend.emails.send({
      from: 'Doxa Careers <careers@doxaandco.co>',
      to: adminEmail,
      subject: `New Application: ${fullName} for ${job.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>${fullName} applied for ${job.title}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>LinkedIn:</strong> ${linkedIn || 'Not provided'}</p>
          <p><strong>Portfolio:</strong> ${portfolio || 'Not provided'}</p>
          <p style="margin-top: 20px;"><strong>Cover Letter:</strong></p>
          <p>${coverLetter || 'Not provided'}</p>
        </div>
      `,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        applicationId: application.id,
        message: 'Application submitted successfully',
      }),
    };
  } catch (error) {
    console.error('[submit-job-application] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to submit application',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
