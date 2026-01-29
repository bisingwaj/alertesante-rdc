
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const TIMES = [
    { id: 'TODAY', label: "Aujourd'hui" },
    { id: 'WEEK', label: "Cette semaine" },
    { id: 'MORE', label: "Plus longtemps" }
];
const IMPACTS = [
    { id: 'ONE_PERSON', label: "Juste moi" },
    { id: 'SEVERAL', label: "Plusieurs personnes" }
];

export const StepTime = ({ onNext, onBack }) => {
    const [time, setTime] = useState(null);
    const [impact, setImpact] = useState(null);
    const canContinue = time && impact;

    return (
        <div className="flex flex-col h-full pt-8 px-6">
            <button onClick={onBack} className="mb-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                <ArrowLeft size={24} className="text-white" />
            </button>
            <h2 className="text-2xl font-bold mb-6">Contexte</h2>
            <p className="text-neon-yellow text-xs font-bold uppercase tracking-widest mb-3">Depuis quand ?</p>
            <div className="grid grid-cols-3 gap-2 mb-8">
                {TIMES.map(t => (
                    <button key={t.id} onClick={() => setTime(t.id)} className={`py-3 rounded-xl text-sm font-bold border ${time === t.id ? 'bg-white text-black' : 'bg-dark-800 text-white/60 border-transparent'}`}>
                        {t.label}
                    </button>
                ))}
            </div>
            <p className="text-neon-yellow text-xs font-bold uppercase tracking-widest mb-3">Combien de personnes ?</p>
            <div className="grid grid-cols-2 gap-2 mb-8">
                {IMPACTS.map(i => (
                    <button key={i.id} onClick={() => setImpact(i.id)} className={`py-4 rounded-xl text-sm font-bold border ${impact === i.id ? 'bg-white text-black' : 'bg-dark-800 text-white/60 border-transparent'}`}>
                        {i.label}
                    </button>
                ))}
            </div>
            <button disabled={!canContinue} onClick={() => onNext({ timeSince: time, impact: impact })} className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl mt-auto mb-8 disabled:opacity-20 disabled:cursor-not-allowed">
                Continuer
            </button>
        </div>
    );
};
