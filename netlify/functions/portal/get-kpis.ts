import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

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

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method not allowed' };

  try {
    const authHeader = event.headers.authorization;
    if (!authHeader) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

    const userId = extractUserIdFromToken(authHeader.substring(7));
    const membership = await prisma.organizationMember.findFirst({ where: { userId } });
    if (!membership) return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };

    const kpis = await prisma.kpi.findMany({
      where: { orgId: membership.orgId },
      include: { entries: { orderBy: { recordedAt: 'desc' }, take: 1 } },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        kpis: kpis.map((k) => ({
          id: k.id,
          name: k.name,
          unit: k.unit,
          target: k.target,
          frequency: k.frequency,
          latestValue: k.entries[0]?.value,
        })) || [],
      }),
    };
  } catch (error: any) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
