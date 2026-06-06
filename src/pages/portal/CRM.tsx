import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
}

export default function CRM() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.access_token) return;

        const response = await fetch('/.netlify/functions/portal/get-contacts', {
          headers: { Authorization: `Bearer ${session.session.access_token}` },
        });

        if (response.ok) {
          const result = await response.json();
          setContacts(result.contacts || []);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Customer Relationships</h1>
          <p className="text-stone-600 mt-2">Manage contacts and sales pipelines</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          <Plus size={20} /> Add Contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-600">No contacts yet</div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-lg border border-stone-100 p-4 hover:border-emerald-200 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-stone-900">{contact.name}</p>
                  <p className="text-sm text-stone-600">{contact.email}</p>
                  {contact.company && <p className="text-xs text-stone-500 mt-1">{contact.company}</p>}
                </div>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">{contact.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
