import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from './Navbar';

interface DesktopNavProps {
    isHomePage: boolean;
    dropdownLinks: NavItem[];
    directLinks: NavItem[];
    onNavigate: (item: NavItem) => void;
}

const DesktopNav = ({ isHomePage, dropdownLinks, directLinks, onNavigate }: DesktopNavProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="flex items-center gap-6">

            {isHomePage ? (
                <div
                    className="relative"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button
                        className={`flex items-center gap-1 text-sm font-medium transition-colors py-2 ${isHovered ? 'text-emerald-600' : 'text-stone-600'
                            }`}
                    >
                        Home <ChevronDown size={14} className={`transition-transform ${isHovered ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-40"
                            >
                                <div className="bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden flex flex-col p-1">
                                    {dropdownLinks.map((link) => (
                                        <button
                                            key={link.name}
                                            onClick={() => onNavigate(link)}
                                            className="px-4 py-2 text-left text-sm text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors"
                                        >
                                            {link.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <Link to="/" className="text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors">
                    Home
                </Link>
            )}


            <div className="flex items-center gap-6">
                {directLinks.map((link) => (
                    <button
                        key={link.name}
                        onClick={() => onNavigate(link)}
                        className="cursor-pointer text-sm font-medium text-stone-600 hover:text-emerald-600 transition-colors"
                    >
                        {link.name}
                    </button>
                ))}
            </div>

            <Link
                to="/booking"
                className="ml-2 px-6 py-2.5 rounded-full bg-stone-900 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
            >
                Book Consultation
            </Link>
        </div>
    );
};

export default DesktopNav;