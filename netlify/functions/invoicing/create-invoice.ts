import { Handler } from '@netlify/functions';
import { z } from 'zod';
import prisma from '../lib/prisma';

const CreateInvoiceSchema = z.object({
  contactId: z.string(),
  dueDate: z.string(),
  lineItems: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
  })),
  taxRate: z.number().default(0),
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  try {
    const authHeader = event.headers.authorization;
    if (!authHeader) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };

    const userId = extractUserIdFromToken(authHeader.substring(7));
    const body = JSON.parse(event.body || '{}');
    const data = CreateInvoiceSchema.parse(body);

    // Get user's org
    const membership = await prisma.organizationMember.findFirst({
      where: { userId },
    });

    if (!membership) return { statusCode: 403, body: JSON.stringify({ error: 'Forbidden' }) };

    const orgId = membership.orgId;

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
    });

    const invoiceNumber = `DOX-${new Date().getFullYear()}-${String((parseInt(lastInvoice?.invoiceNumber.split('-')[2] || '0') + 1)).padStart(4, '0')}`;

    // Calculate totals
    const subtotal = data.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * (data.taxRate / 100);
    const total = subtotal + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        orgId,
        invoiceNumber,
        contactId: data.contactId,
        issueDate: new Date(),
        dueDate: new Date(data.dueDate),
        subtotal,
        taxRate: data.taxRate,
        taxAmount,
        total,
        lineItems: {
          createMany: {
            data: data.lineItems.map((item, i) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              amount: item.quantity * item.unitPrice,
              sortOrder: i,
            })),
          },
        },
      },
      include: { lineItems: true },
    });

    // Log to audit
    await prisma.auditLog.create({
      data: {
        orgId,
        userId,
        action: 'INVOICE_CREATED',
        resourceType: 'Invoice',
        resourceId: invoice.id,
        newValue: invoice,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(invoice),
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
