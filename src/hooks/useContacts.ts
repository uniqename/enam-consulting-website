import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  meeting_type: string;
  last_contact: string;
  created_at: string;
  status: string;
}

interface UseContactsResult {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useContacts(filter?: { status?: string; meetingType?: string }): UseContactsResult {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const fetchContacts = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setError('Supabase not configured');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createClient(supabaseUrl, supabaseKey);

      let query = supabase.from('contacts').select('*');

      if (filter?.status && filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }

      if (filter?.meetingType && filter.meetingType !== 'all') {
        query = query.eq('meeting_type', filter.meetingType);
      }

      const { data, error: fetchError } = await query.order('last_contact', {
        ascending: false,
      });

      if (fetchError) {
        throw fetchError;
      }

      setContacts(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filter?.status, filter?.meetingType]);

  return {
    contacts,
    isLoading,
    error,
    refetch: fetchContacts,
  };
}

export function useContact(id: string) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    if (!id || !supabaseUrl || !supabaseKey) return;

    const fetchContact = async () => {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data, error: fetchError } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;

        setContact(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch contact:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch contact');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContact();
  }, [id, supabaseUrl, supabaseKey]);

  return { contact, isLoading, error };
}
