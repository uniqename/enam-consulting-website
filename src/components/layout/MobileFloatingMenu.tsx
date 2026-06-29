import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, ArrowUpRight } from 'lucide-react';
import type { NavItem } from './Navbar';

interface MobileMenuProps {
    navLinks: NavItem[];
    onNavigate: (item: NavItem) => void;
}

const MobileFloatingMenu = ({ navLinks, onNavigate }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleNavigate = (item: NavItem) => {
        onNavigate(item);
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto flex flex-col items-end">

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9, originX: 1, originY: 1 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="mb-4 bg-white/90 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-2xl p-2 min-w-[200px]"
                        >
                            <div className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.name}
                                        onClick={() => handleNavigate(link)}
                                        className="px-4 py-3 text-right text-sm font-medium text-stone-700 active:bg-emerald-50 active:text-emerald-700 rounded-xl transition-colors flex items-center justify-end gap-2"
                                    >
                                        {link.name}
                                        {link.type === 'route' && <ArrowUpRight size={14} className="opacity-50" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    onClick={() => setIsOpen(!isOpen)}
                    className="group flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full shadow-xl shadow-stone-900/30 active:scale-95 transition-transform"
                >
                    {isOpen ? (
                        <>
                            <span className="text-sm font-bold">Close</span>
                            <X size={16} />
                        </>
                    ) : (
                        <>
                            <span className="text-sm font-bold">Menu</span>
                            <Layers size={16} className="text-emerald-400" />
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default MobileFloatingMenu;