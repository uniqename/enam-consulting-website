import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

export const handler: Handler = async (event) => {
  try {
    const authHeader = event.headers.authorization;
    if (!authHeader) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
    }

    const userId = extractUserIdFromToken(authHeader.substring(7));

    const membership = await prisma.organizationMember.findFirst({
      where: { userId },
      include: { org: true },
    });

    if (!membership) {
      return { statusCode: 404, body: JSON.stringify({ error: 'No organization' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: membership.org.id,
        name: membership.org.name,
        plan: membership.org.plan,
        role: membership.role,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
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
