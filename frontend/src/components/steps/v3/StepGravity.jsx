
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const GRAVITIES = [
    { id: 'NORMAL', label: 'Normal', color: 'bg-green-500' },
    { id: 'GRAVE', label: 'Grave', color: 'bg-orange-500' },
    { id: 'TRES_GRAVE', label: 'Très Grave', color: 'bg-red-600' }
];

export const StepGravity = ({ onNext, onBack }) => (
    <div className="flex flex-col h-full pt-8 px-6">
        <button onClick={onBack} className="mb-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} className="text-white" />
        </button>
        <h2 className="text-2xl font-bold mb-2">Gravité</h2>
        <p className="text-white/60 mb-8">À quel point est-ce urgent ?</p>
        <div className="space-y-4">
            {GRAVITIES.map(g => (
                <button key={g.id} onClick={() => onNext({ gravity: g.id })} className="w-full p-6 bg-dark-800 rounded-2xl flex items-center justify-between border border-white/5 hover:border-white/20">
                    <span className="font-bold text-lg">{g.label}</span>
                    <div className={`w-4 h-4 rounded-full ${g.color}`} />
                </button>
            ))}
        </div>
    </div>
);
