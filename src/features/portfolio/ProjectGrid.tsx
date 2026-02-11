import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import { allProjects } from '../../data/portFolioData';

interface ProjectGridProps {
    filter: 'All' | 'Enterprise' | 'Engineering';
}

const ProjectGrid = ({ filter }: ProjectGridProps) => {
    const filteredProjects = allProjects.filter(project => {
        if (filter === 'All') return true;
        return project.category === filter;
    });

    return (
        <div className="w-full px-6 lg:px-16">
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ProjectGrid;