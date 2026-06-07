import { Plus, Mail, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CRM() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', role: '', status: 'Active' });

  useEffect(() => {
    const saved = localStorage.getItem('doxa_contacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    } else {
      setContacts([
        { name: 'Sarah Johnson', company: 'Tech Solutions Inc', email: 'sarah@techsol.com', status: 'Active', role: 'CEO' },
        { name: 'Michael Chen', company: 'Growth Ventures', email: 'mchen@growthvc.com', status: 'Active', role: 'Partner' },
        { name: 'Emma Rodriguez', company: 'Digital Marketing Co', email: 'emma@digmarket.com', status: 'Prospect', role: 'Director' },
        { name: 'David Thompson', company: 'Consulting Group', email: 'dthompson@consult.com', status: 'Active', role: 'Principal' },
        { name: 'Lisa Wang', company: 'Commerce Platform', email: 'lisa@commerce.com', status: 'Prospect', role: 'Head of Ops' },
      ]);
    }
  }, []);

  const handleAddContact = () => {
    if (!formData.name || !formData.email) return;
    const updated = [...contacts, formData];
    setContacts(updated);
    localStorage.setItem('doxa_contacts', JSON.stringify(updated));
    setFormData({ name: '', company: '', email: '', role: '', status: 'Active' });
    setShowForm(false);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Customer Relationships</h1>
          <p className="text-stone-600 mt-2">Manage contacts and sales pipelines</p>
        </div>
        <button onClick={() => setShowForm(true)} type="button" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          <Plus size={20} /> Add Contact
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-stone-100 p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-stone-900">Add Contact</h3>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600" type="button">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <input
                type="text"
                placeholder="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-stone-200 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Prospect">Prospect</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddContact}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm"
                  type="button"
                >
                  Add Contact
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 rounded-lg font-semibold text-sm"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {contacts.map((contact, i) => (
          <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-stone-900">{contact.name}</p>
                <p className="text-sm text-stone-600 mt-1">{contact.role} at {contact.company}</p>
              </div>
              <div className={`px-3 py-1 rounded text-xs font-semibold ${
                contact.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {contact.status}
              </div>
            </div>
            <div className="flex gap-4 text-sm text-stone-600">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-1 hover:text-emerald-600">
                <Mail size={16} /> {contact.email}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
