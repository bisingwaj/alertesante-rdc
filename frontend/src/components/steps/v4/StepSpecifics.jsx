
import React, { useState } from 'react';
import {
    ArrowLeft, ChevronRight, Check,
    Shield, User, Building, FileText,
    Pill, AlertCircle, ShoppingBag,
    Siren, Activity, Stethoscope,
    Trash2, Droplets, Wind, Home,
    CreditCard, Frown, Ban, EyeOff, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// MAPPING ICONES
const ICONS = {
    // Quality
    'Paiement Illégal / Extorsion': CreditCard,
    'Violence / Mauvais Accueil': Frown,
    'Refus de soins injustifié': Ban,
    'Négligence médicale': Stethoscope,
    'Manque de confidentialité': EyeOff,
    'Autre': HelpCircle,

    // People
    'Moi-même': User,
    'Un de mes enfants': User,
    'Une femme enceinte': User,

    // Places
    'Hôpital Public': Building,
    'Centre de Santé': Home,
    'Clinique Privée': Building,
    'Pharmacie': Pill,

    // Meds
    'Rupture de stock complète': Ban,
    'Prix beaucoup trop élevé': CreditCard,
    'Médicament périmé': Trash2,

    // Hygiene
    'Dépotoir sauvage / Déchets': Trash2,
    'Eau sale / Puits contaminé': Droplets,
    'Fumées / Pollution air': Wind
};

const getIcon = (label) => {
    const Icon = ICONS[label] || chevronRightIcon;
    // Fallback handled in render if needed, or default Icon
    return Icon === chevronRightIcon ? null : Icon;
};
const chevronRightIcon = ChevronRight;

// CONFIGURATION DES QUESTIONS (Wording Amélioré)
const FORMS = {
    QUALITY: {
        title: "Détails de la plainte",
        questions: [
            { id: 'q_type', label: "De quel type de problème s'agit-il ?", type: 'choice', layout: 'grid', options: ['Paiement Illégal / Extorsion', 'Violence / Mauvais Accueil', 'Refus de soins injustifié', 'Négligence médicale', 'Manque de confidentialité', 'Autre'] },
            { id: 'q_who', label: "Qui est directement concerné ?", type: 'choice', layout: 'grid', options: ['Moi-même', 'Un de mes enfants', 'Une femme enceinte', 'Un adulte de ma famille', 'Une personne vulnérable'] },
            { id: 'q_structure_type', label: "Dans quel type d'établissement ?", type: 'choice', layout: 'grid', options: ['Hôpital Public', 'Centre de Santé', 'Clinique Privée', 'Laboratoire', 'Pharmacie', 'Autre'] },
            { id: 'q_expect', label: "Quelles sont vos attentes ?", type: 'multi', options: ['Remboursement des sommes', 'Sanction du personnel', 'Amélioration du service', 'Simples explications'] }
        ]
    },
    MEDS: {
        title: "Problème Médicament",
        questions: [
            { id: 'm_type', label: "Quel est le défaut constaté ?", type: 'choice', layout: 'list', options: ['Rupture de stock complète', 'Prix beaucoup trop élevé', 'Qualité douteuse (couleur/aspect)', 'Médicament périmé', 'Inefficacité totale', 'Effet secondaire grave'] },
            { id: 'm_product', label: "Quel est le nom exact du produit ?", type: 'text', placeholder: "Ex: Paracétamol, Amoxicilline..." },
            { id: 'm_source', label: "Où vous l'êtes-vous procuré ?", type: 'choice', layout: 'grid', options: ['Pharmacie de l\'Hôpital', 'Pharmacie Privée', 'Marché / Vendeur de rue', 'Don / ONG'] }
        ]
    },
    ALERT: {
        title: "Alerte Sanitaire",
        questions: [
            { id: 'a_signal', label: "Qu'est-ce qui vous alerte ?", type: 'choice', layout: 'list', options: ['Décès inhabituel(s)', 'Plusieurs malades (mêmes signes)', 'Maladie inconnue', 'Rumeur persistante', 'Maladie chez les animaux'] },
            { id: 'a_symptoms', label: "Cochez UNIQUEMENT les signes observés :", type: 'multi', options: ['Fièvre forte', 'Diarrhée sévère', 'Vomissements', 'Saignements anormaux', 'Toux difficile', 'Éruption cutanée', 'Jaunisse (yeux jaunes)', 'Convulsions'] },
            { id: 'a_informed', label: "Le personnel de santé est-il informé ?", type: 'choice', layout: 'grid', options: ['Oui, ils sont sur place', 'Non, pas encore', 'Je ne sais pas'] }
        ]
    },
    HYGIENE: {
        title: "Hygiène & Environnement",
        questions: [
            { id: 'h_type', label: "Quel risque identifiez-vous ?", type: 'choice', layout: 'list', options: ['Dépotoir sauvage / Déchets', 'Eau sale / Puits contaminé', 'Égouts à ciel ouvert', 'Toilettes publiques insalubres', 'Nuisibles (Rats, moustiques...)', 'Fumées / Pollution air'] },
            { id: 'h_impact', label: "Quel est l'impact visible ?", type: 'multi', options: ['Odeurs insupportables', 'Risque de blessure', 'Eau imbuvable', 'Enfants jouent à proximité', 'Inondation'] },
            { id: 'h_freq', label: "Depuis quand est-ce ainsi ?", type: 'choice', layout: 'grid', options: ['C\'est récent', 'C\'est récurrent', 'C\'est permanent'] }
        ]
    }
};

export const StepSpecifics = ({ branch, onNext, onBack }) => {
    const config = FORMS[branch] || FORMS['QUALITY'];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const currentQuestion = config.questions[currentIndex];
    const progress = ((currentIndex + 1) / config.questions.length) * 100;

    const handleAnswer = (val, type) => {
        let newAnswers = { ...answers };

        if (type === 'multi') {
            const current = newAnswers[currentQuestion.id] || [];
            if (current.includes(val)) {
                newAnswers[currentQuestion.id] = current.filter(x => x !== val);
            } else {
                newAnswers[currentQuestion.id] = [...current, val];
            }
            setAnswers(newAnswers);
        } else {
            newAnswers[currentQuestion.id] = val;
            setAnswers(newAnswers);
            if (type === 'choice') {
                setTimeout(() => handleNextQuestion(newAnswers), 250);
            }
        }
    };

    const handleNextQuestion = (forceAnswers = answers) => {
        if (currentIndex < config.questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onNext({ specifics: forceAnswers });
        }
    };

    const handlePrevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            onBack();
        }
    };

    const canContinue = () => {
        if (currentQuestion.type === 'text') return !!answers[currentQuestion.id];
        if (currentQuestion.type === 'multi') return (answers[currentQuestion.id] || []).length > 0;
        return !!answers[currentQuestion.id];
    };

    return (
        <div className="flex flex-col h-full pt-8 px-6">
            {/* Header / Nav */}
            <div className="flex items-center justify-between mb-6">
                <button onClick={handlePrevQuestion} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                    <ArrowLeft size={24} className="text-white" />
                </button>
                <div className="text-xs font-bold text-white/30 uppercase tracking-widest">
                    Question {currentIndex + 1} / {config.questions.length}
                </div>
                <div className="w-10" />
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-neon-yellow transition-all duration-300"
                />
            </div>

            {/* Question Card */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col"
                >
                    <h2 className="text-2xl font-bold mb-8 leading-tight">{currentQuestion.label}</h2>

                    <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
                        {currentQuestion.type === 'text' && (
                            <div className="relative pt-4">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder={currentQuestion.placeholder}
                                    className="w-full bg-transparent border-b-2 border-white/20 py-4 text-xl outline-none focus:border-neon-yellow text-white placeholder-white/20 transition-colors"
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={e => handleAnswer(e.target.value, 'text-input')}
                                />
                                <button
                                    onClick={() => handleNextQuestion()}
                                    disabled={!canContinue()}
                                    className="absolute right-0 top-8 p-3 bg-neon-yellow text-black rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                                >
                                    <ChevronRight size={20} className="stroke-[3]" />
                                </button>
                            </div>
                        )}

                        {currentQuestion.type === 'choice' && (
                            <div className={`grid gap-3 ${currentQuestion.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {currentQuestion.options.map((opt, i) => {
                                    const Icon = ICONS[opt];
                                    const isSelected = answers[currentQuestion.id] === opt;

                                    return (
                                        <motion.button
                                            key={opt}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => handleAnswer(opt, 'choice')}
                                            className={`relative p-4 rounded-2xl text-left border transition-all duration-200 group overflow-hidden
                                                ${isSelected
                                                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                                    : 'bg-dark-800 border-white/10 text-white/70 hover:border-white/30 hover:bg-white/5'}
                                            `}
                                        >
                                            {Icon && (
                                                <div className={`mb-3 ${isSelected ? 'text-black' : 'text-neon-yellow'}`}>
                                                    <Icon size={24} strokeWidth={1.5} />
                                                </div>
                                            )}
                                            <span className={`block font-bold leading-tight ${currentQuestion.layout === 'grid' ? 'text-sm' : 'text-lg'}`}>
                                                {opt}
                                            </span>

                                            {isSelected && (
                                                <div className="absolute top-3 right-3">
                                                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                                        <Check size={12} className="text-white" strokeWidth={3} />
                                                    </div>
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        )}

                        {currentQuestion.type === 'multi' && (
                            <>
                                <div className="space-y-3">
                                    {currentQuestion.options.map((opt, i) => {
                                        const selected = (answers[currentQuestion.id] || []).includes(opt);
                                        return (
                                            <motion.button
                                                key={opt}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                onClick={() => handleAnswer(opt, 'multi')}
                                                className={`w-full p-4 rounded-xl flex items-center gap-4 border transition-all duration-200
                                                    ${selected
                                                        ? 'bg-neon-green/10 border-neon-green text-neon-green shadow-[0_0_15px_rgba(74,222,128,0.1)]'
                                                        : 'bg-dark-800 border-white/10 text-white/70 hover:bg-white/5'} 
                                                `}
                                            >
                                                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors 
                                                    ${selected ? 'bg-neon-green border-neon-green text-black' : 'border-white/30'} 
                                                `}>
                                                    {selected && <Check size={14} strokeWidth={4} />}
                                                </div>
                                                <span className="font-medium text-lg text-left">{opt}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => handleNextQuestion()}
                                    disabled={!canContinue()}
                                    className="w-full py-4 mt-8 bg-neon-yellow text-black font-bold rounded-xl disabled:opacity-50 hover:scale-[1.02] transition-transform shadow-lg shadow-neon-yellow/20"
                                >
                                    Valider
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

