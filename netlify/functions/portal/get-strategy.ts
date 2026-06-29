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

    const vision = await prisma.vision.findFirst({ where: { orgId: membership.orgId } });
    const goals = await prisma.goal.findMany({ where: { orgId: membership.orgId } });

    return {
      statusCode: 200,
      body: JSON.stringify({
        vision: vision?.statement,
        goals: goals.map((g) => ({ id: g.id, goal: g.title, status: g.status })),
      }),
    };
  } catch (error: any) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
