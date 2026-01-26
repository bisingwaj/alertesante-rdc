
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Stethoscope, Pill, Siren, Trash2 } from 'lucide-react';

const BRANCHES = [
    {
        id: 'QUALITY',
        label: 'Qualité des Soins',
        desc: 'Mauvais accueil, corruption, violence...',
        icon: <Stethoscope size={32} className="text-blue-400" />,
        color: 'border-blue-500/30 hover:border-blue-500/60'
    },
    {
        id: 'MEDS',
        label: 'Médicaments',
        desc: 'Rupture, prix, qualité douteuse...',
        icon: <Pill size={32} className="text-neon-yellow" />,
        color: 'border-neon-yellow/30 hover:border-neon-yellow/60'
    },
    {
        id: 'ALERT',
        label: 'Alerte Sanitaire',
        desc: 'Épidémie, décès inhabituel...',
        icon: <Siren size={32} className="text-neon-red" />,
        color: 'border-neon-red/30 hover:border-neon-red/60'
    },
    {
        id: 'HYGIENE',
        label: 'Hygiène & Environnement',
        desc: 'Eau, déchets, salubrité...',
        icon: <Trash2 size={32} className="text-green-400" />,
        color: 'border-green-500/30 hover:border-green-500/60'
    }
];

export const StepType = ({ onNext, onBack }) => {
    return (
        <div className="flex flex-col h-full pt-8 px-6">
            <button onClick={onBack} className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <ArrowLeft size={24} className="text-white" />
            </button>

            <h2 className="text-2xl font-bold mb-2">Quel est le problème ?</h2>
            <p className="text-white/60 mb-6">Choisissez la catégorie adaptée.</p>

            <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-8">
                {BRANCHES.map((b, i) => (
                    <motion.button
                        key={b.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onNext({ branch: b.id })}
                        className={`w-full bg-dark-800 p-5 rounded-2xl flex items-center gap-5 border transition-all text-left group ${b.color}`}
                    >
                        <div className="bg-white/5 p-3 rounded-full group-hover:scale-110 transition-transform">{b.icon}</div>
                        <div>
                            <span className="block font-bold text-lg text-white">{b.label}</span>
                            <span className="text-white/40 text-sm">{b.desc}</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
