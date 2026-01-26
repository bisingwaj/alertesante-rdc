
import React from 'react';
import { motion } from 'framer-motion';

export const StepHome = ({ onStart, onUrgent }) => (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-8">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-2"
        >
            <div className="text-6xl mb-4">🇨🇩</div>
            <h1 className="text-3xl font-black text-white">Alerte Santé</h1>
            <p className="text-white/60 text-lg">Ministère de la Santé Publique</p>
        </motion.div>

        <div className="bg-dark-800/50 p-6 rounded-2xl border border-white/10 text-left space-y-3">
            <p className="flex items-center gap-3 text-white/80"><span className="text-neon-green">✅</span> Anonyme & Gratuit</p>
            <p className="flex items-center gap-3 text-white/80"><span className="text-neon-green">✅</span> Sécurisé</p>
            <p className="text-sm text-white/50 mt-2">Signalez tout abus, corruption ou rupture de stock dans les hôpitaux.</p>
        </div>

        <div className="w-full space-y-4">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="w-full h-16 bg-neon-yellow text-black font-black text-xl rounded-2xl shadow-[0_0_20px_rgba(255,230,0,0.3)]"
            >
                COMMENCER
            </motion.button>

            <button
                onClick={onUrgent}
                className="text-white/50 text-sm font-bold flex items-center justify-center gap-2 hover:text-neon-red transition-colors"
            >
                ⚠️ C'est une urgence vitale ?
            </button>
        </div>
    </div>
);

export const StepUrgent = ({ onBack }) => (
    <div className="h-full bg-neon-red text-white p-8 flex flex-col justify-center text-center">
        <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-8xl mb-8"
        >
            🚑
        </motion.div>
        <h1 className="text-4xl font-black mb-6">URGENCE VITALE</h1>
        <p className="text-xl font-medium mb-12">
            Cette plateforme ne gère pas les urgences en temps réel.
            <br /><br />
            <strong>Rendez-vous immédiatement au centre de santé le plus proche.</strong>
        </p>
        <button onClick={onBack} className="w-full h-16 bg-white text-black font-bold rounded-2xl">
            Retour à l'accueil
        </button>
    </div>
);
