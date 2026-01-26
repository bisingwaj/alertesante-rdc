
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Search } from 'lucide-react';
import { GeoSelector } from '../../ui/GeoSelector'; // Reuse logic

export const StepLocation = ({ onNext, onBack }) => {
    const [mode, setMode] = useState('manual'); // manual, gps
    const [placeName, setPlaceName] = useState('');
    const [geoData, setGeoData] = useState({});
    const [gpsData, setGpsData] = useState(null);
    const [locating, setLocating] = useState(false);

    const handleLocate = () => {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGpsData({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                setLocating(false);
            },
            (err) => {
                alert("Impossible de vous géolocaliser.");
                setLocating(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const handleNext = () => {
        onNext({
            location: {
                name: placeName,
                administrative: geoData,
                gps: gpsData
            }
        });
    };

    return (
        <div className="flex flex-col h-full pt-8 px-6">
            <button onClick={onBack} className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Où cela se passe-t-il ?</h2>
            <p className="text-white/60 mb-6">Le plus de précision possible aide les équipes.</p>

            <div className="bg-dark-800 p-4 rounded-xl border border-white/10 mb-6 space-y-4">
                <div>
                    <label className="text-xs text-white/40 font-bold uppercase mb-2 block">Lieu précis (Nom, Rue, Repère)</label>
                    <input
                        type="text"
                        placeholder="Ex: Marché Liberté, croisement..."
                        value={placeName}
                        onChange={e => setPlaceName(e.target.value)}
                        className="w-full bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-neon-yellow placeholder-white/20"
                    />
                </div>

                <div onClick={handleLocate} className="flex items-center gap-3 py-3 px-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10">
                    {locating ? <div className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent" /> :
                        gpsData ? <div className="w-5 h-5 bg-neon-green rounded-full flex items-center justify-center"><div className="w-2 h-2 bg-black rounded-full" /></div> :
                            <Navigation size={20} className="text-neon-yellow" />}

                    <span className={gpsData ? "text-neon-green font-bold" : "text-white/80"}>
                        {gpsData ? "Position GPS ajoutée" : "Ajouter ma position GPS"}
                    </span>
                </div>
            </div>

            <p className="text-xs text-white/40 font-bold uppercase mb-2">Zone Administrative (Optionnel)</p>
            <div className="flex-1 overflow-hidden bg-dark-800/50 rounded-xl border border-white/5 p-2 mb-4">
                <GeoSelector onComplete={setGeoData} />
            </div>

            <button
                onClick={handleNext}
                className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl mb-8"
            >
                Continuer
            </button>
        </div>
    );
};
