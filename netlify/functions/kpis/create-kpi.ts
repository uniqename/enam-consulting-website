import { Handler } from '@netlify/functions';
import { z } from 'zod';
import prisma from '../lib/prisma';

const CreateKPISchema = z.object({
  name: z.string(),
  unit: z.enum(['CURRENCY', 'PERCENT', 'COUNT', 'RATIO']),
  targetValue: z.number(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY']),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  try {
    const authHeader = event.headers.authorization;
    if (!authHeader) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

    const userId = extractUserIdFromToken(authHeader.substring(7));
    const body = JSON.parse(event.body || '{}');
    const data = CreateKPISchema.parse(body);

    // Get user's org
    const membership = await prisma.organizationMember.findFirst({
      where: { userId },
    });

    if (!membership) return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };

    const kpi = await prisma.kpi.create({
      data: {
        ...data,
        orgId: membership.orgId,
        ownerId: userId,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(kpi),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function extractUserIdFromToken(token: string): string {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return '';
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.sub || '';
  } catch {
    return '';
  }
}
