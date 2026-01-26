
import React, { useState, useEffect } from 'react';
import { SelectSheet } from './SelectSheet';
import { ChevronDown, MapPin } from 'lucide-react';
import adminData from '../../data/rdc-admin-data.json';

export const GeoSelector = ({ onComplete }) => {
    // Data Loading
    const [provinces, setProvinces] = useState([]);
    const [territories, setTerritories] = useState([]);

    // Selection state
    const [selProvince, setSelProvince] = useState(null);
    const [selChild, setSelChild] = useState(null);
    const [selZS, setSelZS] = useState(null);

    // Modal state
    const [openProv, setOpenProv] = useState(false);
    const [openChild, setOpenChild] = useState(false);
    const [openZS, setOpenZS] = useState(false); // Si on avait les ZS

    useEffect(() => {
        // Load provinces
        const provs = Object.keys(adminData).map(p => ({ id: p, label: p }));
        setProvinces(provs.sort((a, b) => a.label.localeCompare(b.label)));
    }, []);

    useEffect(() => {
        if (selProvince) {
            const childs = adminData[selProvince.id] || [];
            setTerritories(childs.map(c => ({ id: c, label: c })).sort((a, b) => a.label.localeCompare(b.label)));
            setSelChild(null); // Reset child when province changes
        }
    }, [selProvince]);

    useEffect(() => {
        if (selProvince && selChild) {
            onComplete({
                province: selProvince.label,
                child: selChild.label,
                zs: 'Non spécifié' // Pas de ZS dans le JSON actuel, à améliorer
            });
        }
    }, [selProvince, selChild]);

    return (
        <div className="space-y-4">
            {/* Province Button */}
            <button
                onClick={() => setOpenProv(true)}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selProvince ? 'bg-white/10 border-white/20' : 'bg-dark-800 border-white/10 hover:border-neon-yellow/50'}`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <MapPin size={20} className={selProvince ? "text-neon-yellow" : "text-white/40"} />
                    </div>
                    <div className="text-left">
                        <span className="block text-xs font-bold text-white/40 uppercase">Province</span>
                        <span className={`block font-bold text-lg ${selProvince ? 'text-white' : 'text-white/30'}`}>
                            {selProvince ? selProvince.label : 'Choisir...'}
                        </span>
                    </div>
                </div>
                <ChevronDown size={20} className="text-white/30" />
            </button>

            {/* Child Button (Ville/Territoire) */}
            <button
                onClick={() => selProvince && setOpenChild(true)}
                disabled={!selProvince}
                className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${!selProvince ? 'opacity-50 cursor-not-allowed border-transparent' : selChild ? 'bg-white/10 border-white/20' : 'bg-dark-800 border-white/10 hover:border-neon-yellow/50'}`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                        <MapPin size={20} className={selChild ? "text-neon-green" : "text-white/40"} />
                    </div>
                    <div className="text-left">
                        <span className="block text-xs font-bold text-white/40 uppercase">Ville / Territoire</span>
                        <span className={`block font-bold text-lg ${selChild ? 'text-white' : 'text-white/30'}`}>
                            {selChild ? selChild.label : 'Choisir...'}
                        </span>
                    </div>
                </div>
                <ChevronDown size={20} className="text-white/30" />
            </button>

            {/* Modals */}
            <SelectSheet
                isOpen={openProv}
                onClose={() => setOpenProv(false)}
                title="Choisir la Province"
                options={provinces}
                onSelect={setSelProvince}
            />

            <SelectSheet
                isOpen={openChild}
                onClose={() => setOpenChild(false)}
                title="Ville ou Territoire"
                options={territories}
                onSelect={setSelChild}
            />
        </div>
    );
};
