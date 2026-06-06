import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogOut, BarChart3, FileText, CheckSquare, Settings, LayoutDashboard, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ClientData {
  id: string;
  organization_name: string;
  email: string;
  plan: string;
}

interface Assessment {
  id: string;
  title: string;
  status: string;
  progress_percent: number;
}

interface Project {
  id: string;
  title: string;
  phase: string;
  progress_percent: number;
}

interface Document {
  id: string;
  title: string;
  document_type: string;
}

const SHAKE = { x: [0, -10, 10, -8, 8, 0] };

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('demo@clarityb.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setShake(s => s + 1);
      } else if (data.user) {
        onLogin();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setShake(s => s + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-emerald-50 flex items-center justify-center px-6">
      <motion.div
        key={shake}
        animate={shake > 0 ? SHAKE : {}}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl border border-stone-100 shadow-lg p-10 w-full max-w-sm"
      >
        <img src="/doxa-logo.jpg" alt="Doxa & Co" className="w-full h-auto mb-8 rounded-lg" />

        <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center">ClarityHub</h1>
        <p className="text-stone-500 text-sm text-center mb-8">Business Operating System for Small Businesses</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="name@company.com"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all
                ${error ? 'border-red-400 bg-red-50 placeholder-red-300' : 'border-stone-200 bg-stone-50 focus:border-emerald-500 focus:bg-white'}`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all pr-10
                  ${error ? 'border-red-400 bg-red-50 placeholder-red-300' : 'border-stone-200 bg-stone-50 focus:border-emerald-500 focus:bg-white'}`}
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

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-stone-900 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full text-center text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
          >
            {showDemo ? 'Hide Demo' : 'View Demo Credentials'}
          </button>

          {showDemo && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-xs text-stone-600 mb-3"><strong>Demo Account:</strong></p>
              <p className="text-xs text-stone-600 font-mono mb-2">Email: <code className="bg-white px-2 py-1 rounded">demo@clarityb.com</code></p>
              <p className="text-xs text-stone-600 font-mono">Password: <code className="bg-white px-2 py-1 rounded">demo123</code></p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Dashboard Component
const Dashboard = ({ user, clientData, onLogout }: { user: User; clientData: ClientData | null; onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [clientData]);

  async function loadData() {
    if (!clientData) return;
    setLoading(true);

    try {
      const [assessRes, projRes, docsRes] = await Promise.all([
        supabase.from('assessments').select('*').eq('client_id', clientData.id),
        supabase.from('projects').select('*').eq('client_id', clientData.id),
        supabase.from('documents').select('*').eq('client_id', clientData.id),
      ]);

      if (assessRes.data) setAssessments(assessRes.data);
      if (projRes.data) setProjects(projRes.data);
      if (docsRes.data) setDocuments(docsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assessments', label: 'Assessments', icon: CheckSquare },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const orgName = clientData?.organization_name || 'Organization';
  const userEmail = user?.email || 'user@example.com';

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-stone-900 flex items-center justify-center text-white">
              <BarChart3 size={20} />
            </div>
            <div>
              <p className="text-xs text-stone-500">Welcome to</p>
              <h1 className="text-lg font-bold text-stone-900">ClarityHub</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-sm hidden sm:block">
              <p className="font-semibold text-stone-900">{orgName}</p>
              <p className="text-xs text-stone-500">{userEmail}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors text-sm"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-1 mb-12 border-b border-stone-200 flex-wrap">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all text-sm font-medium ${
                  activeTab === item.id
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size={24} className="animate-spin text-emerald-600" />
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <OverviewTab assessments={assessments} projects={projects} />}
            {activeTab === 'assessments' && <AssessmentsTab assessments={assessments} />}
            {activeTab === 'projects' && <ProjectsTab projects={projects} />}
            {activeTab === 'documents' && <DocumentsTab documents={documents} />}
            {activeTab === 'settings' && <SettingsTab orgName={orgName} />}
          </>
        )}
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab = ({ assessments, projects }: { assessments: Assessment[]; projects: Project[] }) => (
  <div>
    <h2 className="text-2xl font-bold text-stone-900 mb-8">Business Health</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'Health Score', value: '78/100', color: 'emerald' },
        { label: 'Active Projects', value: projects.length.toString(), color: 'blue' },
        { label: 'Documents', value: 'View below', color: 'amber' },
        { label: 'Assessments', value: assessments.length.toString(), color: 'purple' },
      ].map((card, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <p className="text-xs text-stone-500 font-semibold mb-2">{card.label}</p>
          <p className={`text-3xl font-bold text-${card.color}-600`}>{card.value}</p>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
        <h3 className="text-lg font-bold text-stone-900 mb-6">Next Steps</h3>
        <div className="space-y-4">
          {['Complete Discovery Assessment', 'Review Gap Analysis Report', 'Schedule Kickoff Call'].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-emerald-500 mt-0.5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              <p className="text-sm text-stone-700">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-stone-100 shadow-sm">
        <h3 className="text-lg font-bold text-stone-900 mb-6">Recent Activity</h3>
        <div className="space-y-4 text-sm text-stone-600">
          <p>• Account setup complete</p>
          <p>• ClarityHub portal activated</p>
          <p>• Ready to begin discovery phase</p>
          <p>• Documentation system ready</p>
        </div>
      </div>
    </div>
  </div>
);

const AssessmentsTab = ({ assessments }: { assessments: Assessment[] }) => (
  <div>
    <h2 className="text-2xl font-bold text-stone-900 mb-8">Business Assessments</h2>
    {assessments.length === 0 ? (
      <div className="bg-white rounded-2xl p-12 border border-stone-100 text-center">
        <p className="text-stone-500">No assessments yet. They will appear here once created.</p>
      </div>
    ) : (
      <div className="grid gap-6">
        {assessments.map(assessment => (
          <div key={assessment.id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-900">{assessment.title}</h3>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                assessment.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                assessment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                'bg-stone-100 text-stone-600'
              }`}>
                {assessment.status.replace('_', ' ')}
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${assessment.progress_percent}%` }}></div>
            </div>
            <p className="text-xs text-stone-500 mt-2">{assessment.progress_percent}% complete</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ProjectsTab = ({ projects }: { projects: Project[] }) => (
  <div>
    <h2 className="text-2xl font-bold text-stone-900 mb-8">Active Projects</h2>
    {projects.length === 0 ? (
      <div className="bg-white rounded-2xl p-12 border border-stone-100 text-center">
        <p className="text-stone-500">No projects yet. They will appear here once created.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
            <h3 className="font-semibold text-stone-900 mb-2">{project.title}</h3>
            <p className="text-xs text-stone-500 mb-4">Phase: {project.phase}</p>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${project.progress_percent}%` }}></div>
            </div>
            <p className="text-xs text-stone-500 mt-2">{project.progress_percent}% complete</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

const DocumentsTab = ({ documents }: { documents: Document[] }) => (
  <div>
    <h2 className="text-2xl font-bold text-stone-900 mb-8">Documents & SOPs</h2>
    {documents.length === 0 ? (
      <div className="bg-white rounded-2xl p-12 border border-stone-100 text-center">
        <p className="text-stone-500">No documents yet. They will appear here as they are created.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white rounded-xl border border-stone-100 px-6 py-4 flex items-center justify-between hover:border-emerald-300 transition-colors group">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-stone-400 group-hover:text-emerald-600" />
              <span className="font-medium text-stone-900">{doc.title}</span>
            </div>
            <span className="text-xs text-stone-500">{doc.document_type?.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const SettingsTab = ({ orgName }: { orgName: string }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div>
      <h3 className="text-lg font-bold text-stone-900 mb-6">Account Settings</h3>
      <div className="space-y-6">
        <div>
          <label htmlFor="org-name" className="block text-xs font-semibold text-stone-600 mb-2">Organization Name</label>
          <input
            id="org-name"
            type="text"
            value={orgName}
            disabled
            title="Organization name"
            className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm"
          />
        </div>
        <div>
          <label htmlFor="subscription" className="block text-xs font-semibold text-stone-600 mb-2">Subscription Plan</label>
          <input
            id="subscription"
            type="text"
            value="Growth Plan - $179/month"
            disabled
            title="Subscription plan"
            className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm"
          />
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-lg font-bold text-stone-900 mb-6">Billing</h3>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <p className="text-sm text-emerald-900 mb-4">Your subscription is active. Next billing date: July 6, 2026</p>
        <button type="button" className="w-full bg-white border border-emerald-300 text-emerald-700 font-semibold py-2 rounded-lg hover:bg-emerald-50 transition-colors text-sm">
          Manage Billing
        </button>
      </div>
    </div>
  </div>
);

// Main ClarityHub Component
const ClarityHub = () => {
  const [user, setUser] = useState<User | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Load client data
        const { data } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (data) setClientData(data);
      }
    } catch (err) {
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setClientData(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader size={32} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return <LoginGate onLogin={() => checkAuth()} />;
  }

  return <Dashboard user={user} clientData={clientData} onLogout={handleLogout} />;
};

export default ClarityHub;
