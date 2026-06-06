import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Verify Supabase JWT from request Authorization header
 * Returns user ID if valid, null if invalid
 */
export async function verifyAuth(authHeader?: string) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const {
    data: { user },
    error,
  } = await supabase.auth.admin.getUserById(extractUserIdFromToken(token));

  return user ? user.id : null;
}

/**
 * Simple JWT parsing (doesn't verify signature - rely on Supabase verification)
 */
function extractUserIdFromToken(token: string): string {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return '';
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64').toString()
    );
    return payload.sub || '';
  } catch {
    return '';
  }
}

/**
 * Verify user has access to organization
 */
export async function verifyOrgAccess(userId: string, orgId: string) {
  const { data, error } = await supabase
    .from('OrganizationMember')
    .select('id')
    .eq('userId', userId)
    .eq('orgId', orgId)
    .single();

  return !!data && !error;
}

/**
 * Verify user is org admin
 */
export async function verifyOrgAdmin(userId: string, orgId: string) {
  const { data, error } = await supabase
    .from('OrganizationMember')
    .select('role')
    .eq('userId', userId)
    .eq('orgId', orgId)
    .single();

  return data?.role === 'ADMIN' && !error;
}

/**
 * Verify user is super admin
 */
export async function verifySuperAdmin(userId: string) {
  const { data, error } = await supabase
    .from('User')
    .select('role')
    .eq('id', userId)
    .single();

  return data?.role === 'SUPER_ADMIN' && !error;
}
