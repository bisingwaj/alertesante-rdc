```javascript
import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Square, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// CONFIGURATION DES QUESTIONS (Wording Amélioré)
const FORMS = {
    QUALITY: {
        title: "Détails de la plainte",
        questions: [
            { id: 'q_type', label: "De quel type de problème s'agit-il ?", type: 'choice', options: ['Paiement Illégal / Extorsion', 'Violence / Mauvais Accueil', 'Refus de soins injustifié', 'Négligence médicale', 'Manque de confidentialité', 'Autre'] },
            { id: 'q_who', label: "Qui est directement concerné ?", type: 'choice', options: ['Moi-même', 'Un de mes enfants', 'Une femme enceinte', 'Un adulte de ma famille', 'Une personne vulnérable'] },
            { id: 'q_structure_type', label: "Dans quel type d'établissement ?", type: 'choice', options: ['Hôpital Public', 'Centre de Santé', 'Clinique Privée', 'Laboratoire', 'Pharmacie', 'Autre'] },
            { id: 'q_expect', label: "Quelles sont vos attentes ?", type: 'multi', options: ['Remboursement des sommes', 'Sanction du personnel', 'Amélioration du service', 'Simples explications'] }
        ]
    },
    MEDS: {
        title: "Problème Médicament",
        questions: [
             { id: 'm_type', label: "Quel est le défaut constaté ?", type: 'choice', options: ['Rupture de stock complète', 'Prix beaucoup trop élevé', 'Qualité douteuse (couleur/aspect)', 'Médicament périmé', 'Inefficacité totale', 'Effet secondaire grave'] },
             { id: 'm_product', label: "Quel est le nom exact du produit ?", type: 'text', placeholder: "Ex: Paracétamol, Amoxicilline..." },
             { id: 'm_source', label: "Où vous l'êtes-vous procuré ?", type: 'choice', options: ['Pharmacie de l\'Hôpital', 'Pharmacie Privée', 'Marché / Vendeur de rue', 'Don / ONG'] }
        ]
    },
    ALERT: {
        title: "Alerte Sanitaire",
        questions: [
            { id: 'a_signal', label: "Qu'est-ce qui vous alerte ?", type: 'choice', options: ['Décès inhabituel(s)', 'Plusieurs malades (mêmes signes)', 'Maladie inconnue', 'Rumeur persistante', 'Maladie chez les animaux'] },
            { id: 'a_symptoms', label: "Cochez UNIQUEMENT les signes observés :", type: 'multi', options: ['Fièvre forte', 'Diarrhée sévère', 'Vomissements', 'Saignements anormaux', 'Toux difficile', 'Éruption cutanée', 'Jaunisse (yeux jaunes)', 'Convulsions'] },
            { id: 'a_informed', label: "Le personnel de santé est-il informé ?", type: 'choice', options: ['Oui, ils sont sur place', 'Non, pas encore', 'Je ne sais pas'] }
        ]
    },
    HYGIENE: {
        title: "Hygiène & Environnement",
        questions: [
            { id: 'h_type', label: "Quel risque identifiez-vous ?", type: 'choice', options: ['Dépotoir sauvage / Déchets', 'Eau sale / Puits contaminé', 'Égouts à ciel ouvert', 'Toilettes publiques insalubres', 'Nuisibles (Rats, moustiques...)', 'Fumées / Pollution air'] },
            { id: 'h_impact', label: "Quel est l'impact visible ?", type: 'multi', options: ['Odeurs insupportables', 'Risque de blessure', 'Eau imbuvable', 'Enfants jouent à proximité', 'Inondation'] },
            { id: 'h_freq', label: "Depuis quand est-ce ainsi ?", type: 'choice', options: ['C\'est récent (quelques jours)', 'C\'est récurrent (revient souvent)', 'C\'est permanent (toujours là)'] }
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
            // Multi doesn't auto-advance
        } else {
            newAnswers[currentQuestion.id] = val;
            setAnswers(newAnswers);
            // Auto advance for choice types
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
        if (currentQuestion.type === 'text') return !!answers[currentQuestion.id]; // Text input must have a value to proceed
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
                    animate={{ width: `${ progress }% ` }} 
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

                    <div className="flex-1 space-y-3 overflow-y-auto pb-4">
                        {currentQuestion.type === 'text' && (
                            <div className="relative">
                                <input 
                                    autoFocus
                                    type="text" 
                                    placeholder={currentQuestion.placeholder}
                                    className="w-full bg-dark-800 border-b-2 border-white/20 py-4 text-xl outline-none focus:border-neon-yellow text-white placeholder-white/20 transition-colors"
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={e => handleAnswer(e.target.value, 'text-input')} // Don't auto advance on input
                                />
                                <button 
                                    onClick={() => handleNextQuestion()}
                                    disabled={!canContinue()}
                                    className="absolute right-0 top-4 p-2 bg-neon-yellow text-black rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {currentQuestion.type === 'choice' && (
                            <div className="space-y-3">
                                {currentQuestion.options.map((opt, i) => (
                                    <motion.button 
                                        key={opt}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        onClick={() => handleAnswer(opt, 'choice')}
                                        className={`w - full p - 5 rounded - 2xl text - left font - bold text - lg border transition - all flex items - center justify - between group ${ answers[currentQuestion.id] === opt ? 'bg-white text-black border-white' : 'bg-dark-800 border-white/10 text-white/70 hover:border-white/30' } `}
                                    >
                                        <span>{opt}</span>
                                        {answers[currentQuestion.id] === opt && <Check size={20} className="text-black"/>}
                                    </motion.button>
                                ))}
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
                                                className={`w - full p - 4 rounded - xl flex items - center gap - 4 border transition - all ${ selected ? 'bg-neon-green/20 border-neon-green text-neon-green' : 'bg-dark-800 border-white/10 text-white/70' } `}
                                            >
                                                <div className={`w - 6 h - 6 rounded border flex items - center justify - center ${ selected ? 'bg-neon-green border-neon-green text-black' : 'border-white/30' } `}>
                                                    {selected && <Check size={16} strokeWidth={4} />}
                                                </div>
                                                <span className="font-medium text-lg text-left">{opt}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                                <button 
                                    onClick={() => handleNextQuestion()}
                                    disabled={!canContinue()}
                                    className="w-full py-4 mt-8 bg-neon-yellow text-black font-bold rounded-xl disabled:opacity-50"
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
```
