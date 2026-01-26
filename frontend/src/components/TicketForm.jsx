
import React, { useState } from 'react';
import { ThumbLayout } from './layout/ThumbLayout';

const TicketForm = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        hasContact: false,
        phone: ''
    });

    const CATEGORIES = [
        { id: 'RACKET', label: '💸 Racket / Corruption', icon: '💸' },
        { id: 'NO_MED', label: '💊 Pas de médicaments', icon: '💊' },
        { id: 'URGENT', label: '🚑 Urgence Vitale', icon: '🚑' },
        { id: 'OTHER', label: 'ℹ️ Autre problème', icon: 'ℹ️' }
    ];

    const handleNext = () => setStep(p => p + 1);

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3000/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                const data = await response.json();
                alert(`Alerte envoyée ! ID: ${data.shortId} 🚨`);
                setStep(0); // Reset
                setFormData({ category: '', description: '', hasContact: false, phone: '' });
            } else {
                alert("Erreur lors de l'envoi.");
            }
        } catch (e) {
            console.error(e);
            alert("Impossible de contacter le serveur.");
        }
    };

    return (
        <ThumbLayout
            actions={
                <button
                    onClick={step === 2 ? handleSubmit : handleNext}
                    disabled={step === 0 && !formData.category}
                    className="w-full h-14 bg-brand text-white font-bold text-lg rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {step === 2 ? 'ENVOYER L\'ALERTE 🚨' : 'CONTINUER 👉'}
                </button>
            }
        >
            {step === 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800">Que se passe-t-il ?</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFormData({ ...formData, category: cat.id })}
                                className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.category === cat.id
                                        ? 'border-brand bg-blue-50 ring-2 ring-brand ring-opacity-50'
                                        : 'border-gray-200 bg-white hover:border-blue-200'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="text-4xl">{cat.icon}</span>
                                    <span className="text-lg font-semibold text-gray-700">{cat.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Détails (Optionnel)</h2>
                    <textarea
                        className="w-full h-40 p-4 rounded-xl border-2 border-gray-300 focus:border-brand focus:ring-0 text-lg"
                        placeholder="Décrivez la situation ici... (ou passez à la suite)"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Contact</h2>

                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                        <label className="flex items-center justify-between">
                            <span className="text-lg font-medium text-gray-700">Me recontacter ?</span>
                            <input
                                type="checkbox"
                                checked={formData.hasContact}
                                onChange={e => setFormData({ ...formData, hasContact: e.target.checked })}
                                className="w-6 h-6 text-brand rounded focus:ring-brand"
                            />
                        </label>
                        <p className="text-sm text-gray-500 mt-2">
                            Si décoché, votre alerte reste <strong>100% anonyme</strong>.
                        </p>
                    </div>

                    {formData.hasContact && (
                        <input
                            type="tel"
                            placeholder="Votre numéro de téléphone"
                            className="w-full h-14 px-4 rounded-xl border-2 border-gray-300 focus:border-brand text-lg"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    )}
                </div>
            )}
        </ThumbLayout>
    );
};

export default TicketForm;
