/**
 * stripe-webhook.ts
 * Netlify serverless function — handle Stripe payment webhooks.
 *
 * Triggers:
 *  - checkout.session.completed → mark org as PAID, send confirmation email
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const sig = event.headers['stripe-signature'];
    if (!sig) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing signature' }),
      };
    }

    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      webhookSecret
    );

    // Handle checkout.session.completed
    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;

      // Extract booking metadata
      const bookingId = session.metadata?.bookingId;
      const orgSlug = session.metadata?.orgSlug;

      if (!bookingId || !orgSlug) {
        console.warn('[stripe-webhook] Missing metadata:', { bookingId, orgSlug });
        return {
          statusCode: 200,
          body: JSON.stringify({ received: true }),
        };
      }

      // Update organization to PAID
      const org = await prisma.organization.findUnique({
        where: { slug: orgSlug },
      });

      if (org) {
        await prisma.organization.update({
          where: { id: org.id },
          data: {
            planStatus: 'ACTIVE',
            plan: 'GROWTH', // Upgrade from STARTER
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
          },
        });

        // Log event
        await prisma.auditLog.create({
          data: {
            orgId: org.id,
            userId: org.ownerId,
            action: 'PIPELINE_PAID',
            resourceType: 'Organization',
            resourceId: org.id,
            newValue: { planStatus: 'ACTIVE', plan: 'GROWTH' },
          },
        });

        console.log(`[stripe-webhook] Org ${orgSlug} marked as PAID`);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('[stripe-webhook] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
