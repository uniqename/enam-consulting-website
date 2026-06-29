/**
 * get-bookings.ts
 * Netlify serverless function — fetch all bookings (clients) from Supabase.
 *
 * Returns: list of all booked prospects with their status, payment, etc.
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

interface BookingRecord {
  id: string;
  email: string;
  name: string;
  company: string;
  meetingType: string;
  meetingDate: string;
  createdAt: string;
  paymentStatus: 'PENDING' | 'PAID' | 'TRIAL';
  orgId?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Get all users created from bookings (those in organizations without being admin elsewhere)
    const users = await prisma.user.findMany({
      where: {
        organizationMembers: {
          some: {
            role: 'ORG_ADMIN',
          },
        },
      },
      include: {
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const bookings: BookingRecord[] = users.map((user) => {
      const orgMember = user.organizationMembers[0];
      const org = orgMember?.organization;

      return {
        id: user.id,
        email: user.email,
        name: user.fullName || 'Unknown',
        company: org?.name || 'N/A',
        meetingType: 'See details', // Would need to store in metadata
        meetingDate: user.createdAt.toISOString().split('T')[0],
        createdAt: user.createdAt.toISOString(),
        paymentStatus: (org?.planStatus as 'PENDING' | 'PAID' | 'TRIAL') || 'PENDING',
        orgId: org?.id,
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        count: bookings.length,
        bookings,
      }),
    };
  } catch (error) {
    console.error('[get-bookings] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch bookings',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
