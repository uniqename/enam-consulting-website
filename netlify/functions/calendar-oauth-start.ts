/**
 * calendar-oauth-start.ts
 * Initiates Google OAuth flow for calendar integration
 * Redirects user to Google consent screen
 */

export default async (req: any, res: any) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.SITE_URL || 'https://doxaandco.co'}/.netlify/functions/calendar-oauth-callback`;

  if (!clientId) {
    return res.status(503).json({ error: 'Google OAuth not configured' });
  }

  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent');

  console.log('[calendar-oauth-start] Redirecting to Google OAuth');

  return res.redirect(authUrl.toString());
};

export const config = {
  path: '/api/calendar/oauth/start',
};
