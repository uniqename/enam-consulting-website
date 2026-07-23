import { useState, useMemo } from 'react';
import { Search, Filter, Plus, MoreVertical } from 'lucide-react';
import ContactList from '@/components/contacts/ContactList';
import ContactDetailsPanel from '@/components/contacts/ContactDetailsPanel';
import SearchBar from '@/components/shared/SearchBar';
import FilterPanel from '@/components/shared/FilterPanel';

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

export default function PeopleDashboard() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({
    meeting_type: 'all',
    status: 'active',
    date_range: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contacts from Supabase
  useMemo(async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual Supabase query
      // const { data } = await supabase
      //   .from('contacts')
      //   .select('*')
      //   .eq('status', filterCriteria.status);
      // setContacts(data || []);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filterCriteria]);

  // Filter and search contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = searchQuery === '' ||
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterCriteria.meeting_type === 'all' ||
        contact.meeting_type === filterCriteria.meeting_type;

      return matchesSearch && matchesFilter;
    });
  }, [contacts, searchQuery, filterCriteria]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="border-b border-stone-200 bg-white sticky top-0 z-10">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-stone-900">Contacts</h1>
            <button className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus size={16} />
              New Contact
            </button>
          </div>
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            placeholder="Search by name, email, or company..."
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-160px)]">
        {/* Left Sidebar - Contacts List */}
        <div className="w-96 border-r border-stone-200 bg-white overflow-y-auto">
          <FilterPanel
            criteria={filterCriteria}
            onCriteriaChange={setFilterCriteria}
          />
          <ContactList
            contacts={filteredContacts}
            selectedId={selectedContact?.id}
            onSelectContact={setSelectedContact}
            isLoading={isLoading}
          />
        </div>

        {/* Right Sidebar - Contact Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedContact ? (
            <ContactDetailsPanel contact={selectedContact} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-stone-400 text-lg mb-2">No contact selected</p>
                <p className="text-stone-300 text-sm">Click a contact to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
