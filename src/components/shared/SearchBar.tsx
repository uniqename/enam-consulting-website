import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({ query, onQueryChange, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={18} />
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
      />
      {query && (
        <button
          onClick={() => onQueryChange('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
