import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client - credentials will be validated at runtime
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

// Auth functions
export const signUp = async (email: string, password: string, clientName: string) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { clientName },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) return { error: new Error('Supabase not initialized') };
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Client profile functions
export const getClientProfile = async (userId: string) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const updateClientProfile = async (clientId: string, updates: any) => {
  if (!supabase) return { data: null, error: new Error('Supabase not initialized') };
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', clientId);
  return { data, error };
};
