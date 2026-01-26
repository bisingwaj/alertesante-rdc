
import React, { useState } from 'react';
import { Shield, Phone } from 'lucide-react';

export const StepContact = ({ onNext }) => {
    const [anonymous, setAnonymous] = useState(true);
    const [phone, setPhone] = useState('');

    return (
        <div className="flex flex-col h-full pt-12 px-6">
            <h2 className="text-2xl font-bold mb-2">Contact</h2>
            <p className="text-white/60 mb-8">Vos données sont protégées.</p>

            <div onClick={() => setAnonymous(!anonymous)} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all mb-6 ${anonymous ? 'border-neon-green bg-neon-green/10' : 'border-white/10 bg-dark-800'}`}>
                <div className="flex items-center gap-4">
                    <Shield size={24} className={anonymous ? 'text-neon-green' : 'text-white/40'} />
                    <div>
                        <span className="block font-bold text-lg">Rester Anonyme</span>
                        <span className="text-xs opacity-70">Mon identité ne sera pas partagée.</span>
                    </div>
                </div>
            </div>

            {!anonymous && (
                <div className="space-y-4">
                    <p className="text-sm text-white/60">Laissez un numéro pour le suivi (confidentiel).</p>
                    <div className="flex items-center bg-dark-800 rounded-xl px-4 border border-white/10 focus-within:border-neon-yellow">
                        <Phone size={20} className="text-white/40" />
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="081 234 56 78"
                            className="w-full h-14 bg-transparent outline-none ml-4 text-white font-mono text-lg"
                        />
                    </div>
                </div>
            )}

            <button onClick={() => onNext({ hasContact: !anonymous, phone, pref: 'WHATSAPP' })} className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl mt-auto mb-8">
                Voir le récapitulatif
            </button>
        </div>
    );
};
