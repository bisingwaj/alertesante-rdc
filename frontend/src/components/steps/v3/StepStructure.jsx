
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SkipForward, ArrowLeft } from 'lucide-react';

export const StepStructure = ({ onNext, onBack }) => {
    const [query, setQuery] = useState('');

    return (
        <div className="flex flex-col h-full pt-8 px-6">
            <button onClick={onBack} className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <ArrowLeft size={24} className="text-white" />
            </button>
            <h2 className="text-2xl font-bold mb-2">Quelle structure ?</h2>
            <p className="text-white/60 mb-8">Nom de l'hôpital, centre de santé...</p>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-4 text-white/40" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher (ex: Clinique Ngaliema)..."
                    className="w-full h-14 pl-12 pr-4 bg-dark-800 rounded-xl border border-white/10 focus:border-neon-yellow outline-none text-white placeholder-white/20"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>

            {query && (
                <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={() => onNext({ structure: query })}
                    className="w-full py-4 bg-neon-yellow/10 text-neon-yellow font-bold rounded-xl border border-neon-yellow/50 mb-4"
                >
                    Sélectionner "{query}"
                </motion.button>
            )}

            <div className="mt-auto mb-8 space-y-3">
                <button
                    onClick={() => onNext({ structure: 'Non spécifié' })}
                    className="w-full py-4 bg-dark-800 text-white font-medium rounded-xl flex items-center justify-center gap-2"
                >
                    Je ne connais pas le nom
                </button>
                <button
                    onClick={() => onNext({ structure: 'Hors structure' })}
                    className="w-full py-3 text-white/40 text-sm"
                >
                    Ce n'est pas dans une structure
                </button>
            </div>
        </div>
    );
};
