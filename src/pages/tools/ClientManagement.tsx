import { useEffect, useState } from 'react';
import { Mail, Check, Clock, AlertCircle, Download, Trash2, Eye } from 'lucide-react';

interface Booking {
  id: string;
  email: string;
  name: string;
  company: string;
  meetingType: string;
  meetingDate: string;
  createdAt: string;
  paymentStatus: 'PENDING' | 'PAID' | 'TRIAL';
  orgId?: string;
}

const ClientManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'TRIAL'>('ALL');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('/.netlify/functions/get-bookings');
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error('[ClientManagement] Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filtered = bookings.filter((b) => filter === 'ALL' || b.paymentStatus === filter);

  const statusConfig = {
    PENDING: { color: 'bg-amber-50 border-amber-200', icon: Clock, label: 'Awaiting Assessment', badge: 'text-amber-700' },
    TRIAL: { color: 'bg-blue-50 border-blue-200', icon: AlertCircle, label: 'Trial Active', badge: 'text-blue-700' },
    PAID: { color: 'bg-green-50 border-green-200', icon: Check, label: 'Paying Client', badge: 'text-green-700' },
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Client Management</h1>
          <p className="text-stone-600">All bookings and prospects from Doxa website</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-stone-900">{bookings.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Paid Clients</p>
            <p className="text-3xl font-bold text-green-600">{bookings.filter((b) => b.paymentStatus === 'PAID').length}</p>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Trial / Prospects</p>
            <p className="text-3xl font-bold text-amber-600">{bookings.filter((b) => b.paymentStatus !== 'PAID').length}</p>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold text-stone-900">
              {bookings.length > 0 ? `${Math.round((bookings.filter((b) => b.paymentStatus === 'PAID').length / bookings.length) * 100)}%` : '—'}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {(['ALL', 'PENDING', 'TRIAL', 'PAID'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              {f === 'ALL' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-stone-500">Loading bookings...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-stone-500">No bookings yet</div>
          ) : (
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">Booked</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-stone-700 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filtered.map((booking) => {
                  const config = statusConfig[booking.paymentStatus];
                  const StatusIcon = config.icon;
                  return (
                    <tr key={booking.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-900">{booking.name}</td>
                      <td className="px-6 py-4 text-stone-700">{booking.company}</td>
                      <td className="px-6 py-4 text-stone-600 text-sm">{booking.email}</td>
                      <td className="px-6 py-4 text-stone-600 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                          <StatusIcon size={16} />
                          <span className={config.badge}>{config.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                          title="Send email"
                        >
                          <Mail size={18} />
                        </button>
                        {booking.orgId && (
                          <button
                            className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-600 hover:text-stone-900"
                            title="View portal"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Export */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-stone-600">Showing {filtered.length} of {bookings.length} bookings</p>
          <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium transition-colors">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
