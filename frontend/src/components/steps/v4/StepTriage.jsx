
import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Users, Calendar, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { InfoButton } from '../../ui/InfoButton';

export const StepTriage = ({ onNext, onBack }) => {
    const [danger, setDanger] = useState(null); // YES/NO

    const handleDanger = (isDanger) => {
        setDanger(isDanger);
    };

    if (danger === true) {
        return (
            <div className="flex flex-col h-full pt-8 px-6 bg-red-900/20">
                <button onClick={() => setDanger(null)} className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
                    <ArrowLeft size={24} className="text-white" />
                </button>
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <AlertTriangle size={48} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-red-500">DANGER IMMÉDIAT</h2>
                    <p className="text-white/80 text-lg">
                        Si une vie est en danger, n'utilisez pas cette application.
                    </p>

                    <a href="tel:112" className="w-full py-5 bg-red-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 text-xl hover:bg-red-600 transition-colors">
                        <Phone size={24} /> APPELER URGENCES (112)
                    </a>

                    <button
                        onClick={() => onNext({ danger: true, priority: 'HIGH' })}
                        className="text-white/40 underline mt-8"
                    >
                        Continuer le signalement quand même
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full pt-8 px-6">
            <button onClick={onBack} className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
                <ArrowLeft size={24} className="text-white" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Quelques précisions</h2>

            {/* DANGER QUESTION */}
            <div className="mb-8">
                <p className={`mb-3 font-bold flex items-center gap-2 ${danger === null ? 'text-red-400' : 'text-white/60'}`}>
                    <AlertTriangle size={18} className={danger === null ? 'text-red-500' : 'text-neon-red'} />
                    Y a-t-il un danger immédiat ?
                    {danger === null && <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded text-red-400">OBLIGATOIRE</span>}
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleDanger(true)} className="py-4 bg-dark-800 border border-white/10 rounded-xl hover:border-red-500 font-bold text-red-400">OUI</button>
                    <button onClick={() => setDanger(false)} className={`py-4 rounded-xl font-bold border transition-colors ${danger === false ? 'bg-white text-black' : 'bg-dark-800 border-white/10 text-white'}`}>NON</button>
                </div>
            </div>

            {/* OTHER QUESTIONS */}
            {danger === false && (
                <QuestionsPart2 onNext={onNext} />
            )}
        </div>
    );
};

const QuestionsPart2 = ({ onNext }) => {
    const [impact, setImpact] = useState(null);
    const [time, setTime] = useState(null);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
                <p className={`mb-3 font-bold flex items-center gap-1 ${!impact ? 'text-red-400' : 'text-white/60'}`}>
                    <Users size={18} className={!impact ? 'text-red-500' : 'text-blue-400'} />
                    Personnes affectées
                    {!impact && <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded text-red-400">OBLIGATOIRE</span>}
                    <InfoButton text="Ne comptez que les personnes qui subissent directement le problème (ex: patients non soignés, victimes d'extorsion)." />
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setImpact('ONE_PERSON')} className={`py-3 rounded-xl text-sm font-bold border ${impact === 'ONE_PERSON' ? 'bg-neon-green/20 border-neon-green text-neon-green' : 'bg-dark-800 border-white/10'}`}>Juste une personne</button>
                    <button onClick={() => setImpact('SEVERAL')} className={`py-3 rounded-xl text-sm font-bold border ${impact === 'SEVERAL' ? 'bg-neon-green/20 border-neon-green text-neon-green' : 'bg-dark-800 border-white/10'}`}>Plusieurs personnes</button>
                </div>
            </div>

            <div>
                <p className={`mb-3 font-bold flex items-center gap-1 ${!time ? 'text-red-400' : 'text-white/60'}`}>
                    <Calendar size={18} className={!time ? 'text-red-500' : 'text-neon-yellow'} />
                    Date de l'incident
                    {!time && <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded text-red-400">OBLIGATOIRE</span>}
                    <InfoButton text="Si ça arrive tout le temps, choisissez 'Aujourd'hui' ou précisez dans la description." />
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: 'TODAY', label: "Aujourd'hui" },
                        { id: 'WEEK', label: "Cette semaine" },
                        { id: 'MORE', label: "Plus ancien" }
                    ].map(t => (
                        <button key={t.id} onClick={() => setTime(t.id)} className={`py-3 rounded-xl text-xs font-bold border ${time === t.id ? 'bg-white text-black' : 'bg-dark-800 border-white/10 text-white/60'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <button
                disabled={!impact || !time}
                onClick={() => onNext({ danger: false, impact, time })}
                className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl disabled:opacity-50 mt-8 hover:scale-[1.02] transition-transform"
            >
                Continuer
            </button>
        </motion.div>
    );
}
