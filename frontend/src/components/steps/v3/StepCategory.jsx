
import React from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = {
    'PLAINTE': [
        { id: 'PAYMENT', label: 'Paiement Illégal' },
        { id: 'ABSENCE', label: 'Absence Personnel' },
        { id: 'BAD_TREATMENT', label: 'Mauvais Traitement' },
        { id: 'CORRUPTION', label: 'Corruption' },
        { id: 'SEXUAL_ABUSE', label: 'Abus Sexuel', sensitive: true },
        { id: 'OTHER', label: 'Autre' }
    ],
    'RUPTURE': [
        { id: 'MEDICINE', label: 'Pas de médicaments' },
        { id: 'TESTS', label: 'Pas de tests / réactifs' },
        { id: 'KITS', label: 'Pas de kits (césarienne...)' },
        { id: 'POWER', label: 'Panne Courant / Oxygène' },
        { id: 'SALE', label: 'Vente produits gratuits' }
    ],
    'ALERTE': [
        { id: 'DEATH', label: 'Décès Inhabituel' },
        { id: 'SYMPTOMS', label: 'Symptômes Graves' },
        { id: 'OTHER', label: 'Autre Alerte' }
    ]
};

export const StepCategory = ({ onNext }) => {
    // Simulé (Normalement on lit props.type du contexte)
    // Pour la démo on affiche tout ou défaut
    const list = CATEGORIES['PLAINTE'];

    return (
        <div className="flex flex-col h-full pt-12 px-6">
            <h2 className="text-2xl font-bold mb-2">Précisez le problème</h2>
            <p className="text-white/60 mb-8">Sélectionnez ce qui correspond le mieux.</p>

            <div className="grid grid-cols-1 gap-3 overflow-y-auto pb-8">
                {list.map((c, i) => (
                    <motion.button
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => onNext({ category: c })}
                        className={`p-5 rounded-2xl text-left font-bold text-lg border transition-all ${c.sensitive
                                ? 'bg-red-900/20 border-red-500/30 text-red-200 hover:bg-red-900/40'
                                : 'bg-dark-800 border-white/5 text-white hover:border-neon-yellow/50'
                            }`}
                    >
                        {c.label}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
