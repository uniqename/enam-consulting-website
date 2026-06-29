// Direct Supabase auth via fetch() - bypasses SDK
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: { id: string; email: string };
  error?: { message: string; status?: number };
}

export async function directSignIn(
  email: string,
  password: string,
  timeoutMs = 10000
): Promise<AuthResponse> {
  if (!SUPABASE_URL || !ANON_KEY) {
    return { error: { message: 'Supabase not configured' } };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log('[DirectAuth] Starting signin for:', email);

    const response = await fetch(
      `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: ANON_KEY,
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      }
    );

    console.log('[DirectAuth] Response status:', response.status);

    const data = await response.json();
    console.log('[DirectAuth] Response data:', {
      hasAccessToken: !!data.access_token,
      hasError: !!data.error,
      errorMsg: data.error_description || data.msg || data.error,
    });

    if (!response.ok) {
      return {
        error: {
          message: data.error_description || data.msg || 'Invalid credentials',
          status: response.status,
        },
      };
    }

    if (data.access_token) {
      // Store token in localStorage so it persists
      localStorage.setItem('supabase_token', data.access_token);
      localStorage.setItem('supabase_refresh_token', data.refresh_token);
      console.log('[DirectAuth] Signin successful');
      return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: data.user,
      };
    }

    return { error: { message: 'No token received' } };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.log('[DirectAuth] Request timed out');
      return {
        error: { message: `Sign in timeout after ${timeoutMs}ms - Supabase not responding` },
      };
    }
    console.log('[DirectAuth] Network error:', err.message);
    return {
      error: {
        message: err.message || 'Network error - check connection',
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function directSignUp(
  email: string,
  password: string,
  timeoutMs = 10000
): Promise<AuthResponse> {
  if (!SUPABASE_URL || !ANON_KEY) {
    return { error: { message: 'Supabase not configured' } };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.log('[DirectAuth] Starting signup for:', email);

    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
      },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          message: data.error_description || data.msg || 'Signup failed',
          status: response.status,
        },
      };
    }

    console.log('[DirectAuth] Signup successful');
    return { user: data.user };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        error: { message: `Sign up timeout after ${timeoutMs}ms` },
      };
    }
    return {
      error: {
        message: err.message || 'Network error',
      },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
