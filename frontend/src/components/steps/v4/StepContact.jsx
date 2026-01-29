
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
            contactPhone: isAnonymous ? null : phone,
            contactPref: isAnonymous ? null : pref
        });
    };

    // Validation du numéro RDC: +243XXXXXXXXX (9 chiffres minimum)
    const isPhoneValid = () => {
        if (isAnonymous) return true; // Si anonyme, toujours valide
        const phoneRegex = /^\+243\d{9,}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    };

    return (
        <div className="flex flex-col h-full pt-8 px-6">
            <button onClick={onBack} className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white">
                <ArrowLeft size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-2">Contact (Optionnel)</h2>
            <p className="text-white/60 mb-6">Souhaitez-vous être recontacté pour un suivi ?</p>

            {/* ANONYME OUI/NON */}
            <div className="mb-6">
                <p className="text-white/60 mb-3 font-bold flex items-center gap-2">
                    <Shield size={18} className="text-neon-yellow" />
                    Rester anonyme ?
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setIsAnonymous(true)}
                        className={`py-4 rounded-xl font-bold border transition-colors ${isAnonymous
                                ? 'bg-white text-black border-white'
                                : 'bg-dark-800 border-white/10 text-white hover:border-white/30'
                            }`}
                    >
                        OUI (Anonyme)
                    </button>
                    <button
                        onClick={() => setIsAnonymous(false)}
                        className={`py-4 rounded-xl font-bold border transition-colors ${!isAnonymous
                                ? 'bg-neon-green/20 text-neon-green border-neon-green'
                                : 'bg-dark-800 border-white/10 text-white hover:border-white/30'
                            }`}
                    >
                        NON (Laissez contact)
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
                    {/* NUMERO DE TELEPHONE */}
                    <div className="bg-dark-800 p-4 rounded-xl border border-white/10">
                        <label className="text-xs text-white/40 font-bold uppercase mb-2 block flex items-center gap-2">
                            <Phone size={14} />
                            Votre numéro WhatsApp
                        </label>
                        <input
                            type="tel"
                            placeholder="+243 999 123 456"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className={`w-full bg-transparent border-b-2 py-2 text-white outline-none transition-colors ${phone && !isPhoneValid()
                                    ? 'border-red-500 text-red-400'
                                    : 'border-white/20 focus:border-neon-yellow'
                                }`}
                        />
                        {phone && !isPhoneValid() && (
                            <p className="text-red-400 text-xs mt-2">
                                Format: +243 suivi de 9 chiffres minimum
                            </p>
                        )}
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
