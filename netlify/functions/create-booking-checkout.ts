/**
 * create-booking-checkout.ts
 * Netlify serverless function — create Stripe checkout session for booking fee.
 *
 * Setup: Already done (Stripe webhook configured in netlify.toml)
 * When charge succeeds → webhook marks organization as PAID
 */

import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutInput {
  email: string;
  name: string;
  company: string;
  meetingType: string;
  amount: number; // in cents
  orgId?: string; // ClarityHub org ID
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const input: CheckoutInput = JSON.parse(event.body || '{}');

    if (!input.email || !input.amount || input.amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: input.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${input.meetingType} - Discovery Call`,
              description: `Strategy session for ${input.company || input.name}`,
            },
            unit_amount: input.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        email: input.email,
        name: input.name,
        company: input.company,
        meetingType: input.meetingType,
        orgId: input.orgId || '',
      },
      success_url: `${process.env.URL || 'https://doxaandco.co'}/booking?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://doxaandco.co'}/booking?cancel=true`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        checkoutUrl: session.url,
        sessionId: session.id,
      }),
    };
  } catch (error) {
    console.error('[create-booking-checkout] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to create checkout',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
