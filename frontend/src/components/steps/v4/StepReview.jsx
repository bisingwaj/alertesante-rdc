
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Loader2, ArrowLeft, Check, Copy } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import confetti from 'canvas-confetti';

export const StepRecap = ({ data, onNext, onBack }) => {
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        setSending(true);

        const payload = {
            shortId: `WEB-${Math.floor(1000 + Math.random() * 9000)}`,
            type: data.branch || 'AUTRE',
            description: data.description || 'Pas de description',

            // Location
            province: data.location?.administrative?.province || data.province,
            cityOrTerritory: data.location?.administrative?.child || data.city_or_territory,
            healthZone: data.location?.administrative?.zs || data.health_zone,
            structureName: data.location?.name || data.structure || 'Non spécifié',

            // Triage
            impactLevel: data.impact,
            timeSince: data.time || data.timeSince,
            gravity: data.danger ? 'DANGER' : 'NORMAL',

            // Media
            photoUrl: data.photoUrl,
            audioUrl: data.audioUrl,

            // Metadata (include GPS here)
            metadata: {
                ...(data.specifics || {}),
                latitude: data.location?.gps?.latitude,
                longitude: data.location?.gps?.longitude
            },

            isAnonymous: true,
            status: 'NOUVEAU', // Enum matches
            channel: 'WEB_MOBILE'
        };

        const { error } = await supabase.from('tickets').insert([payload]);

        if (error) {
            console.error('Supabase Error Full:', JSON.stringify(error, null, 2));
            alert("Erreur Envoi: " + (error.message || error.details || JSON.stringify(error)));
            setSending(false);
        } else {
            // Success Animation Trigger
            setSending(false);
            onNext(payload.short_id); // Pass ID to success screen
        }
    };

    const labels = { 'QUALITY': 'Qualité des Soins', 'MEDS': 'Médicaments', 'ALERT': 'Alerte Sanitaire', 'HYGIENE': 'Hygiène' };

    return (
        <div className="flex flex-col h-full justify-between pt-4 px-2">
            <button onClick={onBack} className="mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <ArrowLeft size={24} className="text-white" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Vérification ✅</h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                {/* HEADER */}
                <div className="bg-dark-800 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs text-white/40 uppercase font-bold">Signalement</span>
                    <p className="text-xl font-bold text-white">{labels[data.branch] || data.branch}</p>
                    <div className="flex gap-2 mt-2">
                        {data.danger && <span className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded font-bold">DANGER</span>}
                        {data.impact === 'MANY' && <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-bold">PLUSIEURS PERS.</span>}
                    </div>
                </div>

                {/* LOCATION */}
                <div className="bg-dark-800 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs text-white/40 uppercase font-bold">Lieu</span>
                    <p className="text-white font-bold">{data.location?.name || 'Lieu non précisé'}</p>
                    <p className="text-white/60 text-sm">{data.location?.administrative?.province} • {data.location?.administrative?.child}</p>
                    {data.location?.gps && <p className="text-neon-green text-xs mt-1 flex items-center gap-1"><MapPin size={12} /> GPS Inclus</p>}
                </div>

                {/* SPECIFICS ANSWERS */}
                {data.specifics && (
                    <div className="bg-dark-800 p-4 rounded-2xl border border-white/5 space-y-3">
                        <span className="text-xs text-white/40 uppercase font-bold">Détails</span>
                        {Object.entries(data.specifics).map(([key, val]) => (
                            <div key={key}>
                                <p className="text-white text-sm">
                                    {Array.isArray(val) ? val.join(', ') : val}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {data.description && (
                    <div className="bg-dark-800 p-4 rounded-2xl border border-white/5">
                        <span className="text-xs text-white/40 uppercase font-bold">Message</span>
                        <p className="text-white italic text-sm">"{data.description}"</p>
                    </div>
                )}
            </div>

            <div className="pt-4 space-y-3 pb-8">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={sending}
                    className="w-full h-16 bg-neon-green text-black font-black text-xl rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(52,199,89,0.3)] disabled:opacity-50"
                >
                    {sending ? <Loader2 className="animate-spin" /> : <><Send size={24} /> ENVOYER</>}
                </motion.button>

                <button onClick={onBack} disabled={sending} className="w-full py-3 text-white/50 font-bold">
                    Modifier
                </button>
            </div>
        </div>
    );
};

export const StepSuccess = ({ onHome, ticketId }) => {
    useEffect(() => {
        // Confetti Burst
        confetti({
            origin: { y: 0.7 },
            colors: ['#34C759', '#FFE600', '#FFFFFF'],
            spread: 80,
            particleCount: 100
        });
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">

            {/* Snapchat-style Success Circle */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-32 h-32 bg-neon-green rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(52,199,89,0.6)]"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    <Check size={64} className="text-black stroke-[4]" />
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
            >
                <h1 className="text-4xl font-black text-white tracking-tight">Envoyé !</h1>
                <p className="text-white/60 text-lg">Votre signalement a bien été reçu.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 p-6 rounded-2xl border border-white/10 w-full max-w-xs backdrop-blur-sm"
            >
                <p className="text-xs text-white/40 mb-2 uppercase tracking-widest font-bold">Numéro de Suivi</p>
                <div className="flex items-center justify-center gap-3">
                    <p className="text-3xl font-mono text-neon-yellow font-bold tracking-wider">{ticketId || 'WEB-XXXX'}</p>
                    <button onClick={() => navigator.clipboard.writeText(ticketId)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Copy size={16} className="text-white/40" />
                    </button>
                </div>
                <p className="text-xs text-white/30 mt-4">Gardez ce numéro pour suivre votre dossier.</p>
            </motion.div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                onClick={onHome}
                className="absolute bottom-8 w-full py-4 text-white font-bold hover:text-neon-green transition-colors"
            >
                Retour à l'accueil
            </motion.button>
        </div>
    );
};
