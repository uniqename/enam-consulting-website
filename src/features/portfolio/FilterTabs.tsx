import { Filter, Building2, Smartphone } from 'lucide-react';

interface FilterTabsProps {
  filter: 'All' | 'Enterprise' | 'Engineering';
  setFilter: (filter: 'All' | 'Enterprise' | 'Engineering') => void;
}

const FilterTabs = ({ filter, setFilter }: FilterTabsProps) => {
  return (
    <div className="w-full px-6 lg:px-16 mb-12">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-200 text-stone-500 text-sm font-medium mr-2">
          <Filter size={16} /> Filter by:
        </div>
        
        <button 
          onClick={() => setFilter('All')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
            filter === 'All' ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          All Projects
        </button>
        
        <button 
          onClick={() => setFilter('Enterprise')}
          className={`px-6 py-2 cursor-pointer rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
            filter === 'Enterprise' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Building2 size={16} /> Enterprise
        </button>
        
        <button 
          onClick={() => setFilter('Engineering')}
          className={`px-6 py-2 cursor-pointer rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
            filter === 'Engineering' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Smartphone size={16} /> Engineering
        </button>
      </div>
    </div>
  );
};

export default FilterTabs;