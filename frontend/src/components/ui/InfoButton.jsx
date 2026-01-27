
import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const InfoButton = ({ text }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="inline-flex items-center ml-2 relative z-50">
            <button
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                className="text-white/40 hover:text-neon-yellow transition-colors"
            >
                <Info size={16} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[1px]"
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 bottom-full mb-2 w-64 bg-dark-800 border border-white/20 p-4 rounded-xl shadow-xl z-[70] text-left"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-2 right-2 text-white/30 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                            <p className="text-sm text-white/90 leading-relaxed font-normal normal-case">
                                {text}
                            </p>
                            <div className="absolute left-3 -bottom-1.5 w-3 h-3 bg-dark-800 border-r border-b border-white/20 transform rotate-45"></div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
