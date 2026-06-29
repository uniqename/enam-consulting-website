import { useEffect, useState } from 'react';
import { Mail, Check, Clock, AlertCircle, Download, Trash2, Eye, Lock, Zap, X } from 'lucide-react';

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
  intakeFlow?: string;
}

const ClientManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'TRIAL'>('ALL');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [selectedIntake, setSelectedIntake] = useState<string>('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [intakeLoading, setIntakeLoading] = useState(false);

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

  const handleResetPassword = async () => {
    if (!selectedBooking || !newPassword) return;

    setPasswordLoading(true);
    try {
      const res = await fetch('/.netlify/functions/reset-client-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedBooking.id,
          newPassword,
        }),
      });

      if (res.ok) {
        alert(`Password reset. Send to ${selectedBooking.email}: \n\nTemp password: ${newPassword}`);
        setNewPassword('');
        setShowPasswordModal(false);
      } else {
        alert('Failed to reset password');
      }
    } catch (err) {
      alert('Error resetting password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAssignIntake = async () => {
    if (!selectedBooking || !selectedIntake) return;

    setIntakeLoading(true);
    try {
      const res = await fetch('/.netlify/functions/assign-intake-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          intakeFlow: selectedIntake,
        }),
      });

      if (res.ok) {
        alert(`${selectedBooking.name} assigned to ${selectedIntake} flow`);
        setSelectedIntake('');
        setShowIntakeModal(false);
      } else {
        alert('Failed to assign intake flow');
      }
    } catch (err) {
      alert('Error assigning intake flow');
    } finally {
      setIntakeLoading(false);
    }
  };

  const filtered = bookings.filter((b) => filter === 'ALL' || b.paymentStatus === filter);

  const statusConfig = {
    PENDING: { color: 'bg-amber-50 border-amber-200', icon: Clock, label: 'Awaiting Assessment', badge: 'text-amber-700' },
    TRIAL: { color: 'bg-blue-50 border-blue-200', icon: AlertCircle, label: 'Trial Active', badge: 'text-blue-700' },
    PAID: { color: 'bg-green-50 border-green-200', icon: Check, label: 'Paying Client', badge: 'text-green-700' },
  };

  const intakeFlows = [
    { id: 'assessment', label: 'Business Assessment' },
    { id: 'sop-build', label: 'SOP Build' },
    { id: 'strategy', label: 'Strategy Session' },
    { id: 'implementation', label: 'Implementation' },
    { id: 'none', label: 'No Flow' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Client Management</h1>
          <p className="text-stone-600">All bookings, prospects, and enrollment tracking</p>
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
              type="button"
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-stone-700 uppercase tracking-wide">Intake Flow</th>
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
                      <td className="px-6 py-4 text-stone-700">{booking.company || '—'}</td>
                      <td className="px-6 py-4 text-stone-600 text-sm">{booking.email}</td>
                      <td className="px-6 py-4 text-stone-600 text-sm">
                        <span className="inline-block px-2 py-1 bg-stone-100 rounded text-xs">
                          {booking.intakeFlow || 'Not assigned'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                          <StatusIcon size={16} />
                          <span className={config.badge}>{config.label}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowPasswordModal(true);
                          }}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700"
                          title="Reset password"
                          aria-label="Reset password"
                        >
                          <Lock size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowIntakeModal(true);
                          }}
                          className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600 hover:text-emerald-700"
                          title="Assign intake flow"
                          aria-label="Assign intake flow"
                        >
                          <Zap size={18} />
                        </button>
                        {booking.orgId && (
                          <button
                            type="button"
                            className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-600 hover:text-stone-900"
                            title="View portal"
                            aria-label="View portal"
                          >
                            <Eye size={18} />
                          </button>
                        )}
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
          <button type="button" className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium transition-colors">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPasswordModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">Reset Password</h2>
              <button type="button" onClick={() => setShowPasswordModal(false)} className="text-stone-400 hover:text-stone-600" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-stone-600 mb-4">
              Reset password for <strong>{selectedBooking.name}</strong>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-2">New Temporary Password</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={passwordLoading || !newPassword}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {passwordLoading ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intake Flow Modal */}
      {showIntakeModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-900">Assign Intake Flow</h2>
              <button type="button" onClick={() => setShowIntakeModal(false)} className="text-stone-400 hover:text-stone-600" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-stone-600 mb-4">
              Assign intake flow for <strong>{selectedBooking.name}</strong>
            </p>

            <div className="mb-4 space-y-2">
              {intakeFlows.map((flow) => (
                <label key={flow.id} className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer">
                  <input
                    type="radio"
                    name="intake"
                    value={flow.id}
                    checked={selectedIntake === flow.id}
                    onChange={(e) => setSelectedIntake(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-stone-700">{flow.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowIntakeModal(false)}
                className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignIntake}
                disabled={intakeLoading || !selectedIntake}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {intakeLoading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
