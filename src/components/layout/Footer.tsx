import { Linkedin, Github, Mail, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleScrollTo = (id: string) => {
    navigate('/');
    setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="w-full mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                D
              </div>
              <span className="font-bold text-lg text-gray-900">
                Doxa<span className="text-emerald-600"> and Co</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Bridging the gap between Enterprise Rigor and Startup Agility. 
              We build production-ready software and optimize GRC platforms for growth.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-50 hover:bg-emerald-50 text-gray-500 hover:text-emerald-600 transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => handleScrollTo('about')} className="text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">About Us</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('portfolio')} className="text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Case Studies</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('services')} className="text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Services</button>
              </li>
              <li>
                <Link to="/booking" className="text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Book Consultation</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Expertise</h3>
            <ul className="space-y-3 text-sm ">
              <li>
                <button onClick={() => handleScrollTo('services')} className="text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Mobile App Development</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('services')} className="text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">GRC Platform Transformation</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('services')} className="text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">MVP Strategy & Build</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('services')} className="text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer">Technical Audits</button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-gray-500">
                <Mail size={18} className="shrink-0 text-emerald-600" />
                <a href="mailto:consulting.enam@gmail.com" className="hover:text-gray-900 transition-colors">
                  consulting.enam@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-500">
                <MapPin size={18} className="shrink-0 text-emerald-600" />
                <span>
                  Columbus, Ohio<br />
                  <span className="text-xs opacity-70">Remote Services Worldwide</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} Doxa and Co LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-gray-900">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-900">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;