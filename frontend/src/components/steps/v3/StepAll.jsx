
export { StepHome, StepType, StepCategory } from './StepTypeCategory';
export { StepLocation } from './StepLocation';
// Placeholder pour les autres en attendant qu'on les crée
export const StepStructure = ({ onNext }) => (
    <div className="text-center mt-10">
        <input type="text" placeholder="Nom de l'hôpital (Optionnel)" className="w-full bg-dark-800 p-4 rounded-xl text-white mb-4" />
        <button onClick={() => onNext({ structureName: 'Inconnu' })} className="w-full py-4 bg-white text-black font-bold rounded-xl">Je ne sais pas / Continuer</button>
    </div>
);
export const StepDetails = ({ onNext }) => (
    <div className="text-center mt-10">
        <textarea placeholder="Décrivez la situation..." className="w-full h-40 bg-dark-800 p-4 rounded-xl text-white mb-4"></textarea>
        <button onClick={() => onNext({ description: 'Test', mediaUrls: [] })} className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl">Continuer</button>
    </div>
);
export const StepImpact = ({ onNext }) => (
    <div className="flex flex-col gap-4 mt-10">
        <button onClick={() => onNext({ time: 'TODAY', impact: 'ONE' })} className="w-full py-4 bg-dark-800 rounded-xl">Une personne / Aujour'hui</button>
    </div>
);
export const StepGravity = ({ onNext }) => (
    <div className="flex flex-col gap-4 mt-10">
        <button onClick={() => onNext({ gravity: 'NORMAL' })} className="w-full py-4 bg-green-500/20 text-green-500 rounded-xl font-bold">Normal</button>
        <button onClick={() => onNext({ gravity: 'GRAVE' })} className="w-full py-4 bg-red-500/20 text-red-500 rounded-xl font-bold">Grave</button>
    </div>
);
export const StepContact = ({ onNext }) => (
    <div className="mt-10">
        <button onClick={() => onNext({ isAnonymous: true })} className="w-full py-4 bg-dark-800 rounded-xl mb-4">Rester Anonyme</button>
    </div>
);
export const StepReview = ({ onSubmit }) => (
    <div className="mt-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Prêt à envoyer ?</h2>
        <button onClick={onSubmit} className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl text-xl">ENVOYER 🚀</button>
    </div>
);
export const StepSuccess = ({ data }) => (
    <div className="mt-20 text-center">
        <h2 className="text-4xl">✅</h2>
        <h2 className="text-2xl font-bold mt-4">Merci !</h2>
        <p className="text-white/50 mt-2">Votre signalement a été transmis.</p>
    </div>
);
