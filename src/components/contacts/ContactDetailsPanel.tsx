import { useState } from 'react';
import { Mail, Phone, Building2, Calendar, Clock, FileText, MessageSquare } from 'lucide-react';
import InteractionTimeline from './InteractionTimeline';

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

interface ContactDetailsPanelProps {
  contact: Contact;
}

export default function ContactDetailsPanel({ contact }: ContactDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-stone-200 p-6 sticky top-0 bg-white z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">{contact.name}</h2>
            <p className="text-sm text-stone-500 mt-1">{contact.meeting_type}</p>
          </div>
          <button className="px-3 py-1.5 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors">
            Edit
          </button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 p-2 hover:bg-stone-50 rounded">
            <Mail size={16} className="text-stone-400" />
            <span className="text-xs text-stone-600 truncate">{contact.email}</span>
          </a>
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 p-2 hover:bg-stone-50 rounded">
              <Phone size={16} className="text-stone-400" />
              <span className="text-xs text-stone-600">{contact.phone}</span>
            </a>
          )}
          {contact.company && (
            <div className="flex items-center gap-2 p-2">
              <Building2 size={16} className="text-stone-400" />
              <span className="text-xs text-stone-600">{contact.company}</span>
            </div>
          )}
          <div className="flex items-center gap-2 p-2">
            <Clock size={16} className="text-stone-400" />
            <span className="text-xs text-stone-600">{formatDate(contact.last_contact)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-stone-200">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'timeline', label: 'Timeline', icon: MessageSquare },
            { id: 'meetings', label: 'Meetings', icon: Calendar },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-stone-400" />
                  <a href={`mailto:${contact.email}`} className="text-stone-700 hover:text-stone-900 underline">
                    {contact.email}
                  </a>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-stone-400" />
                    <a href={`tel:${contact.phone}`} className="text-stone-700 hover:text-stone-900 underline">
                      {contact.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">History</h3>
              <div className="space-y-1 text-sm text-stone-600">
                <div>Created: {new Date(contact.created_at).toLocaleDateString()}</div>
                <div>Last Contact: {formatDate(contact.last_contact)}</div>
                <div>Status: <span className="capitalize font-medium text-stone-900">{contact.status}</span></div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 space-y-2">
              <button className="w-full px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors text-sm font-medium">
                Schedule Meeting
              </button>
              <button className="w-full px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg transition-colors text-sm font-medium">
                Send Email
              </button>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <InteractionTimeline contactId={contact.id} />
        )}

        {activeTab === 'meetings' && (
          <div className="p-6 text-center">
            <Calendar size={32} className="text-stone-300 mx-auto mb-2" />
            <p className="text-stone-400">No meetings scheduled yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
