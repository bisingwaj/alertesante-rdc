
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export const StepRecap = ({ data, onNext, onBack }) => {
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        setSending(true);

        const payload = {
            short_id: `WEB-${Math.floor(1000 + Math.random() * 9000)}`,

            // V4 DATA MAPPING
            type: data.branch || 'AUTRE',
            description: data.description || 'Pas de description',

            // Location V4 flatten
            province: data.location?.administrative?.province || data.province, // Fallback V3
            city_or_territory: data.location?.administrative?.child || data.city_or_territory,
            health_zone: data.location?.administrative?.zs || data.health_zone,
            structure_name: data.location?.name || data.structure || 'Non spécifié',

            latitude: data.location?.gps?.latitude || data.gps?.latitude,
            longitude: data.location?.gps?.longitude || data.gps?.longitude,

            // Triage V4
            impact_level: data.impact,
            time_since: data.time || data.timeSince,
            gravity: data.danger ? 'DANGER' : 'NORMAL', // Simple logic for now

            // Metadata
            photo_url: data.photoUrl,
            audio_url: data.audioUrl,

            // JSONB for specific answers
            metadata: data.specifics || {},

            is_anonymous: true, // Default V4
            status: 'NEW'
        };

        console.log("Sending V4:", payload);

        const { error } = await supabase.from('tickets').insert([payload]);

        if (error) {
            console.error('Supabase Error:', error);
            alert("Erreur: " + error.message);
            setSending(false);
        } else {
            setTimeout(() => {
                setSending(false);
                onNext();
            }, 1000);
        }
    };

    const labels = { 'QUALITY': 'Qualité des Soins', 'MEDS': 'Médicaments', 'ALERT': 'Alerte Sanitaire', 'HYGIENE': 'Hygiène' };

    return (
        <div className="flex flex-col h-full justify-between pt-4">
            <button onClick={onBack} className="mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <ArrowLeft size={24} className="text-white" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Vérification ✅</h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
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

                {/* DESCRIPTION */}
                {data.description && (
                    <div className="bg-dark-800 p-4 rounded-2xl border border-white/5">
                        <span className="text-xs text-white/40 uppercase font-bold">Message</span>
                        <p className="text-white italic text-sm">"{data.description}"</p>
                    </div>
                )}
                {/* MEDIA */}
                {(data.photoUrl || data.audioUrl) && (
                    <div className="flex gap-2">
                        {data.photoUrl && <div className="px-3 py-1 bg-white/10 rounded text-xs text-white">📷 Photo incluse</div>}
                        {data.audioUrl && <div className="px-3 py-1 bg-white/10 rounded text-xs text-white">🎤 Audio inclus</div>}
                    </div>
                )}
            </div>

            <div className="pt-4 space-y-3">
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

export const StepSuccess = ({ onHome }) => (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-neon-green rounded-full flex items-center justify-center text-black"
        >
            <Send size={48} />
        </motion.div>

        <div>
            <h1 className="text-3xl font-black text-white">Envoyé !</h1>
            <p className="text-white/60 mt-2">Merci pour votre signalement.</p>
        </div>

        <div className="bg-dark-800 p-4 rounded-xl border border-white/10 w-full max-w-xs">
            <p className="text-xs text-white/40 mb-1">ID TICKET</p>
            <p className="text-2xl font-mono text-neon-yellow font-bold tracking-widest">WEB-8293</p>
        </div>

        <button onClick={onHome} className="mt-8 px-8 py-4 bg-white text-black font-bold rounded-xl">
            Faire un autre signalement
        </button>
    </div>
);
