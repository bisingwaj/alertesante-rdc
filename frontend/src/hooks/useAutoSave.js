
import { useEffect } from 'react';

export const useAutoSave = (key, data, step) => {
    // Charger au démarrage
    useEffect(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            // Logique de restoration à implémenter si besoin
            // Pour l'instant on sauvegarde juste pour éviter la perte
        }
    }, []);

    // Sauvegarder à chaque changement
    useEffect(() => {
        if (Object.keys(data).length > 0) {
            localStorage.setItem(key, JSON.stringify({ step, data, timestamp: Date.now() }));
        }
    }, [data, step, key]);
};
