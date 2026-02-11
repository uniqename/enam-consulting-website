import { GraduationCap, MapPin, Calendar } from 'lucide-react';

interface DegreeProps {
  degree: string;
  school: string;
  location: string;
  year: string;
}

const DegreeCard = ({ degree, school, location, year }: DegreeProps) => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
        <GraduationCap size={24} />
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2">{degree}</h3>
      <p className="text-emerald-700 font-medium mb-4">{school}</p>
      
      <div className="mt-auto flex flex-col gap-2 text-sm text-stone-500">
        <div className="flex items-center gap-2">
          <MapPin size={14} /> <span>{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} /> <span>{year}</span>
        </div>
      </div>
    </div>
  );
};

export default DegreeCard;