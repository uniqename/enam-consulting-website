import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface OutreachWeek {
  id: string;
  weekOf: string;
  outreaches: number;
  replies: number;
  calls: number;
  proposals: number;
  closed: number;
  notes: string;
}

const OUTREACH_TARGET = 9;
const CLIENTS_GOAL = 9;
const STORAGE_KEY = 'clarity_outreach_data';

const OutreachTracker = () => {
  const [weeks, setWeeks] = useState<OutreachWeek[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newWeek, setNewWeek] = useState<Partial<OutreachWeek>>({
    weekOf: getDefaultWeekOf(),
    outreaches: 0,
    replies: 0,
    calls: 0,
    proposals: 0,
    closed: 0,
    notes: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setWeeks(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever weeks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weeks));
  }, [weeks]);

  function getDefaultWeekOf(): string {
    const now = new Date();
    const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    return monday.toISOString().split('T')[0];
  }

  const addWeek = () => {
    if (!newWeek.weekOf) return;
    const week: OutreachWeek = {
      id: Date.now().toString(),
      weekOf: newWeek.weekOf || '',
      outreaches: newWeek.outreaches || 0,
      replies: newWeek.replies || 0,
      calls: newWeek.calls || 0,
      proposals: newWeek.proposals || 0,
      closed: newWeek.closed || 0,
      notes: newWeek.notes || '',
    };
    setWeeks([week, ...weeks]);
    setNewWeek({
      weekOf: getDefaultWeekOf(),
      outreaches: 0,
      replies: 0,
      calls: 0,
      proposals: 0,
      closed: 0,
      notes: '',
    });
  };

  const deleteWeek = (id: string) => {
    setWeeks(weeks.filter((w) => w.id !== id));
  };

  const updateWeek = (id: string, field: keyof OutreachWeek, value: any) => {
    setWeeks(
      weeks.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  // Compute scoreboard metrics
  const currentWeek = weeks[0];
  const totalOutreaches = weeks.reduce((sum, w) => sum + w.outreaches, 0);
  const totalReplies = weeks.reduce((sum, w) => sum + w.replies, 0);
  const totalCalls = weeks.reduce((sum, w) => sum + w.calls, 0);
  const totalProposals = weeks.reduce((sum, w) => sum + w.proposals, 0);
  const totalClosed = weeks.reduce((sum, w) => sum + w.closed, 0);
  const avgPerWeek =
    weeks.length > 0
      ? (totalOutreaches / weeks.length).toFixed(1)
      : '0';
  const replyRate =
    totalOutreaches > 0
      ? ((totalReplies / totalOutreaches) * 100).toFixed(0)
      : '0';

  const currentWeekOutreaches = currentWeek?.outreaches || 0;
  const progressPct = Math.min((currentWeekOutreaches / OUTREACH_TARGET) * 100, 100);
  const isOnTarget = currentWeekOutreaches >= OUTREACH_TARGET;

  return (
    <div className="space-y-8">
      {/* Scoreboard */}
      <div className="bg-gradient-to-br from-stone-50 to-stone-100 border border-stone-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-4">
          This Week's Progress
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Outreaches Progress */}
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-stone-700">Outreaches</span>
              <span className="text-lg font-bold text-emerald-600">
                {currentWeekOutreaches}/{OUTREACH_TARGET}
              </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isOnTarget ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Avg/week:</span>
              <span className="font-semibold text-stone-900">{avgPerWeek}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-600">Reply rate:</span>
              <span className="font-semibold text-stone-900">{replyRate}%</span>
            </div>
          </div>
        </div>

        {/* YTD Totals */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded border border-stone-200 p-3 text-center">
            <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Calls</div>
            <div className="text-2xl font-bold text-stone-900">{totalCalls}</div>
          </div>
          <div className="bg-white rounded border border-stone-200 p-3 text-center">
            <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Proposals</div>
            <div className="text-2xl font-bold text-stone-900">{totalProposals}</div>
          </div>
          <div className="bg-white rounded border border-stone-200 p-3 text-center">
            <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Closed</div>
            <div className="text-2xl font-bold text-emerald-600">
              {totalClosed}/{CLIENTS_GOAL}
            </div>
          </div>
          <div className="bg-white rounded border border-stone-200 p-3 text-center">
            <div className="text-xs text-stone-500 uppercase tracking-wide mb-1">Total Out</div>
            <div className="text-2xl font-bold text-stone-900">{totalOutreaches}</div>
          </div>
        </div>
      </div>

      {/* Add Week Form */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-stone-700 mb-4">Log New Week</h3>
        <div className="grid grid-cols-7 gap-3">
          <input
            type="date"
            value={newWeek.weekOf || ''}
            onChange={(e) => setNewWeek({ ...newWeek, weekOf: e.target.value })}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            placeholder="Week of"
          />
          <input
            type="number"
            min="0"
            value={newWeek.outreaches || 0}
            onChange={(e) => setNewWeek({ ...newWeek, outreaches: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            placeholder="Outreaches"
          />
          <input
            type="number"
            min="0"
            value={newWeek.replies || 0}
            onChange={(e) => setNewWeek({ ...newWeek, replies: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            placeholder="Replies"
          />
          <input
            type="number"
            min="0"
            value={newWeek.calls || 0}
            onChange={(e) => setNewWeek({ ...newWeek, calls: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            placeholder="Calls"
          />
          <input
            type="number"
            min="0"
            value={newWeek.proposals || 0}
            onChange={(e) => setNewWeek({ ...newWeek, proposals: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            placeholder="Proposals"
          />
          <input
            type="number"
            min="0"
            value={newWeek.closed || 0}
            onChange={(e) => setNewWeek({ ...newWeek, closed: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
            placeholder="Closed"
          />
          <button
            onClick={addWeek}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Weekly History Table */}
      <div>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Weekly History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-100 border border-stone-200">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-stone-700">Week Of</th>
                <th className="px-4 py-2 text-center font-semibold text-stone-700">Outreach</th>
                <th className="px-4 py-2 text-center font-semibold text-stone-700">Replies</th>
                <th className="px-4 py-2 text-center font-semibold text-stone-700">Calls</th>
                <th className="px-4 py-2 text-center font-semibold text-stone-700">Proposals</th>
                <th className="px-4 py-2 text-center font-semibold text-stone-700">Closed</th>
                <th className="px-4 py-2 text-left font-semibold text-stone-700">Notes</th>
                <th className="px-4 py-2 text-center font-semibold text-stone-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {weeks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-stone-500">
                    No weeks logged yet
                  </td>
                </tr>
              ) : (
                weeks.map((week) => (
                  <tr key={week.id} className="border-b border-stone-200 hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{week.weekOf}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={week.outreaches}
                        onChange={(e) =>
                          updateWeek(week.id, 'outreaches', parseInt(e.target.value) || 0)
                        }
                        className="w-12 px-2 py-1 border border-stone-200 rounded text-center focus:outline-none focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={week.replies}
                        onChange={(e) =>
                          updateWeek(week.id, 'replies', parseInt(e.target.value) || 0)
                        }
                        className="w-12 px-2 py-1 border border-stone-200 rounded text-center focus:outline-none focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={week.calls}
                        onChange={(e) =>
                          updateWeek(week.id, 'calls', parseInt(e.target.value) || 0)
                        }
                        className="w-12 px-2 py-1 border border-stone-200 rounded text-center focus:outline-none focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={week.proposals}
                        onChange={(e) =>
                          updateWeek(week.id, 'proposals', parseInt(e.target.value) || 0)
                        }
                        className="w-12 px-2 py-1 border border-stone-200 rounded text-center focus:outline-none focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="0"
                        value={week.closed}
                        onChange={(e) =>
                          updateWeek(week.id, 'closed', parseInt(e.target.value) || 0)
                        }
                        className="w-12 px-2 py-1 border border-stone-200 rounded text-center focus:outline-none focus:border-emerald-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={week.notes}
                        onChange={(e) =>
                          updateWeek(week.id, 'notes', e.target.value)
                        }
                        className="w-full px-2 py-1 border border-stone-200 rounded text-sm focus:outline-none focus:border-emerald-500"
                        placeholder="Notes..."
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteWeek(week.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OutreachTracker;
