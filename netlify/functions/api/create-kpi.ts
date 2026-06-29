import { Handler } from '@netlify/functions';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface KPIPayload {
  name: string;
  target: string;
  current: string;
  unit?: string;
  frequency?: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Supabase config' }),
    };
  }

  try {
    const body: KPIPayload = JSON.parse(event.body || '{}');

    if (!body.name || !body.target || !body.current) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Insert into Supabase directly via REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/kpis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        name: body.name,
        target: body.target,
        current_value: body.current,
        unit: body.unit || 'value',
        frequency: body.frequency || 'monthly',
        created_at: new Date().toISOString(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Supabase error:', data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.message || 'Failed to create KPI' }),
      };
    }

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, kpi: data[0] }),
    };
  } catch (error: any) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
