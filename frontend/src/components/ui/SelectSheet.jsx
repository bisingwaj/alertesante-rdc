
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronRight } from 'lucide-react';

export const SelectSheet = ({ isOpen, onClose, title, options, onSelect, groups }) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search) return options;
        return options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
    }, [options, search]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-dark-900 rounded-t-3xl z-[101] h-[85vh] flex flex-col border-t border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">{title}</h3>
                            <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10">
                                <X size={20} className="text-white" />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="px-6 py-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-3.5 text-white/30" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full h-12 pl-12 bg-dark-800 rounded-xl border border-white/10 focus:border-neon-yellow outline-none text-white placeholder-white/20"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto px-6 pb-8 space-y-2">
                            {groups ? (
                                // GROUPED RENDER
                                groups.map(group => {
                                    const groupOptions = filtered.filter(o => o.type === group.key);
                                    if (groupOptions.length === 0) return null;

                                    return (
                                        <div key={group.key} className="mb-6">
                                            <h4 className="text-xs font-bold text-white/40 uppercase mb-3 ml-1 tracking-widest sticky top-0 bg-dark-900 py-2 z-10">
                                                {group.label}
                                            </h4>
                                            <div className="space-y-2">
                                                {groupOptions.map((opt, i) => (
                                                    <button
                                                        key={opt.id || i}
                                                        onClick={() => { onSelect(opt); onClose(); setSearch(''); }}
                                                        className="w-full p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/20 flex items-center justify-between group transition-all"
                                                    >
                                                        <span className="font-bold text-white">{opt.label}</span>
                                                        <ChevronRight size={20} className="text-white/30 group-hover:text-neon-yellow" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                // STANDARD RENDER
                                filtered.map((opt, i) => (
                                    <button
                                        key={opt.id || i}
                                        onClick={() => { onSelect(opt); onClose(); setSearch(''); }}
                                        className="w-full p-4 bg-white/5 rounded-xl border border-transparent hover:border-white/20 flex items-center justify-between group transition-all"
                                    >
                                        <span className="font-bold text-white">{opt.label}</span>
                                        <ChevronRight size={20} className="text-white/30 group-hover:text-neon-yellow" />
                                    </button>
                                ))
                            )}

                            {filtered.length === 0 && (
                                <p className="text-center text-white/40 mt-10">Aucun résultat trouvé.</p>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
