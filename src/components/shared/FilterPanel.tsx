import { ChevronDown } from 'lucide-react';

interface FilterPanelProps {
  criteria: {
    meeting_type: string;
    status: string;
    date_range: string;
  };
  onCriteriaChange: (criteria: any) => void;
}

export default function FilterPanel({ criteria, onCriteriaChange }: FilterPanelProps) {
  const handleChange = (key: string, value: string) => {
    onCriteriaChange({
      ...criteria,
      [key]: value,
    });
  };

  return (
    <div className="border-b border-stone-200 p-4 space-y-3 bg-stone-50">
      <div>
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
          Meeting Type
        </label>
        <select
          value={criteria.meeting_type}
          onChange={(e) => handleChange('meeting_type', e.target.value)}
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
        >
          <option value="all">All Types</option>
          <option value="General Inquiry">General Inquiry</option>
          <option value="Quick Consultation">Quick Consultation</option>
          <option value="Enterprise GRC Strategy">Enterprise GRC</option>
          <option value="MVP Development Discovery">MVP Development</option>
          <option value="Fractional Product Leadership">Fractional PM</option>
          <option value="AI Transformation Advisory">AI Advisory</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
          Status
        </label>
        <select
          value={criteria.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
        >
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="no-show">No-show</option>
          <option value="all">All</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
          Date Range
        </label>
        <select
          value={criteria.date_range}
          onChange={(e) => handleChange('date_range', e.target.value)}
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
        >
          <option value="all">All Time</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      <button
        onClick={() =>
          onCriteriaChange({
            meeting_type: 'all',
            status: 'active',
            date_range: 'all',
          })
        }
        className="w-full px-3 py-1.5 text-xs font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}
