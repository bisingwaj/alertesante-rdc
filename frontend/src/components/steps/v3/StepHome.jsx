import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Lock, AlertCircle, Pill, Stethoscope, Droplets } from 'lucide-react';

export const StepHome = ({ onStart, onUrgent }) => (
    <div className="flex flex-col h-full px-6 py-8 overflow-y-auto">
        {/* HEADER */}
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-3 mb-6"
        >
            <div className="w-20 h-20 mx-auto bg-neon-yellow/10 rounded-full flex items-center justify-center border border-neon-yellow/30">
                <Activity size={40} className="text-neon-yellow" />
            </div>
            <h1 className="text-3xl font-black text-white">Alerte Santé RDC</h1>
            <p className="text-white/60 text-sm font-medium">Plateforme Officielle de Signalement</p>
        </motion.div>

        {/* QUE SIGNALER ? */}
        <div className="bg-dark-800/50 p-5 rounded-2xl border border-white/10 mb-4">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-neon-yellow" />
                Que pouvez-vous signaler ?
            </h3>
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <Stethoscope size={18} className="text-neon-green shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-semibold text-sm">Qualité des soins</p>
                        <p className="text-white/50 text-xs">Mauvais traitement, violence, paiements illégaux</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Pill size={18} className="text-neon-green shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-semibold text-sm">Médicaments</p>
                        <p className="text-white/50 text-xs">Rupture de stock, médicaments expirés ou contrefaits</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Droplets size={18} className="text-neon-green shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-semibold text-sm">Hygiène & Infrastructure</p>
                        <p className="text-white/50 text-xs">Eau non potable, installations vétustes</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Activity size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-white font-semibold text-sm">Alertes sanitaires</p>
                        <p className="text-white/50 text-xs">Épidémies, maladies inhabituelles</p>
                    </div>
                </div>
            </div>
        </div>

        {/* GARANTIES */}
        <div className="bg-dark-800/50 p-5 rounded-2xl border border-white/10 mb-6">
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/90">
                    <ShieldCheck className="text-neon-green shrink-0" size={22} />
                    <div>
                        <p className="font-bold text-sm">Anonyme & Gratuit</p>
                        <p className="text-white/50 text-xs">Vous pouvez signaler sans donner votre nom</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                    <Lock className="text-neon-green shrink-0" size={22} />
                    <div>
                        <p className="font-bold text-sm">100% Sécurisé</p>
                        <p className="text-white/50 text-xs">Vos données sont protégées et confidentielles</p>
                    </div>
                </div>
            </div>
        </div>

        {/* CTA */}
        <div className="mt-auto space-y-4 pb-4">
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
                className="w-full h-16 bg-neon-yellow text-black font-black text-xl rounded-2xl shadow-[0_0_20px_rgba(255,230,0,0.3)]"
            >
                📣 FAIRE UN SIGNALEMENT
            </motion.button>

            <button
                onClick={onUrgent}
                className="text-white/50 text-sm font-bold flex items-center justify-center gap-2 hover:text-neon-red transition-colors py-2"
            >
                <Activity size={16} /> C'est une urgence vitale ?
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
