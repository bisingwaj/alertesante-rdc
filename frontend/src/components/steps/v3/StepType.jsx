
import React from 'react';
import { motion } from 'framer-motion';

const types = [
    { id: 'PLAINTE', icon: '💸', label: 'Plainte / Abus', desc: 'Corruption, mauvais accueil...' },
    { id: 'RUPTURE', icon: '💊', label: 'Médicaments', desc: 'Rupture de stock, kits...' },
    { id: 'ALERTE', icon: '🦠', label: 'Alerte Sanitaire', desc: 'Maladie inconnue, décès...' },
];

export const StepType = ({ onNext }) => (
    <div className="flex flex-col h-full pt-12 px-6">
        <h2 className="text-2xl font-bold mb-2">Quel est le type de problème ?</h2>
        <p className="text-white/60 mb-8">Choisissez une catégorie principale.</p>

        <div className="space-y-4">
            {types.map((t, i) => (
                <motion.button
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNext({ type: t.id })}
                    className="w-full bg-dark-800 p-6 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-neon-yellow/50 transition-colors text-left"
                >
                    <div className="text-4xl">{t.icon}</div>
                    <div>
                        <span className="block font-bold text-lg">{t.label}</span>
                        <span className="text-white/40 text-sm">{t.desc}</span>
                    </div>
                </motion.button>
            ))}
        </div>
    </div>
);
