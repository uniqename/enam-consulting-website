import { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Calendar } from 'lucide-react';

interface Interaction {
  id: string;
  type: 'note' | 'email' | 'call' | 'meeting';
  title: string;
  content: string;
  created_at: string;
}

export default function InteractionTimeline({ contactId }: { contactId: string }) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // TODO: Fetch interactions from Supabase
    // const fetchInteractions = async () => {
    //   const { data } = await supabase
    //     .from('contact_notes')
    //     .select('*')
    //     .eq('contact_id', contactId)
    //     .order('created_at', { ascending: false });
    //   setInteractions(data || []);
    //   setIsLoading(false);
    // };
    // fetchInteractions();
    setIsLoading(false);
  }, [contactId]);

  const getIcon = (type: string) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'note': return <MessageSquare className={iconClass} />;
      case 'email': return <Mail className={iconClass} />;
      case 'call': return <Phone className={iconClass} />;
      case 'meeting': return <Calendar className={iconClass} />;
      default: return <MessageSquare className={iconClass} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Add Note Form */}
      <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this contact..."
          className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
          rows={3}
        />
        <button className="mt-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-lg transition-colors">
          Add Note
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {interactions.length === 0 ? (
          <p className="text-center text-stone-400 py-6">No interactions yet</p>
        ) : (
          interactions.map((interaction) => (
            <div key={interaction.id} className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  {getIcon(interaction.type)}
                </div>
                <div className="w-0.5 flex-1 bg-stone-200" />
              </div>
              <div className="pb-4 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-stone-500 uppercase">
                    {interaction.type}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(interaction.created_at).toLocaleDateString()}
                  </span>
                </div>
                {interaction.title && (
                  <p className="font-medium text-stone-900 mb-1">{interaction.title}</p>
                )}
                <p className="text-sm text-stone-600">{interaction.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
