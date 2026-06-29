import { Filter, Building2, Smartphone, ClipboardList } from 'lucide-react';

export type FilterType = 'All' | 'Enterprise' | 'Engineering' | 'Product';

interface FilterTabsProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

const tabs: { label: string; value: FilterType; icon: React.ReactNode; activeClass: string }[] = [
  { label: 'All Projects',       value: 'All',        icon: null,                        activeClass: 'bg-stone-900 text-white shadow-lg' },
  { label: 'Product Management', value: 'Product',    icon: <ClipboardList size={16} />, activeClass: 'bg-violet-600 text-white shadow-lg shadow-violet-200' },
  { label: 'Enterprise',         value: 'Enterprise', icon: <Building2 size={16} />,     activeClass: 'bg-blue-600 text-white shadow-lg shadow-blue-200' },
  { label: 'Engineering',        value: 'Engineering',icon: <Smartphone size={16} />,    activeClass: 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' },
];

const FilterTabs = ({ filter, setFilter }: FilterTabsProps) => {
  return (
    <div className="w-full px-6 lg:px-16 mb-12">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-200 text-stone-500 text-sm font-medium mr-2">
          <Filter size={16} /> Filter by:
        </div>
        {tabs.map(({ label, value, icon, activeClass }) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              filter === value ? activeClass : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;
