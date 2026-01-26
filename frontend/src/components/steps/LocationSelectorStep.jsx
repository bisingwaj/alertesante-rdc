
import React from 'react';
import { useLocationRDC } from '../../hooks/useLocationRDC';
import { MapPin, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const SelectButton = ({ label, value, onClick, active }) => (
    <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`w-full p-4 mb-3 rounded-2xl flex items-center justify-between transition-colors border ${active
                ? 'bg-neon-yellow/10 border-neon-yellow text-neon-yellow'
                : 'bg-dark-800 border-transparent text-white hover:bg-dark-700'
            }`}
    >
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${active ? 'bg-neon-yellow text-black' : 'bg-dark-700 text-white/50'}`}>
                <MapPin size={18} />
            </div>
            <span className="font-semibold text-lg">{label || 'Sélectionner...'}</span>
        </div>
        {value ? (
            <span className="text-white font-bold">{value}</span>
        ) : (
            <ChevronRight className="text-white/30" />
        )}
    </motion.button>
);

export const LocationSelectorStep = ({ onComplete }) => {
    const {
        provinces, cities, communes,
        selectedProvince, selectedCity, selectedCommune,
        setProvince, setCity, setCommune
    } = useLocationRDC();

    // Mode "Wizard" interne pour la localisation (3 sous-étapes)
    const [internalStep, setInternalStep] = React.useState('PROVINCE'); // PROVINCE, CITY, COMMUNE

    const handleProvinceSelect = (p) => {
        setProvince(p);
        setInternalStep('CITY');
    };

    const handleCitySelect = (c) => {
        setCity(c);
        setInternalStep('COMMUNE');
    };

    const handleCommuneSelect = (c) => {
        setCommune(c);
        onComplete({ province: selectedProvince, city: selectedCity, commune: c });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pb-4 scrollbar-hide">

                {/* Vue Liste : PROVINCES */}
                {internalStep === 'PROVINCE' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <h3 className="text-white/50 uppercase text-xs font-bold mb-4 tracking-widest pl-2">Province</h3>
                        {provinces.map(p => (
                            <SelectButton key={p} label={p} onClick={() => handleProvinceSelect(p)} active={false} />
                        ))}
                    </motion.div>
                )}

                {/* Vue Liste : VILLES */}
                {internalStep === 'CITY' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => setInternalStep('PROVINCE')}
                            className="text-white/50 text-sm mb-4 flex items-center gap-1 hover:text-white"
                        >
                            ← Retour (Province : {selectedProvince})
                        </button>
                        <h3 className="text-white/50 uppercase text-xs font-bold mb-4 tracking-widest pl-2">Ville / Territoire</h3>
                        {cities.map(c => (
                            <SelectButton key={c} label={c} onClick={() => handleCitySelect(c)} active={false} />
                        ))}
                    </motion.div>
                )}

                {/* Vue Liste : COMMUNES */}
                {internalStep === 'COMMUNE' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <button
                            onClick={() => setInternalStep('CITY')}
                            className="text-white/50 text-sm mb-4 flex items-center gap-1 hover:text-white"
                        >
                            ← Retour (Ville : {selectedCity})
                        </button>
                        <h3 className="text-white/50 uppercase text-xs font-bold mb-4 tracking-widest pl-2">Commune</h3>
                        {communes.map(c => (
                            <SelectButton key={c} label={c} onClick={() => handleCommuneSelect(c)} active={selectedCommune === c} />
                        ))}
                    </motion.div>
                )}

            </div>
        </div>
    );
};
