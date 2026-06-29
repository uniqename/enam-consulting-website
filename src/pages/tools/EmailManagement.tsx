import { useEffect, useState } from 'react';
import { Mail, Send, Filter, Download } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  source: string;
  stage: string;
  emailsSent: number;
  createdAt: string;
}

interface Stats {
  total: number;
  byStage: { stage: string; count: number }[];
}

const EmailManagement = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState('');
  const [sequenceType, setSequenceType] = useState('welcome');
  const [sendingSequence, setSendingSequence] = useState(false);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const query = filterStage ? `?stage=${filterStage}` : '';
        const res = await fetch(`/.netlify/functions/get-subscriber-list${query}`);
        const data = await res.json();
        if (data.success) {
          setSubscribers(data.subscribers);
          setStats(data.stats);
        }
      } catch (err) {
        console.error('[EmailManagement] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [filterStage]);

  const handleSendSequence = async () => {
    if (!sequenceType) return;

    setSendingSequence(true);
    try {
      const res = await fetch('/.netlify/functions/send-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequenceType,
          stage: filterStage || 'LEAD',
          limit: 100,
        }),
      });

      const data = await res.json();
      alert(`Sent to ${data.sent} subscribers, ${data.failed} failed`);
    } catch (err) {
      alert('Failed to send sequence');
      console.error(err);
    } finally {
      setSendingSequence(false);
    }
  };

  const handleExportCSV = () => {
    if (!subscribers.length) return;

    const headers = ['Email', 'Name', 'Source', 'Stage', 'Emails Sent', 'Signed Up'];
    const rows = subscribers.map((s) => [
      s.email,
      s.name || '',
      s.source,
      s.stage,
      s.emailsSent,
      new Date(s.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-8 px-4 flex items-center justify-center">
        <p className="text-stone-600">Loading subscribers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Email Subscribers</h1>
          <p className="text-stone-600">Manage your email list and send automated sequences.</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6">
              <p className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
                Total Subscribers
              </p>
              <p className="text-3xl font-bold text-stone-900">{stats.total}</p>
            </div>

            <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6">
              <p className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                By Stage
              </p>
              <div className="space-y-1">
                {stats.byStage.map((s) => (
                  <div key={s.stage} className="flex justify-between text-sm">
                    <span className="text-stone-600">{s.stage}</span>
                    <span className="font-semibold text-stone-900">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Send Sequence */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <Send size={20} />
            Send Email Sequence
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Sequence Type</label>
                <select
                  value={sequenceType}
                  onChange={(e) => setSequenceType(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="welcome">Welcome Series</option>
                  <option value="post-booking">Post-Booking</option>
                  <option value="nurture">Nurture Series</option>
                  <option value="abandoned">Abandoned Cart (Coming Soon)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Filter by Stage</label>
                <select
                  value={filterStage}
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500"
                >
                  <option value="">All Stages</option>
                  <option value="LEAD">Leads</option>
                  <option value="PROSPECT">Prospects</option>
                  <option value="PAID">Paid</option>
                  <option value="CLIENT">Clients</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSendSequence}
              disabled={sendingSequence}
              className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {sendingSequence ? 'Sending...' : 'Send to Subscribers'}
            </button>
          </div>
        </div>

        {/* Subscribers Table */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Mail size={20} />
              Subscriber List
            </h2>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">
                    Emails Sent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">
                    Signed Up
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {subscribers.length > 0 ? (
                  subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-stone-900 font-medium">{sub.email}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">{sub.name || '-'}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        <span className="inline-block px-2 py-1 bg-stone-100 rounded text-xs">
                          {sub.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            sub.stage === 'LEAD'
                              ? 'bg-blue-100 text-blue-700'
                              : sub.stage === 'PROSPECT'
                                ? 'bg-amber-100 text-amber-700'
                                : sub.stage === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {sub.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600">{sub.emailsSent}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-stone-600">
                      No subscribers yet. Start capturing emails on your website.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="font-bold text-emerald-900 mb-2">How It Works</h3>
          <ul className="text-sm text-emerald-800 space-y-1">
            <li>• Subscribers are automatically added when they sign up on your website</li>
            <li>• Each subscriber is tagged with their source and current stage</li>
            <li>• Use this dashboard to send email sequences to specific stages</li>
            <li>• Resend handles all email delivery, no monthly fees</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmailManagement;
