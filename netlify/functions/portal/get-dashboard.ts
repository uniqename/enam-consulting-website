import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

export const handler: Handler = async (event) => {
  try {
    const authHeader = event.headers.authorization;
    if (!authHeader) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

    const userId = extractUserIdFromToken(authHeader.substring(7));

    const membership = await prisma.organizationMember.findFirst({
      where: { userId },
    });

    if (!membership) return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };

    const orgId = membership.orgId;

    // Get latest assessment
    const latestAssessment = await prisma.assessment.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });

    // Get KPI count
    const kpiCount = await prisma.kpi.count({
      where: { orgId, deletedAt: null },
    });

    // Get project count
    const projectCount = await prisma.project.count({
      where: { orgId, deletedAt: null },
    });

    // Get overdue tasks
    const overdueTasks = await prisma.task.count({
      where: {
        orgId,
        dueDate: { lt: new Date() },
        status: { not: 'DONE' },
        deletedAt: null,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        businessHealthScore: latestAssessment?.score || 0,
        kpiCount,
        projectCount,
        overdueTasks,
        lastAssessment: latestAssessment?.createdAt,
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
