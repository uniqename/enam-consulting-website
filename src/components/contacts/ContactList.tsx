import ContactCard from './ContactCard';
import { Mail, Phone } from 'lucide-react';

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

interface ContactListProps {
  contacts: Contact[];
  selectedId?: string;
  onSelectContact: (contact: Contact) => void;
  isLoading: boolean;
}

export default function ContactList({
  contacts,
  selectedId,
  onSelectContact,
  isLoading,
}: ContactListProps) {
  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-stone-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Mail size={32} className="text-stone-300 mb-2" />
        <p className="text-stone-400 font-medium">No contacts found</p>
        <p className="text-stone-300 text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2 overflow-y-auto max-h-[600px]">
      {contacts.map(contact => (
        <button
          key={contact.id}
          onClick={() => onSelectContact(contact)}
          className={`w-full text-left p-3 rounded-lg transition-colors ${
            selectedId === contact.id
              ? 'bg-stone-900 text-white'
              : 'bg-white hover:bg-stone-50 text-stone-900'
          }`}
        >
          <div className="font-medium truncate">{contact.name}</div>
          <div className={`text-xs mt-1 flex items-center gap-1 ${
            selectedId === contact.id ? 'text-stone-200' : 'text-stone-500'
          }`}>
            <Mail size={12} />
            <span className="truncate">{contact.email}</span>
          </div>
          {contact.company && (
            <div className={`text-xs mt-1 truncate ${
              selectedId === contact.id ? 'text-stone-300' : 'text-stone-400'
            }`}>
              {contact.company}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
