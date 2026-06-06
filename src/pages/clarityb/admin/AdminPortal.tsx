import { useState, useRef, useEffect, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogOut, Plus, Trash2 } from 'lucide-react';

const ADMIN_PASSWORD_HASH = '12bd42f84e9b6fb261fe8bb8a56a5cc6fb2a2ff1721f6417fd8a75c153ad4582';
const ADMIN_SESSION_KEY = 'doxa_clarity_admin';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function LoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const hash = await sha256(password);
    if (hash === ADMIN_PASSWORD_HASH) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
      onUnlock();
    } else {
      setError(true);
      setShake(s => s + 1);
      setPassword('');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-emerald-50 flex items-center justify-center px-6 pt-28 pb-24">
      <motion.div
        key={shake}
        animate={shake > 0 ? { x: [0, -10, 10, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-stone-100 shadow-sm p-10 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center">Admin Portal</h1>
        <p className="text-stone-500 text-sm text-center mb-8">ClarityHub Owner Access</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-stone-600 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                id="password"
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all pr-10 ${
                  error
                    ? 'border-red-400 bg-red-50 placeholder-red-300'
                    : 'border-stone-200 bg-stone-50 focus:border-emerald-500 focus:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs">Incorrect password.</p>}

          <button
            type="submit"
            className="bg-stone-900 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-sm transition-all mt-2"
          >
            Unlock
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100">
          <p className="text-center text-xs text-stone-500">Admin access only</p>
        </div>
      </motion.div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('clients');

  const clients = [
    { name: 'ABC Manufacturing', email: 'contact@abc.com', score: 73, projects: 2, lastLogin: '2 days ago' },
    { name: 'XYZ Services', email: 'info@xyz.com', score: 58, projects: 1, lastLogin: '5 days ago' },
  ];

  const assessments = [
    { date: '2026-05-20', company: 'Tech Startup Co', score: 65, tier: 'Good Foundation', email: 'founder@tech.com' },
    { date: '2026-05-18', company: 'Local Restaurant', score: 42, tier: 'Needs Work', email: 'owner@local.com' },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-stone-900">Admin Portal</h1>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-1 mb-12 border-b border-stone-200 flex-wrap">
          {['clients', 'assessments', 'documents', 'workflow', 'planner'].map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 border-b-2 transition-all text-sm font-medium ${
                activeTab === tab
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900">Clients</h2>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors"
              >
                <Plus size={16} /> Invite Client
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Score</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Projects</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Last Login</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, i) => (
                    <tr key={i} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-stone-900">{client.name}</p>
                          <p className="text-xs text-stone-500">{client.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                          {client.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-900">{client.projects}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">{client.lastLogin}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'assessments' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Assessment Responses</h2>
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Company</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Score</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-stone-600 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment, i) => (
                    <tr key={i} className="border-b border-stone-100 hover:bg-stone-50">
                      <td className="px-6 py-4 text-sm text-stone-900">{assessment.date}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-stone-900">{assessment.company}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                          {assessment.score}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-600">{assessment.email}</td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Document Library</h2>
            <div className="bg-white rounded-2xl border border-stone-100 border-dashed p-8 text-center mb-8">
              <p className="text-stone-600 mb-4">Drag and drop documents here</p>
              <button
                type="button"
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm"
              >
                Upload Files
              </button>
            </div>
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center justify-between">
                <p className="font-medium text-stone-900">SOP Template - Operations.docx</p>
                <button
                  type="button"
                  className="p-2 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Tab */}
        {activeTab === 'workflow' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Daily Workflow Tracker</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['Morning', 'Midday', 'Afternoon', 'Evening'].map((block, i) => (
                <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
                  <h3 className="font-semibold text-stone-900 mb-4">{block}</h3>
                  <div className="space-y-3">
                    {['Task 1', 'Task 2', 'Task 3'].map((task, j) => (
                      <label key={j} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-stone-300" />
                        <span className="text-sm text-stone-700">{task}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Planner Tab */}
        {activeTab === 'planner' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Monthly Planner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { week: 'Week 1', focus: 'Acquire' },
                { week: 'Week 2', focus: 'Assess' },
                { week: 'Week 3', focus: 'Implement' },
                { week: 'Week 4', focus: 'Review' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
                  <h3 className="font-semibold text-stone-900 mb-2">{item.week}</h3>
                  <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-4">
                    {item.focus}
                  </span>
                  <div className="space-y-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, j) => (
                      <label key={j} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-stone-300" />
                        <span className="text-sm text-stone-700">{day} Focus</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPortal() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === '1');

  if (!unlocked) {
    return <LoginGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <AdminDashboard
      onLogout={() => {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        setUnlocked(false);
      }}
    />
  );
}
