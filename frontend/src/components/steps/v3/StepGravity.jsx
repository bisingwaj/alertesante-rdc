
import React from 'react';

const GRAVITIES = [
    { id: 'NORMAL', label: 'Normal', color: 'bg-green-500' },
    { id: 'GRAVE', label: 'Grave', color: 'bg-orange-500' },
    { id: 'TRES_GRAVE', label: 'Très Grave', color: 'bg-red-600' }
];

export const StepGravity = ({ onNext }) => (
    <div className="flex flex-col h-full pt-12 px-6">
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
