import type { LucideIcon } from "lucide-react";

interface CompetencyProps {
  title: string;
  icon: LucideIcon;
  skills: string[];
}

const CompetencyColumn = ({ title, icon: Icon, skills }: CompetencyProps) => {
  return (
    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-100">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
        <Icon className="text-emerald-600" size={24} />
        <h3 className="font-bold text-stone-900 text-lg leading-tight">{title}</h3>
      </div>
      <ul className="space-y-3">
        {skills.map((skill, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-stone-600">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="leading-relaxed">{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompetencyColumn;