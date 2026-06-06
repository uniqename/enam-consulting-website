import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import prisma from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const signature = event.headers['stripe-signature'];
  if (!signature) return { statusCode: 400, body: 'No signature' };

  try {
    const webEvent = stripe.webhooks.constructEvent(
      event.rawBody || event.body || '',
      signature,
      webhookSecret
    );

    // Handle events
    switch (webEvent.type) {
      case 'checkout.session.completed': {
        const session = webEvent.data.object as Stripe.Checkout.Session;
        // Update org subscription
        if (session.client_reference_id) {
          await prisma.organization.update({
            where: { id: session.client_reference_id },
            data: {
              stripeSubscriptionId: session.subscription as string,
              stripeCustomerId: session.customer as string,
              planStatus: 'ACTIVE',
            },
          });

          // Log to audit
          await prisma.auditLog.create({
            data: {
              orgId: session.client_reference_id,
              userId: 'system',
              action: 'SUBSCRIPTION_CREATED',
              resourceType: 'Organization',
              resourceId: session.client_reference_id,
              newValue: { subscriptionId: session.subscription },
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = webEvent.data.object as Stripe.Invoice;
        // Find org by customer ID and update plan status
        await prisma.organization.updateMany({
          where: { stripeCustomerId: invoice.customer as string },
          data: { planStatus: 'PAST_DUE' },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = webEvent.data.object as Stripe.Subscription;
        // Find org and cancel
        await prisma.organization.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { planStatus: 'CANCELED', plan: 'STARTER' },
        });
        break;
      }
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (error: any) {
    console.error('Webhook error:', error);
    return { statusCode: 400, body: `Webhook error: ${error.message}` };
  }
};
