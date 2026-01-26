
import React, { useState } from 'react';
import { Send, MapPin, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ReviewStep = ({ data, onSubmit }) => {
    const [sending, setSending] = useState(false);

    const handleSubmit = async () => {
        setSending(true);
        // Simulation appel API
        try {
            const response = await fetch('http://localhost:3000/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: data.category,
                    // On passe les champs RDC
                    description: `Lieu: ${data.province}, ${data.city}, ${data.commune}`,
                    hasContact: false
                })
            });
            if (response.ok) {
                alert('Envoyé !');
            }
        } catch (e) { console.error(e); }
        setTimeout(() => {
            setSending(false);
            onSubmit();
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full justify-between pt-8">

            <div className="space-y-6">
                {/* Ticket Card */}
                <div className="bg-white text-black rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-yellow rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl">
                            {data.category === 'RACKET' ? '💸' : '🚨'}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg leading-none">{data.category}</h3>
                            <span className="text-black/50 text-xs font-mono">ID: EN COURS...</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <MapPin size={20} className="text-black/40 mt-1" />
                            <div>
                                <p className="font-bold text-sm">{data.city}, {data.commune}</p>
                                <p className="text-xs text-black/50">{data.province}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-white/40 text-sm px-8">
                    En envoyant ce signalement, vous certifiez l'exactitude des informations.
                </p>
            </div>

            <motion.button
                onClick={handleSubmit}
                whileTap={{ scale: 0.95 }}
                disabled={sending}
                className="w-full bg-neon-yellow text-black font-bold text-xl h-16 rounded-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,230,0,0.3)] mb-8 disabled:opacity-50"
            >
                {sending ? 'Envoi...' : (
                    <>Envoyer l'Alerte <Send size={24} /></>
                )}
            </motion.button>
        </div>
    );
};
