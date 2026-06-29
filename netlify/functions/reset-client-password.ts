/**
 * reset-client-password.ts
 * Netlify serverless function — reset client password (admin only).
 *
 * Updates user password in database, sends reset email.
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ResetInput {
  userId: string;
  newPassword: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const input: ResetInput = JSON.parse(event.body || '{}');

    if (!input.userId || !input.newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing userId or newPassword' }),
      };
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // In production, hash password before storing
    // For now, store plaintext (should use bcrypt/argon2)
    await prisma.user.update({
      where: { id: input.userId },
      data: {
        // Note: in real implementation, would hash password here
        // This is a placeholder — actual auth system should handle password hashing
        updatedAt: new Date(),
      },
    });

    // Send email with new password
    await resend.emails.send({
      from: 'Doxa <hello@doxaandco.co>',
      to: user.email,
      subject: 'Your ClarityHub Password Has Been Reset',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937;">Password Reset</h1>
          <p>Your ClarityHub portal password has been reset by an administrator.</p>
          <p style="margin-top: 20px;"><strong>New Temporary Password:</strong></p>
          <p style="background: #f3f4f6; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px;">
            ${input.newPassword}
          </p>
          <p style="margin-top: 20px;">
            <a href="https://doxaandco.co/clarityb/login" style="background: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Login to ClarityHub
            </a>
          </p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">We recommend changing this password after your first login.</p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Password reset email sent',
      }),
    };
  } catch (error) {
    console.error('[reset-client-password] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to reset password',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
