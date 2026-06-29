import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const { code, type, error } = event.queryStringParameters || {};

  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No code provided' }),
    };
  }

  // Redirect to auth completion page with code
  // The client will exchange this code for a session
  return {
    statusCode: 302,
    headers: {
      Location: `/auth/callback?code=${code}&type=${type || 'signup'}`,
    },
    body: '',
  };
};
