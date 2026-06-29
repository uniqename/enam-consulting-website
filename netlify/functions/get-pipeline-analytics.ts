/**
 * get-pipeline-analytics.ts
 * Netlify serverless function — get CRM pipeline metrics.
 *
 * Returns: conversion funnel, conversion rates, pipeline value
 */

import { Handler } from '@netlify/functions';
import prisma from '../lib/prisma';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Count each stage from audit logs
    const leads = await prisma.auditLog.count({
      where: {
        action: 'PIPELINE_LEAD',
      },
    });

    const prospects = await prisma.auditLog.count({
      where: {
        action: 'PIPELINE_PROSPECT',
      },
    });

    const paid = await prisma.auditLog.count({
      where: {
        action: 'PIPELINE_PAID',
      },
    });

    const clients = await prisma.auditLog.count({
      where: {
        action: 'PIPELINE_CLIENT',
      },
    });

    // Calculate conversion rates
    const leadToProspectRate = leads > 0 ? ((prospects / leads) * 100).toFixed(1) : '0';
    const prospectToPaymentRate = prospects > 0 ? ((paid / prospects) * 100).toFixed(1) : '0';
    const paymentToClientRate = paid > 0 ? ((clients / paid) * 100).toFixed(1) : '0';
    const overallConversionRate = leads > 0 ? ((clients / leads) * 100).toFixed(1) : '0';

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        pipeline: {
          leads: leads || 0,
          prospects: prospects || 0,
          paid: paid || 0,
          activeClients: clients || 0,
        },
        conversionRates: {
          leadToProspect: `${leadToProspectRate}%`,
          prospectToPayment: `${prospectToPaymentRate}%`,
          paymentToClient: `${paymentToClientRate}%`,
          overallConversion: `${overallConversionRate}%`,
        },
        metrics: {
          totalPipeline: leads || 0,
          closedDeals: clients || 0,
          averageValuePerLead:
            leads > 0 && paid > 0
              ? `$${((prospects * 300) / leads).toFixed(0)}` // rough estimate based on avg fee
              : '$0',
        },
      }),
    };
  } catch (error) {
    console.error('[get-pipeline-analytics] Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch pipeline analytics',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
