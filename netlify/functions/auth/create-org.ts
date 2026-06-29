import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import prisma from '../lib/prisma';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CreateOrgSchema = z.object({
  orgName: z.string().min(1),
  entityType: z.enum(['FOR_PROFIT', 'NONPROFIT', 'GOVERNMENT', 'OTHER']),
  industry: z.string().min(1),
  plan: z.enum(['STARTER', 'GROWTH', 'ENTERPRISE']),
  userId: z.string(),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const data = CreateOrgSchema.parse(body);

    // Create organization
    const org = await prisma.organization.create({
      data: {
        name: data.orgName,
        slug: data.orgName.toLowerCase().replace(/\s+/g, '-'),
        entityType: data.entityType,
        plan: data.plan,
        ownerId: data.userId,
      },
    });

    // Add user as org admin
    await prisma.organizationMember.create({
      data: {
        orgId: org.id,
        userId: data.userId,
        role: 'ADMIN',
        acceptedAt: new Date(),
      },
    });

    // Log to audit log
    await prisma.auditLog.create({
      data: {
        orgId: org.id,
        userId: data.userId,
        action: 'ORG_CREATED',
        resourceType: 'Organization',
        resourceId: org.id,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ orgId: org.id }),
    };
  } catch (error: any) {
    console.error('Error creating org:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};
