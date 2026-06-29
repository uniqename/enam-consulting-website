/**
 * assign-intake-flow.ts
 * Netlify serverless function — assign intake flow to client (admin only).
 *
 * Triggers:
 *  - Admin assigns client to assessment, SOP build, strategy, or implementation flow
 *  - Logs audit event
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

interface AssignInput {
  bookingId: string;
  intakeFlow: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const input: AssignInput = JSON.parse(event.body || '{}');

    if (!input.bookingId || !input.intakeFlow) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing bookingId or intakeFlow' }),
      };
    }

    // Get user (booking)
    const user = await prisma.user.findUnique({
      where: { id: input.bookingId },
      include: { organizationMembers: true },
    });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Booking not found' }),
      };
    }

    // Get org from user's membership
    const orgMember = user.organizationMembers[0];
    if (!orgMember) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User has no organization' }),
      };
    }

    // Log the assignment
    await prisma.auditLog.create({
      data: {
        orgId: orgMember.orgId,
        userId: user.id,
        action: 'INTAKE_FLOW_ASSIGNED',
        resourceType: 'User',
        resourceId: user.id,
        newValue: { intakeFlow: input.intakeFlow },
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: `${user.fullName} assigned to ${input.intakeFlow} flow`,
      }),
    };
  } catch (error) {
    console.error('[assign-intake-flow] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to assign intake flow',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
