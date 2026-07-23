import { Mail, Phone } from 'lucide-react';

interface ContactCardProps {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ContactCard({
  name,
  email,
  phone,
  company,
  isSelected = false,
  onClick,
}: ContactCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg transition-all ${
        isSelected
          ? 'bg-stone-900 text-white shadow-md'
          : 'bg-white hover:bg-stone-50 text-stone-900 border border-stone-200'
      }`}
    >
      <div className="font-semibold">{name}</div>
      {company && (
        <div className={`text-xs mt-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
          {company}
        </div>
      )}
      <div className={`text-xs mt-2 flex items-center gap-1 ${isSelected ? 'text-stone-200' : 'text-stone-500'}`}>
        <Mail size={12} />
        <span className="truncate">{email}</span>
      </div>
      {phone && (
        <div className={`text-xs mt-1 flex items-center gap-1 ${isSelected ? 'text-stone-200' : 'text-stone-500'}`}>
          <Phone size={12} />
          <span>{phone}</span>
        </div>
      )}
    </button>
  );
}
