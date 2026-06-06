import { Plus } from 'lucide-react';

export default function KPIs() {
  const kpis = [
    { name: 'Revenue', current: 125000, target: 150000, unit: '$', status: 'on-track', dataPoints: [100, 110, 120, 125] },
    { name: 'Customer Retention', current: 87, target: 95, unit: '%', status: 'at-risk', dataPoints: [85, 86, 87, 87] },
    { name: 'Team Productivity', current: 82, target: 90, unit: '%', status: 'on-track', dataPoints: [75, 78, 80, 82] },
    { name: 'Process Efficiency', current: 71, target: 85, unit: '%', status: 'off-track', dataPoints: [70, 70, 70, 71] },
    { name: 'Customer Satisfaction', current: 4.2, target: 4.5, unit: '/5', status: 'on-track', dataPoints: [4.0, 4.1, 4.1, 4.2] },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-emerald-100 text-emerald-700';
      case 'at-risk':
        return 'bg-amber-100 text-amber-700';
      case 'off-track':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  const statusDot = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-emerald-600';
      case 'at-risk':
        return 'bg-amber-600';
      case 'off-track':
        return 'bg-red-600';
      default:
        return 'bg-stone-600';
    }
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Key Performance Indicators</h1>
        <p className="text-stone-600">Monitor your business metrics</p>
      </div>

      <button
        type="button"
        className="mb-8 inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
      >
        <Plus size={18} className="mr-2" /> Add KPI
      </button>

      {kpis.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {kpis.map((kpi, i) => {
            const progress = (kpi.current / kpi.target) * 100;
            return (
              <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-stone-900">{kpi.name}</h3>
                    <p className="text-xs text-stone-500 mt-1">Target: {kpi.target}{kpi.unit}</p>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold ${statusColor(kpi.status)}`}>
                    <span className={`w-2 h-2 rounded-full ${statusDot(kpi.status)}`} />
                    {kpi.status.replace('-', ' ')}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-stone-900 mb-2">
                    {kpi.current}{kpi.unit}
                  </p>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="flex items-end gap-1 h-12 bg-stone-50 rounded-lg p-2">
                  {kpi.dataPoints.map((point, j) => {
                    const maxPoint = Math.max(...kpi.dataPoints);
                    const height = (point / maxPoint) * 100;
                    return (
                      <div
                        key={j}
                        className="flex-1 rounded-t bg-emerald-400"
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <p className="text-stone-600 mb-4">No KPIs tracked yet.</p>
          <p className="text-stone-500 text-sm">Add your first KPI to start monitoring your business health.</p>
        </div>
      )}
    </div>
  );
}
