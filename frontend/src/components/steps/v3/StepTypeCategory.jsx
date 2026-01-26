
import React from 'react';
import { ShieldAlert, Pill, Siren } from 'lucide-react';

// --- HOME ---
export const StepHome = ({ onStart }) => (
    <div className="flex flex-col h-full justify-center items-center text-center gap-8">
        <div className="w-24 h-24 bg-neon-yellow rounded-full flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(255,230,0,0.4)]">
            <span className="text-4xl">🇨🇩</span>
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter">ALERTE<br />SANTÉ</h1>
        <p className="text-white/70 max-w-xs text-lg">
            Signalez un problème, un abus ou une rupture de médicaments en toute sécurité.
        </p>
        <div className="w-full space-y-3 mt-8">
            <button onClick={onStart} className="w-full py-4 bg-neon-yellow text-black font-black text-xl rounded-full shadow-lg active:scale-95 transition-transform">
                COMMENCER UN SIGNALEMENT
            </button>
            <button className="w-full py-4 bg-neon-red/20 text-neon-red border border-neon-red font-bold text-lg rounded-full active:scale-95 transition-transform">
                URGENCE VITALE 🚑
            </button>
        </div>
        <p className="text-xs text-white/30 uppercase tracking-widest mt-8">Ministère de la Santé Publique</p>
    </div>
);

// --- TYPE ---
const Card = ({ icon: Icon, title, onClick, color = "text-white" }) => (
    <button onClick={onClick} className="w-full bg-dark-800 p-6 rounded-3xl flex items-center gap-4 text-left border border-white/5 hover:bg-dark-700 active:scale-95 transition-all">
        <div className={`p-4 rounded-2xl bg-dark-900 ${color}`}><Icon size={32} /></div>
        <span className="text-xl font-bold flex-1">{title}</span>
    </button>
);

export const StepType = ({ onNext }) => (
    <div className="flex flex-col gap-4 mt-4">
        <Card icon={ShieldAlert} title="Plainte / Abus" color="text-orange-400" onClick={() => onNext({ type: 'PLAINTE' })} />
        <Card icon={Pill} title="Médicaments / Rupture" color="text-blue-400" onClick={() => onNext({ type: 'RUPTURE' })} />
        <Card icon={Siren} title="Alerte Sanitaire" color="text-neon-red" onClick={() => onNext({ type: 'ALERTE' })} />
    </div>
);

// --- CATEGORY ---
export const StepCategory = ({ type, onNext }) => {
    const options = {
        'PLAINTE': ['Paiement illégal', 'Détention patient', 'Absence personnel', 'Mauvais traitement', 'Corruption', 'Abus sexuel'],
        'RUPTURE': ['Pas de médicaments', 'Pas de tests/réactifs', 'Panne oxygène', 'Kits payants', 'Vente illégale'],
        'ALERTE': ['Décès inhabituel', 'Symptômes groupés', 'Épidémie suspectée', 'Autre urgence']
    };

    const list = options[type] || ['Autre'];

    return (
        <div className="flex flex-col gap-3 mt-4 overflow-y-auto pb-4">
            {list.map(cat => (
                <button key={cat} onClick={() => onNext({ category: cat })} className="w-full p-4 bg-dark-800 rounded-xl text-left font-semibold text-lg hover:bg-neon-yellow hover:text-black transition-colors">
                    {cat}
                </button>
            ))}
        </div>
    );
};
