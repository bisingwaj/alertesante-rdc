
import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Square } from 'lucide-react';

const FORMS = {
    QUALITY: {
        title: "Détails de la plainte",
        questions: [
            { id: 'q_type', label: "De quoi s'agit-il ?", type: 'choice', options: ['Paiement Illégal', 'Violence / Mauvais Accueil', 'Refus de soins', 'Négligence', 'Erreur médicale', 'Autre'] },
            { id: 'q_who', label: "Qui est la victime ?", type: 'choice', options: ['Moi-même', 'Un enfant', 'Une femme enceinte', 'Un adulte', 'Personne âgée'] },
            { id: 'q_structure_type', label: "Type d'établissement", type: 'choice', options: ['Hôpital Public', 'Centre de Santé', 'Clinique Privée', 'Laboratoire', 'Pharmacie', 'Autre'] },
            { id: 'q_expect', label: "Qu'attendez-vous ?", type: 'multi', options: ['Remboursement', 'Sanction', 'Amélioration service', 'Explications'] }
        ]
    },
    MEDS: {
        title: "Problème Médicament",
        questions: [
            { id: 'm_type', label: "Le problème est :", type: 'choice', options: ['Rupture de stock', 'Prix trop élevé', 'Qualité douteuse (couleur/aspect)', 'Médicament périmé', 'Inefficacité', 'Effet secondaire grave'] },
            { id: 'm_product', label: "Nom du produit (si connu)", type: 'text', placeholder: "Ex: Paracétamol, Amoxicilline..." },
            { id: 'm_source', label: "Obtenu où ?", type: 'choice', options: ['Pharmacie Hôpital', 'Pharmacie Privée', 'Marché / Rue', 'Donation'] }
        ]
    },
    ALERT: {
        title: "Alerte Sanitaire",
        questions: [
            { id: 'a_signal', label: "Quel est le signal ?", type: 'choice', options: ['Décès inhabituel(s)', 'Plusieurs malades (mêmes symptômes)', 'Maladie inconnue', 'Rumeur étrange', 'Maladie animale'] },
            { id: 'a_symptoms', label: "Symptômes principaux", type: 'multi', options: ['Fièvre', 'Diarrhée', 'Vomissements', 'Saignements', 'Toux', 'Éruption cutanée', 'Jaunisse'] },
            { id: 'a_informed', label: "Un agent de santé a vu les malades ?", type: 'choice', options: ['Oui', 'Non', 'Je ne sais pas'] }
        ]
    },
    HYGIENE: {
        title: "Hygiène & Environnement",
        questions: [
            { id: 'h_type', label: "Problème observé", type: 'choice', options: ['Déchets / Dépotoir sauvage', 'Eau sale / Puits contaminé', 'Égouts à ciel ouvert', 'Toilettes insalubres', 'Nuisibles (Rats, moustiques...)'] },
            { id: 'h_impact', label: "Impact immédiat", type: 'multi', options: ['Odeurs fortes', 'Risque de blessure', 'Eau imbuvable', 'Enfants jouent à proximité'] },
            { id: 'h_freq', label: "C'est la première fois ?", type: 'choice', options: ['C\'est nouveau', 'C\'est récurrent', 'C\'est permanent'] }
        ]
    }
};

export const StepSpecifics = ({ branch, onNext, onBack }) => {
    const config = FORMS[branch] || FORMS['QUALITY'];
    const [answers, setAnswers] = useState({});

    const handleChange = (qid, val, type) => {
        if (type === 'multi') {
            const current = answers[qid] || [];
            if (current.includes(val)) setAnswers({ ...answers, [qid]: current.filter(x => x !== val) });
            else setAnswers({ ...answers, [qid]: [...current, val] });
        } else {
            setAnswers({ ...answers, [qid]: val });
        }
    };

    const isComplete = config.questions.every(q => {
        if (q.type === 'text') return true; // Optional text
        if (q.type === 'multi') return (answers[q.id] || []).length > 0;
        return answers[q.id];
    });

    return (
        <div className="flex flex-col h-full pt-8 px-6">
            <button onClick={onBack} className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6">{config.title}</h2>

            <div className="flex-1 overflow-y-auto pb-4 space-y-8">
                {config.questions.map(q => (
                    <div key={q.id} className="animate-fade-in">
                        <label className="block text-white/80 font-bold mb-3">{q.label}</label>

                        {q.type === 'text' && (
                            <input
                                type="text"
                                placeholder={q.placeholder}
                                className="w-full bg-dark-800 border-b border-white/20 py-3 outline-none focus:border-neon-yellow text-white"
                                onChange={e => handleChange(q.id, e.target.value, 'text')}
                            />
                        )}

                        {q.type === 'choice' && (
                            <div className="flex flex-wrap gap-2">
                                {q.options.map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => handleChange(q.id, opt, 'choice')}
                                        className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${answers[q.id] === opt ? 'bg-neon-yellow text-black border-neon-yellow' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {q.type === 'multi' && (
                            <div className="space-y-2">
                                {q.options.map(opt => {
                                    const selected = (answers[q.id] || []).includes(opt);
                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => handleChange(q.id, opt, 'multi')}
                                            className={`w-full p-3 rounded-xl flex items-center gap-3 border transition-colors ${selected ? 'bg-neon-green/20 border-neon-green text-neon-green' : 'bg-white/5 border-white/10 text-white/70'}`}
                                        >
                                            {selected ? <CheckSquare size={20} /> : <Square size={20} />}
                                            <span>{opt}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                disabled={!isComplete}
                onClick={() => onNext({ specifics: answers })}
                className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl mt-4 mb-8 disabled:opacity-50"
            >
                Voir le Résumé
            </button>
        </div>
    );
};
