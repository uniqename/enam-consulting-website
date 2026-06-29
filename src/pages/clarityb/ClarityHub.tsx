import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, BarChart3, FileText, CheckSquare, Settings, LayoutDashboard, Eye, EyeOff } from 'lucide-react';

// Owner password (doxa2025) - same as /tools
const OWNER_PASSWORD_HASH = '12bd42f84e9b6fb261fe8bb8a56a5cc6fb2a2ff1721f6417fd8a75c153ad4582';
const SESSION_KEY = 'clarityb_owner_session';
const SHAKE = { x: [0, -10, 10, -8, 8, 0] };

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

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hash = await sha256(password);
    if (hash === OWNER_PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setError(true);
      setShake(s => s + 1);
      setPassword('');
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
        <img src="/assets/images/doxa-logo-new.jpg" alt="Doxa & Co" className="w-full h-auto mb-8 rounded-lg" />

        <h1 className="text-2xl font-bold text-stone-900 mb-2 text-center">ClarityHub</h1>
        <p className="text-stone-500 text-sm text-center mb-8">Business Operating System</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-stone-600 mb-2">Owner Password</label>
            <div className="relative">
              <input
                id="password"
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
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

          {error && <p className="text-red-500 text-xs">Incorrect password.</p>}

          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-stone-900 text-white font-semibold py-3 rounded-xl text-sm transition-all mt-2"
          >
            Unlock
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-stone-100">
          <p className="text-center text-xs text-stone-500">Owner access only</p>
        </div>
      </motion.div>
    </div>
  );
}

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assessments', label: 'Assessments', icon: CheckSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-stone-900 flex items-center justify-center text-white flex-shrink-0">
              <BarChart3 size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">ClarityHub</p>
              <h1 className="text-lg font-bold text-stone-900">Owner Portal</h1>
            </div>
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

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex gap-1 mb-12 border-b border-stone-200 flex-wrap">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                type="button"
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

        {/* Content */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Welcome to ClarityHub</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-semibold text-stone-900 mb-2">Discovery Phase</h3>
                <p className="text-sm text-stone-600">Current State Assessment, Business Scorecard, Pain Point Report</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-semibold text-stone-900 mb-2">Analysis Phase</h3>
                <p className="text-sm text-stone-600">Gap Analysis Report, Opportunity Matrix, Prioritized Recommendations</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-stone-100">
                <h3 className="font-semibold text-stone-900 mb-2">Design Phase</h3>
                <p className="text-sm text-stone-600">Future State Blueprint, SOP Library, KPI Dashboard Design</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Assessment Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Business Health Assessment', desc: 'Complete overview of business operations' },
                { title: 'Operations Assessment', desc: 'Process efficiency and workflow analysis' },
                { title: 'Technology Assessment', desc: 'Systems and tool evaluation' },
                { title: 'Employee Assessment', desc: 'Team productivity and development' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-stone-100">
                  <h3 className="font-semibold text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-stone-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Documents & NDAs</h2>
            <div className="space-y-4">
              {[
                'Consulting Agreement',
                'Statement of Work',
                'NDA - Client Agreement',
                'Data Processing Agreement',
                'Service Level Agreement',
              ].map((doc, i) => (
                <div key={i} className="bg-white rounded-xl border border-stone-100 px-6 py-4 flex items-center justify-between hover:border-emerald-300 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-stone-400 group-hover:text-emerald-600" />
                    <span className="font-medium text-stone-900">{doc}</span>
                  </div>
                  <button type="button" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">View</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Settings</h2>
            <div className="bg-white rounded-2xl p-8 border border-stone-100">
              <div className="space-y-6">
                <div>
                  <label htmlFor="portal-name" className="block text-xs font-semibold text-stone-600 mb-2">Portal Name</label>
                  <input id="portal-name" type="text" value="Doxa ClarityHub" disabled title="Portal name" className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm" />
                </div>
                <div>
                  <label htmlFor="organization" className="block text-xs font-semibold text-stone-600 mb-2">Organization</label>
                  <input id="organization" type="text" value="Doxa & Co. LLC" disabled title="Organization name" className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-900 text-sm" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ClarityHub = () => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');

  if (!unlocked) {
    return <LoginGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <Dashboard
      onLogout={() => {
        sessionStorage.removeItem(SESSION_KEY);
        setUnlocked(false);
      }}
    />
  );
};

export default ClarityHub;
