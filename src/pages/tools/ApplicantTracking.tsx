import { useEffect, useState } from 'react';
import { Users, Mail, Star, Trash2, Eye, X } from 'lucide-react';

interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  portfolio?: string;
  coverLetter?: string;
  status: 'SUBMITTED' | 'REVIEWED' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFERED' | 'REJECTED' | 'HIRED';
  rating?: number;
  appliedAt: string;
}

const ApplicantTracking = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterRating, setFilterRating] = useState<string>('');

  const statuses = [
    'SUBMITTED',
    'REVIEWED',
    'SHORTLISTED',
    'INTERVIEW',
    'OFFERED',
    'REJECTED',
    'HIRED',
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/.netlify/functions/get-applications');
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error('[ApplicantTracking] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch('/.netlify/functions/update-application-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, status: newStatus }),
      });

      if (res.ok) {
        setApplications(
          applications.map((app) =>
            app.id === appId ? { ...app, status: newStatus as any } : app
          )
        );
        if (selectedApplication?.id === appId) {
          setSelectedApplication({ ...selectedApplication, status: newStatus as any });
        }
      }
    } catch (err) {
      console.error('[ApplicantTracking] Error updating status:', err);
    }
  };

  const updateRating = async (appId: string, rating: number) => {
    try {
      const res = await fetch('/.netlify/functions/rate-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, rating }),
      });

      if (res.ok) {
        setApplications(
          applications.map((app) =>
            app.id === appId ? { ...app, rating } : app
          )
        );
        if (selectedApplication?.id === appId) {
          setSelectedApplication({ ...selectedApplication, rating });
        }
      }
    } catch (err) {
      console.error('[ApplicantTracking] Error updating rating:', err);
    }
  };

  const deleteApplication = async (appId: string) => {
    if (!confirm('Delete this application?')) return;

    try {
      const res = await fetch('/.netlify/functions/delete-application', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId }),
      });

      if (res.ok) {
        setApplications(applications.filter((app) => app.id !== appId));
        setShowDetail(false);
      }
    } catch (err) {
      console.error('[ApplicantTracking] Error deleting application:', err);
    }
  };

  const filtered = applications.filter((app) => {
    if (filterStatus && app.status !== filterStatus) return false;
    if (filterRating && (!app.rating || app.rating < parseInt(filterRating))) return false;
    return true;
  });

  const statusColors: Record<string, string> = {
    SUBMITTED: 'bg-slate-100 text-slate-700',
    REVIEWED: 'bg-blue-100 text-blue-700',
    SHORTLISTED: 'bg-emerald-100 text-emerald-700',
    INTERVIEW: 'bg-amber-100 text-amber-700',
    OFFERED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    HIRED: 'bg-purple-100 text-purple-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-8 px-4 flex items-center justify-center">
        <p className="text-stone-600">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Applicant Tracking</h1>
          <p className="text-stone-600">Manage and review job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-stone-900">{applications.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">New (Submitted)</p>
            <p className="text-3xl font-bold text-slate-600">
              {applications.filter((a) => a.status === 'SUBMITTED').length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Moving Forward</p>
            <p className="text-3xl font-bold text-emerald-600">
              {applications.filter((a) =>
                ['SHORTLISTED', 'INTERVIEW', 'OFFERED', 'HIRED'].includes(a.status)
              ).length}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">Hired</p>
            <p className="text-3xl font-bold text-purple-600">
              {applications.filter((a) => a.status === 'HIRED').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
          >
            <option value="">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
          </select>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg border border-stone-200 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-stone-500">No applications found</div>
          ) : (
            <div className="divide-y divide-stone-200">
              {filtered.map((app) => (
                <div key={app.id} className="p-6 hover:bg-stone-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-stone-900">{app.fullName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 mb-2">{app.jobTitle}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                        <a href={`mailto:${app.email}`} className="flex items-center gap-2 hover:text-stone-900">
                          <Mail size={16} />
                          {app.email}
                        </a>
                        {app.linkedIn && (
                          <a
                            href={app.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline"
                          >
                            LinkedIn
                          </a>
                        )}
                        {app.portfolio && (
                          <a
                            href={app.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline"
                          >
                            Portfolio
                          </a>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => updateRating(app.id, star)}
                            className="text-lg transition-colors"
                            title={`Rate ${star} stars`}
                          >
                            <Star
                              size={20}
                              className={
                                app.rating && app.rating >= star
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300 hover:text-amber-300'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedApplication(app);
                          setShowDetail(true);
                        }}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => deleteApplication(app.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="mt-4 flex gap-2">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className="px-3 py-1 text-sm border border-stone-300 rounded-lg focus:outline-none focus:border-stone-500"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-stone-900">{selectedApplication.fullName}</h2>
              <button
                onClick={() => setShowDetail(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-stone-600">Position</p>
                <p className="text-stone-900">{selectedApplication.jobTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-stone-600">Email</p>
                  <a href={`mailto:${selectedApplication.email}`} className="text-blue-600 hover:text-blue-700">
                    {selectedApplication.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-600">Phone</p>
                  <p className="text-stone-900">{selectedApplication.phone || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-stone-600">Cover Letter</p>
                <p className="text-stone-700 whitespace-pre-wrap mt-2">
                  {selectedApplication.coverLetter || 'No cover letter provided'}
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex-1 px-4 py-2 border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 font-medium"
                >
                  Close
                </button>
                {selectedApplication.linkedIn && (
                  <a
                    href={selectedApplication.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center"
                  >
                    View LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantTracking;
