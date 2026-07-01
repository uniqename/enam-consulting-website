import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!data.name || !data.email || !data.businessName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    const { name, email, businessName, scores, total, timestamp } = data;

    // Get results category
    let resultCategory = 'Foundation gaps';
    let resultDesc = 'Fix before scaling.';
    if (total >= 24) {
      resultCategory = 'Growth-ready';
      resultDesc = 'Optimize and scale.';
    } else if (total >= 17) {
      resultCategory = 'Building momentum';
      resultDesc = 'Consistency gaps cost you.';
    }

    // Prepare email content
    const emailContent = `
Business Health Assessment Results

Name: ${name}
Business: ${businessName}
Email: ${email}
Submitted: ${new Date(timestamp).toLocaleString()}

SCORES:
------
01. Strategy: ${scores.strategy}/3
02. Revenue: ${scores.revenue}/3
03. Operations: ${scores.operations}/3
04. Marketing: ${scores.marketing}/3
05. Technology: ${scores.technology}/3
06. Team / Capacity: ${scores.team}/3
07. Customer Experience: ${scores.customerExp}/3
08. Financial Clarity: ${scores.financials}/3
09. Brand & Visibility: ${scores.brand}/3
10. Vision & Direction: ${scores.vision}/3

TOTAL SCORE: ${total}/30

RESULT: ${resultCategory}
${resultDesc}

---

This is an automated submission from doxaandco.co/healthcheck

Follow up with personalized results within 48 hours.
    `;

    // For now, just log the submission
    console.log('Assessment submitted:', {
      name,
      email,
      businessName,
      total,
      timestamp,
    });

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Assessment submitted successfully',
        total,
        resultCategory,
      }),
    };
  } catch (error) {
    console.error('Error processing assessment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export { handler };
