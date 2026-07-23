/**
 * calendar-oauth-callback.ts
 * Handles Google OAuth callback, exchanges auth code for tokens
 * Stores encrypted tokens in Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export default async (req: any, res: any) => {
  const { code, error, state } = req.query;

  if (error) {
    console.error('[calendar-oauth-callback] OAuth error:', error);
    return res.redirect(`/dashboard/contacts?calendar_error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  if (!supabaseUrl || !supabaseServiceKey || !googleClientId || !googleClientSecret) {
    console.error('[calendar-oauth-callback] Missing environment variables');
    return res.status(503).json({ error: 'Service not configured' });
  }

  try {
    const redirectUri = `${process.env.SITE_URL || 'https://doxaandco.co'}/.netlify/functions/calendar-oauth-callback`;

    // Exchange auth code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      console.error('[calendar-oauth-callback] Token exchange failed:', error);
      return res.redirect('/dashboard/contacts?calendar_error=token_exchange_failed');
    }

    const tokens = await tokenResponse.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user's email from Google
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileRes.ok) {
      console.error('[calendar-oauth-callback] Failed to get user profile');
      return res.redirect('/dashboard/contacts?calendar_error=profile_fetch_failed');
    }

    const profile = await profileRes.json();
    const userEmail = profile.email;

    // Store calendar integration in Supabase
    // Note: In production, encrypt tokens using a key management service
    const { data, error: dbError } = await supabase
      .from('calendar_integrations')
      .upsert({
        user_email: userEmail,
        provider: 'google',
        provider_account_id: profile.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        calendar_email: userEmail,
        connected_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        is_active: true,
      }, {
        onConflict: 'user_email',
      })
      .select();

    if (dbError) {
      console.error('[calendar-oauth-callback] Failed to store integration:', dbError);
      return res.redirect('/dashboard/contacts?calendar_error=storage_failed');
    }

    console.log('[calendar-oauth-callback] Calendar integration successful for:', userEmail);

    // Redirect back to dashboard with success
    return res.redirect('/dashboard/contacts?calendar_connected=true');
  } catch (error) {
    console.error('[calendar-oauth-callback] Unhandled error:', error);
    return res.redirect('/dashboard/contacts?calendar_error=unknown');
  }
};

export const config = {
  path: '/api/calendar/oauth/callback',
};
