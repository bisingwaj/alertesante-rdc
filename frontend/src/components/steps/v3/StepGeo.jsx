
import React, { useState } from 'react';
import { GeoSelector } from '../../ui/GeoSelector';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

export const StepGeo = ({ onNext }) => {
    const [locating, setLocating] = useState(false);
    const [gpsData, setGpsData] = useState(null);

    const handleLocate = () => {
        setLocating(true);
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            setLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setGpsData({ latitude, longitude });
                setLocating(false);
                // On ne passe pas tout de suite, l'utilisateur doit aussi choisir administrativement
            },
            (error) => {
                console.error(error);
                alert("Impossible de récupérer votre position. Vérifiez vos paramètres.");
                setLocating(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleManualComplete = (geoData) => {
        // Merge manual selection with GPS data if available
        onNext({ ...geoData, gps: gpsData });
    };

    return (
        <div className="flex flex-col h-full pt-12 px-6">
            <h2 className="text-2xl font-bold mb-2">Où cela se passe-t-il ?</h2>
            <p className="text-white/60 mb-6">Précisez le lieu de l'incident.</p>

            {/* Bouton GPS */}
            <button
                onClick={handleLocate}
                disabled={locating || gpsData}
                className={`w-full py-4 mb-6 rounded-2xl flex items-center justify-center gap-3 transition-colors border ${gpsData
                        ? 'bg-neon-green/20 border-neon-green text-neon-green'
                        : 'bg-neon-yellow/10 border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20'
                    }`}
            >
                {locating ? <Loader2 className="animate-spin" /> : gpsData ? <CheckCircle2 /> : <MapPin />}
                <span className="font-bold">
                    {locating ? 'Localisation en cours...' : gpsData ? 'Position GPS Validée' : 'Utiliser ma position actuelle'}
                </span>
            </button>

            <div className="flex-1 overflow-hidden">
                <GeoSelector onComplete={handleManualComplete} />
            </div>
        </div>
    );
};
