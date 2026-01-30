
import React, { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, Shield, PhoneCall, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const StepContact = ({ onNext, onBack }) => {
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [phone, setPhone] = useState('');
    const [pref, setPref] = useState('WHATSAPP');

    const handleNext = () => {
        onNext({
            isAnonymous,
            contactPhone: isAnonymous ? null : `+243${phone.replace(/\s/g, '')}`, // Ajouter +243
            contactPref: isAnonymous ? null : pref
        });
    };

    // Validation du numéro RDC: 9 chiffres minimum (sans +243)
    const isPhoneValid = () => {
        if (isAnonymous) return true; // Si pas de contact, toujours valide
        const cleaned = phone.replace(/\s/g, ''); // Enlever espaces
        return cleaned.length >= 9 && /^\d+$/.test(cleaned);
    };

    return (
        <div className="flex flex-col h-full pt-8 px-6">
            <button onClick={onBack} className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white">
                <ArrowLeft size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-2">Contact</h2>
            <p className="text-white/60 mb-6">Souhaitez-vous qu'on vous recontacte pour le suivi de votre signalement ?</p>

            {/* CONTACT OUI/NON */}
            <div className="mb-6">
                <p className="text-white/60 mb-3 font-bold flex items-center gap-2">
                    <Phone size={18} className="text-neon-green" />
                    Être recontacté ?
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setIsAnonymous(false)}
                        className={`py-4 rounded-xl font-bold border transition-colors ${!isAnonymous
                            ? 'bg-neon-green/20 text-neon-green border-neon-green'
                            : 'bg-dark-800 border-white/10 text-white hover:border-white/30'
                            }`}
                    >
                        💚 OUI
                    </button>
                    <button
                        onClick={() => setIsAnonymous(true)}
                        className={`py-4 rounded-xl font-bold border transition-colors ${isAnonymous
                            ? 'bg-white/10 text-white border-white/20'
                            : 'bg-dark-800 border-white/10 text-white hover:border-white/30'
                            }`}
                    >
                        Non merci
                    </button>
                </div>
            </div>

            {/* SI PAS ANONYME - MONTRER CHAMPS */}
            {!isAnonymous && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 mb-6"
                >
                    {/* NUMERO DE TELEPHONE AVEC +243 FIXE */}
                    <div className="bg-dark-800 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-white/40 font-bold uppercase mb-2 block flex items-center gap-2">
                            <Phone size={14} />
                            Votre numéro WhatsApp
                        </label>
                        <div className="flex items-center gap-2">
                            {/* Indicatif RDC fixe */}
                            <div className="bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                                <span className="text-neon-green font-mono font-bold text-lg">+243</span>
                            </div>
                            {/* Input 9 chiffres */}
                            <input
                                type="tel"
                                placeholder="999 123 456"
                                maxLength="11"
                                value={phone}
                                onChange={e => {
                                    // Autoriser seulement les chiffres et espaces
                                    const cleaned = e.target.value.replace(/[^0-9 ]/g, '');
                                    setPhone(cleaned);
                                }}
                                className={`flex-1 bg-transparent border-b-2 py-2 text-white font-mono text-lg outline-none transition-colors ${phone && !isPhoneValid()
                                    ? 'border-red-500 text-red-400'
                                    : 'border-white/20 focus:border-neon-yellow'
                                    }`}
                            />
                        </div>
                        {phone && !isPhoneValid() && (
                            <p className="text-red-400 text-xs mt-2">
                                ⚠️ Veuillez entrer 9 chiffres (ex: 999 123 456)
                            </p>
                        )}
                        <p className="text-white/30 text-xs mt-2">Format: 9 chiffres après +243</p>
                    </div>

                    {/* PREFERENCE DE CONTACT */}
                    <div>
                        <p className="text-xs text-white/40 font-bold uppercase mb-3">Comment vous contacter ?</p>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageCircle },
                                { id: 'CALL', label: 'Appel', icon: PhoneCall },
                                { id: 'SMS', label: 'SMS', icon: MessageSquare }
                            ].map(opt => {
                                const Icon = opt.icon;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => setPref(opt.id)}
                                        className={`py-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${pref === opt.id
                                            ? 'bg-neon-green/20 border-neon-green text-neon-green'
                                            : 'bg-dark-800 border-white/10 text-white/60 hover:border-white/30'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* MESSAGE CONFIDENTIALITE */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                        <p className="text-blue-400 text-xs flex items-start gap-2">
                            <Shield size={14} className="flex-shrink-0 mt-0.5" />
                            <span>
                                Votre numéro est <strong>strictement confidentiel</strong> et ne servira qu'au suivi de votre signalement.
                            </span>
                        </p>
                    </div>
                </motion.div>
            )}

            <button
                onClick={handleNext}
                disabled={!isAnonymous && (!phone || !isPhoneValid())}
                className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl mt-auto mb-8 disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30 hover:scale-[1.02] transition-all"
            >
                Continuer
            </button>
        </div>
    );
};
