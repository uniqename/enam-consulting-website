/**
 * create-client-from-booking.ts
 * Netlify serverless function — creates ClarityHub account from Doxa booking.
 *
 * Flow:
 *   1. Doxa booking → call this function
 *   2. Creates User (email, name)
 *   3. Creates Organization (company name)
 *   4. Links user to org as ORG_ADMIN
 *   5. Returns: new user ID, org ID, temporary password
 *   6. Booking email includes: login link + password + assessment link
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

interface BookingInput {
  name: string;
  email: string;
  company: string;
  meetingType: string;
  meetingDate: string;
  meetingTime: string;
  fee: string | null;
}

interface CreateClientResponse {
  success: boolean;
  userId?: string;
  orgId?: string;
  tempPassword?: string;
  error?: string;
}

/**
 * Generate a simple temporary password.
 * User will be forced to reset on first login (TODO: implement pwd reset flow).
 */
function generateTempPassword(): string {
  return Math.random().toString(36).slice(-12).toUpperCase();
}

/**
 * Generate a clean slug from company name.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const booking: BookingInput = JSON.parse(event.body || '{}');

    // Validate input
    if (!booking.email || !booking.name || !booking.company) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing required fields: email, name, company',
        }),
      };
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: booking.email },
    });

    if (user) {
      // User exists — just return their ID (they may have already booked before)
      const org = await prisma.organization.findFirst({
        where: {
          members: {
            some: { userId: user.id },
          },
        },
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          userId: user.id,
          orgId: org?.id,
          message: 'User already exists',
        }),
      };
    }

    // Create new user
    const tempPassword = generateTempPassword();
    user = await prisma.user.create({
      data: {
        email: booking.email,
        fullName: booking.name,
      },
    });

    // Create organization with unique slug
    let baseSlug = slugify(booking.company);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const org = await prisma.organization.create({
      data: {
        name: booking.company,
        slug,
        ownerId: user.id,
        planStatus: 'TRIAL', // Start as trial until payment
      },
    });

    // Link user to org as admin
    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: 'ORG_ADMIN',
      },
    });

    // Create audit log for transparency
    await prisma.auditLog.create({
      data: {
        orgId: org.id,
        userId: user.id,
        action: 'CLIENT_ONBOARDED_FROM_BOOKING',
        resourceType: 'Organization',
        resourceId: org.id,
        newValue: {
          bookingType: booking.meetingType,
          bookingDate: booking.meetingDate,
          bookingTime: booking.meetingTime,
          fee: booking.fee,
        },
      },
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: true,
        userId: user.id,
        orgId: org.id,
        tempPassword,
        email: user.email,
        company: org.name,
        slug: org.slug,
      }),
    };
  } catch (error) {
    console.error('[create-client-from-booking] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create client account',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
