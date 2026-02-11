import { motion } from 'framer-motion';
import { Award, CheckCircle2 } from 'lucide-react';
import { certifications, competencies, educationData } from '../../data/data';
import DegreeCard from './DegreeCard';
import CompetencyColumn from './CompetencyColumn';


const Education = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 w-full">
      
      <div className="w-full px-6 lg:px-16 mb-20">
        <div className="max-w-4xl">
          <h1 className="text-5xl lg:text-6xl font-bold text-stone-900 mb-6">
            Qualifications
          </h1>
          <p className="text-xl text-stone-600 leading-relaxed max-w-2xl">
            A foundation in <span className="text-emerald-600 font-semibold">Data Science</span> backed by industry-standard certifications in Project Management and Agile methodologies.
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-16 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educationData.map((edu, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <DegreeCard {...edu} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="text-2xl font-bold text-stone-900 mb-8 flex items-center gap-3">
              Certifications
            </h2>
            <div className="bg-stone-900 text-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Award className="text-emerald-400" size={32} />
                </div>
                <div>
                  <p className="text-stone-400 text-xs uppercase tracking-widest font-bold">Verified Credentials</p>
                  <p className="text-white font-bold text-lg">Professional Training</p>
                </div>
              </div>
              
              <ul className="space-y-6">
                {certifications.map((cert, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    className="flex gap-4 items-start"
                  >
                    <CheckCircle2 className="text-emerald-500 mt-1 shrink-0" size={20} />
                    <span className="text-stone-200 font-medium leading-relaxed">{cert}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="w-full px-6 lg:px-16">
        <div className="mb-12 border-t border-stone-100 pt-16">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">Core Competencies</h2>
          <p className="text-stone-500">A comprehensive breakdown of technical and leadership skills.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {competencies.map((comp, idx) => (
            <motion.div
              key={comp.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <CompetencyColumn {...comp} />
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Education;