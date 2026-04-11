import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import DesktopNav from './DesktopNav';
import MobileFloatingMenu from './MobileFloatingMenu';

export interface NavItem {
  name: string;
  target: string;
  type: 'scroll' | 'route';
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dropdownLinks: NavItem[] = [
    { name: 'About', target: 'about', type: 'scroll' },
    { name: 'Services', target: 'services', type: 'scroll' },
    { name: 'Projects', target: 'portfolio', type: 'scroll' },
  ];

  const directLinks: NavItem[] = [
    { name: 'Projects', target: '/projects', type: 'route' },
    { name: 'Education', target: '/education', type: 'route' },
    { name: 'For Employers', target: '/hire', type: 'route' },
  ];

  const mobileLinks = [...dropdownLinks, ...directLinks];

  const handleNavigation = (item: NavItem) => {
    if (item.type === 'route') {
      navigate(item.target);
    } else {
      if (!isHomePage) {
        navigate('/', { state: { scrollTo: item.target } });
        setTimeout(() => scrollToElement(item.target), 100);
      } else {
        scrollToElement(item.target);
      }
    }
  };

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-100 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="w-full mx-auto px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/assets/images/doxa-logo-horizontal.svg"
              alt="Doxa & Co"
              className="h-9 w-auto"
            />
          </Link>

          <div className="hidden md:block">
            <DesktopNav 
                isHomePage={isHomePage} 
                dropdownLinks={dropdownLinks} 
                directLinks={directLinks}
                onNavigate={handleNavigation} 
            />
          </div>

          <div className="md:hidden">
             <Link
              to="/booking"
              className="px-4 py-2 rounded-full bg-stone-900 text-white text-xs font-semibold shadow-md"
            >
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu receives ALL links */}
      <MobileFloatingMenu 
          navLinks={mobileLinks} 
          onNavigate={handleNavigation} 
      />
    </>
  );
};

export default Navbar;