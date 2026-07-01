import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Upload, Check, Briefcase } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const JobApplication = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    coverLetter: '',
    resumeFile: null as File | null,
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/.netlify/functions/get-job-posting?jobId=${jobId}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.job);
        }
      } catch (err) {
        console.error('[JobApplication] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formBody = new FormData();
      formBody.append('jobId', jobId || '');
      formBody.append('fullName', formData.fullName);
      formBody.append('email', formData.email);
      formBody.append('phone', formData.phone);
      formBody.append('linkedIn', formData.linkedIn);
      formBody.append('portfolio', formData.portfolio);
      formBody.append('coverLetter', formData.coverLetter);
      if (formData.resumeFile) {
        formBody.append('resume', formData.resumeFile);
      }

      const res = await fetch('/.netlify/functions/submit-job-application', {
        method: 'POST',
        body: formBody,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('[JobApplication] Error submitting:', err);
      alert('Error submitting application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 flex items-center justify-center">
        <p className="text-stone-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 flex items-center justify-center">
        <p className="text-stone-600">Job not found</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-stone-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg border border-stone-200 p-8 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-4">
            <Check className="text-emerald-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Application Submitted</h2>
          <p className="text-stone-600 mb-4">Thanks for applying to {job.title}. We'll review your application and be in touch soon.</p>
          <a href="/hire/careers" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Back to Careers
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Job Info */}
        <div className="bg-white rounded-lg border border-stone-200 p-6 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Briefcase className="text-emerald-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stone-900">{job.title}</h1>
              <p className="text-stone-600">{job.department}</p>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-stone-600">
            <span>{job.location}</span>
            <span>{job.type}</span>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg border border-stone-200 p-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Apply for {job.title}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="your@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">LinkedIn Profile</label>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* Portfolio */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Portfolio / Website</label>
              <input
                type="url"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="https://yourportfolio.com"
              />
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Resume / CV</label>
              <div className="relative border-2 border-dashed border-stone-300 rounded-lg p-6 hover:border-emerald-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFormData({ ...formData, resumeFile: e.target.files?.[0] || null })}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center gap-2 text-stone-600">
                  <Upload size={20} />
                  <div className="text-center">
                    <p className="font-medium">
                      {formData.resumeFile ? formData.resumeFile.name : 'Drag and drop your resume'}
                    </p>
                    <p className="text-sm text-stone-500">or click to browse</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Cover Letter</label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Tell us why you're interested in this role..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
