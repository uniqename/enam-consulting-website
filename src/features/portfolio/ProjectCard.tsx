import { motion } from 'framer-motion';
import { Link } from 'react-router'; // Ensure react-router-dom
import { ArrowUpRight, Briefcase } from 'lucide-react';
import type { Project } from '../../data/portFolioData';



interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/work/${project.slug}`} className="group block h-full">
        <article className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          
          <div className="relative h-56 bg-stone-100 overflow-hidden">
             <img 
               src={project.image} 
               alt={project.title} 
               className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
             />
             <div className="absolute top-4 left-4">
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                 project.category === 'Enterprise' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
               }`}>
                 {project.category}
               </span>
             </div>
          </div>

          <div className="p-8 flex flex-col grow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {project.title}
              </h3>
              <ArrowUpRight className="text-stone-300 group-hover:text-emerald-600 transition-colors shrink-0" size={24} />
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-stone-500">
              <Briefcase size={14} />
              <span>{project.client}</span>
            </div>
            
            <p className="text-stone-600 leading-relaxed mb-6 grow line-clamp-3">
              {project.summary}
            </p>

            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              <div className="flex gap-2">
                  {project.techStack.slice(0, 2).map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-stone-50 text-stone-500 text-xs font-medium rounded-md border border-stone-100">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 2 && (
                    <span className="px-2 py-1 bg-stone-50 text-stone-400 text-xs font-medium rounded-md">
                      +{project.techStack.length - 2}
                    </span>
                  )}
              </div>
              <span className="text-xs font-bold text-emerald-600 group-hover:underline">
                  View Details
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;