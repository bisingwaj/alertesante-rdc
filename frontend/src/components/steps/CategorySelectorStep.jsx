
import React from 'react';
import { motion } from 'framer-motion';

const CategoryCard = ({ icon, label, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="aspect-square bg-dark-800 rounded-3xl p-4 flex flex-col items-center justify-center gap-3 border border-white/5 hover:border-neon-yellow/50 hover:bg-dark-700 transition-colors shadow-lg"
    >
        <div className="text-5xl">{icon}</div>
        <span className="font-bold text-sm text-center leading-tight">{label}</span>
    </motion.button>
);

export const CategorySelectorStep = ({ onNext }) => {
    const categories = [
        { id: 'RACKET', label: 'Racket / Corruption', icon: '💸' },
        { id: 'NO_MED', label: 'Pas de Médicaments', icon: '💊' },
        { id: 'URGENT', label: 'Urgence Vitale', icon: '🚑' },
        { id: 'OTHER', label: 'Autre Problème', icon: 'ℹ️' },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 mt-8">
            {categories.map((cat, i) => (
                <CategoryCard
                    key={cat.id}
                    {...cat}
                    onClick={() => onNext({ category: cat.id })}
                />
            ))}
        </div>
    );
};
