
import React from 'react';

// STUBS GENERIC
const StubStep = ({ title, onNext }) => (
    <div className="p-6">
        <h2 className="text-xl font-bold mb-6">{title}</h2>
        <button onClick={() => onNext({})} className="w-full bg-dark-700 text-white p-4 rounded-xl">Continuer</button>
    </div>
);

export const StepType = (props) => <StubStep title="Type de signalement" {...props} />;
export const StepGeo = (props) => <StubStep title="Localisation" {...props} />;
export const StepStructure = (props) => <StubStep title="Structure de santé" {...props} />;
export const StepCategory = (props) => <StubStep title="Détails du problème" {...props} />;
export const StepDetails = (props) => <StubStep title="Preuves & Description" {...props} />;
export const StepTime = (props) => <StubStep title="Impact & Durée" {...props} />;
export const StepGravity = (props) => <StubStep title="Gravité" {...props} />;
export const StepContact = (props) => <StubStep title="Contact & Anonymat" {...props} />;
export const StepRecap = (props) => <StubStep title="Vérification" {...props} />;
export const StepSuccess = (props) => <StubStep title="Envoyé !" {...props} />;
