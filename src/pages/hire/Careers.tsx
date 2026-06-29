import { useEffect, useState } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  compensation?: string;
  description: string;
  postedAt: string;
}

const Careers = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/.netlify/functions/get-job-postings');
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error('[Careers] Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-16 px-4 flex items-center justify-center">
        <p className="text-stone-600">Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="py-16 px-4 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Join the Team</h1>
          <p className="text-xl text-stone-300">
            Help us scale Doxa & Co from solopreneur to multi-person consultancy. Building the future of business operations.
          </p>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-600 text-lg">No open positions right now.</p>
              <p className="text-stone-500 text-sm mt-2">Check back soon as we grow!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg border border-stone-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase size={20} className="text-emerald-600" />
                        <h3 className="text-xl font-bold text-stone-900">{job.title}</h3>
                      </div>

                      <p className="text-stone-600 text-sm mb-4">{job.department}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          {job.type}
                        </div>
                        {job.compensation && <div>{job.compensation}</div>}
                      </div>

                      {/* Expanded Details */}
                      {selectedJob?.id === job.id && (
                        <div className="mt-6 pt-6 border-t border-stone-200 space-y-4">
                          <div>
                            <h4 className="font-semibold text-stone-900 mb-2">About the Role</h4>
                            <p className="text-stone-700 whitespace-pre-wrap">{job.description}</p>
                          </div>

                          <a
                            href={`/hire/apply/${job.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Apply Now <ArrowRight size={16} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">Why Join Doxa</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Impact',
                description: 'Help small business owners solve real operational problems, not solve vanity metrics.',
              },
              {
                title: 'Autonomy',
                description: 'Own your projects end-to-end. No bureaucracy, no micromanagement, just results.',
              },
              {
                title: 'Growth',
                description: 'Scale with us from 1 to 10+ team members. Be part of building something that lasts.',
              },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <h3 className="font-bold text-stone-900 mb-2">{item.title}</h3>
                <p className="text-stone-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
