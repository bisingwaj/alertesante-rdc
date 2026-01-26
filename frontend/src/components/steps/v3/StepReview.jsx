
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export const StepRecap = ({ data, onNext, onBack }) => {
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        setSending(true);

        // Calcul Gravité locale (si pas fait avant)
        let gravity = 'NORMAL';
        if (data.impact === 'MANY' || data.type === 'ALERTE_SANITAIRE') gravity = 'GRAVE';

        const payload = {
            short_id: `WEB-${Math.floor(1000 + Math.random() * 9000)}`,
            type: data.type || 'AUTRE',
            category: data.category?.id || 'AUTRE',

            province: data.province,
            city_or_territory: data.child,
            health_zone: data.zs,
            structure_name: data.structure,

            description: data.description,
            photo_url: data.photoUrl, // NOUVEAU
            audio_url: data.audioUrl, // NOUVEAU
            latitude: data.gps?.latitude, // NOUVEAU
            longitude: data.gps?.longitude, // NOUVEAU

            impact_level: data.impact,
            time_since: data.timeSince,
            gravity: gravity,

            is_anonymous: !data.hasContact,
            contact_phone: data.phone,
            contact_pref: data.pref
        };

        console.log("Sending to Supabase:", payload);

        const { error } = await supabase.from('tickets').insert([payload]);

        if (error) {
            console.error('Supabase Error:', error);
            alert("Erreur d'envoi: " + error.message);
            setSending(false);
        } else {
            setTimeout(() => {
                setSending(false);
                onNext(); // Go to success
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col h-full justify-between pt-4">
            <button onClick={onBack} className="mb-2 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <ArrowLeft size={24} className="text-white" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Vérification ✅</h2>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="bg-dark-800 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs text-white/40 uppercase font-bold">Problème</span>
                    <p className="text-lg font-bold text-white">{data.category?.label || data.category}</p>
                    <span className="text-neon-yellow text-sm">{data.type}</span>
                </div>

                <div className="bg-dark-800 p-4 rounded-2xl border border-white/5">
                    <span className="text-xs text-white/40 uppercase font-bold">Lieu</span>
                    <p className="text-white flex items-center gap-2"><MapPin size={16} /> {data.province}</p>
                    <p className="text-white/60 text-sm ml-6">{data.child} • {data.zs}</p>
                    {data.structure && <p className="text-neon-yellow text-sm ml-6 mt-1">🏥 {data.structure}</p>}
                </div>

                {data.description && (
                    <div className="bg-dark-800 p-4 rounded-2xl border border-white/5">
                        <span className="text-xs text-white/40 uppercase font-bold">Message</span>
                        <p className="text-white italic">"{data.description}"</p>
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
