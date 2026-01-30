import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, TrendingUp, Shield } from 'lucide-react';

export const StepHome = ({ onStart, onUrgent }) => {
    // Compteur animé - incrémente toutes les 70-90 secondes
    const [reportsToday, setReportsToday] = useState(147); // Nombre de base (fictif)

    useEffect(() => {
        const interval = setInterval(() => {
            // Incrément aléatoire entre 70 et 90 secondes
            const randomDelay = 70000 + Math.random() * 20000;

            setTimeout(() => {
                setReportsToday(prev => prev + 1);
            }, randomDelay);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-full px-5 py-6 overflow-y-auto">
            {/* HEADER COMPACT */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
            >
                <div className="w-16 h-16 mx-auto bg-neon-yellow/10 rounded-full flex items-center justify-center border border-neon-yellow/30 mb-3">
                    <Activity size={32} className="text-neon-yellow" />
                </div>
                <h1 className="text-2xl font-black text-white mb-1">Alerte Santé RDC</h1>
                <p className="text-white/40 text-xs uppercase tracking-wider font-bold">Plateforme Citoyenne</p>
            </motion.div>

            {/* IMPACT STATS - COMPTEUR LIVE */}
            <div className="bg-gradient-to-r from-neon-green/10 to-neon-yellow/10 p-4 rounded-2xl border border-neon-green/20 mb-5">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-white/60 text-xs mb-1 font-semibold uppercase">Aujourd'hui</p>
                        <div className="flex items-baseline gap-2">
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={reportsToday}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-3xl font-black text-neon-green font-mono"
                                >
                                    {reportsToday}
                                </motion.span>
                            </AnimatePresence>
                            <span className="text-white/60 text-sm font-semibold">signalements</span>
                        </div>
                    </div>
                    <div className="w-10 h-10 bg-neon-green/20 rounded-full flex items-center justify-center">
                        <TrendingUp size={20} className="text-neon-green" />
                    </div>
                </div>
                <p className="text-white/40 text-xs mt-2 italic flex items-center gap-1">
                    <Users size={12} />
                    Votre voix contribue à améliorer la santé en RDC
                </p>
            </div>

            {/* QUICK INFO - GRID 2 COLONNES */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-dark-800/50 p-4 rounded-xl border border-white/10">
                    <Shield size={18} className="text-neon-green mb-2" />
                    <p className="text-white font-bold text-sm">Anonyme</p>
                    <p className="text-white/40 text-xs mt-1">100% confidentiel</p>
                </div>
                <div className="bg-dark-800/50 p-4 rounded-xl border border-white/10">
                    <Activity size={18} className="text-neon-yellow mb-2" />
                    <p className="text-white font-bold text-sm">Gratuit</p>
                    <p className="text-white/40 text-xs mt-1">Service public</p>
                </div>
            </div>

            {/* QUE SIGNALER - VERSION CONDENSÉE */}
            <div className="bg-dark-800/30 p-4 rounded-xl border border-white/10 mb-5">
                <h3 className="text-white/80 font-bold text-sm mb-3 uppercase tracking-wide">Exemples de signalements</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                        <span className="text-white/60">Paiements illégaux</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                        <span className="text-white/60">Rupture médicale</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                        <span className="text-white/60">Mauvais traitement</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-green rounded-full"></div>
                        <span className="text-white/60">Hygiène douteuse</span>
                    </div>
                </div>
            </div>

            {/* MESSAGE IMPACT */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-6">
                <p className="text-blue-300 text-xs text-center leading-relaxed">
                    💡 <strong>Chaque signalement compte.</strong> Vous participez activement à l'amélioration du système de santé congolais.
                </p>
            </div>

            {/* CTA */}
            <div className="mt-auto space-y-3 pb-4">
                <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onStart}
                    className="w-full h-14 bg-neon-yellow text-black font-black text-lg rounded-xl shadow-[0_0_20px_rgba(255,230,0,0.3)] flex items-center justify-center gap-2"
                >
                    📣 SIGNALER MAINTENANT
                </motion.button>

                <button
                    onClick={onUrgent}
                    className="w-full text-red-400/80 text-xs font-bold flex items-center justify-center gap-2 hover:text-red-400 transition-colors py-2"
                >
                    <Activity size={14} /> Urgence vitale ? Allez à l'hôpital
                </button>
            </div>
        </div>
    );
};

export const StepUrgent = ({ onBack }) => (
    <div className="h-full bg-neon-red text-white p-8 flex flex-col justify-center text-center">
        <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mx-auto mb-8 bg-white/10 w-32 h-32 rounded-full flex items-center justify-center"
        >
            <Activity size={64} color="white" />
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
