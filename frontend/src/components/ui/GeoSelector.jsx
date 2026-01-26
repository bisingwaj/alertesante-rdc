
import React, { useState, useMemo } from 'react';
import rdcData from '../../data/rdc-admin-data.json';
import { motion } from 'framer-motion';
import { MapPin, Check, ChevronRight } from 'lucide-react';

export const GeoSelector = ({ onComplete }) => {
    const [step, setStep] = useState('PROVINCE'); // PROVINCE, CHILD (Ville/Territoire), ZS
    const [selection, setSelection] = useState({ province: '', child: '', zs: '' });

    // 1. Provinces
    const provinces = useMemo(() => rdcData.map(p => p.province).sort(), []);

    // 2. Villes / Territoires
    const children = useMemo(() => {
        if (!selection.province) return [];
        return rdcData.find(p => p.province === selection.province)?.children || [];
    }, [selection.province]);

    // 3. Zones de Santé
    const healthZones = useMemo(() => {
        if (!selection.child) return [];
        return children.find(c => c.name === selection.child)?.zonesSante.sort() || [];
    }, [selection.child, children]);

    const handleSelect = (key, value, nextStep) => {
        const newSelection = { ...selection, [key]: value };
        setSelection(newSelection);
        if (nextStep) {
            setStep(nextStep);
        } else {
            onComplete(newSelection);
        }
    };

    const Item = ({ label, type, onClick, active }) => (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`w-full p-4 mb-2 rounded-xl flex items-center justify-between text-left border ${active ? 'bg-neon-yellow text-black border-neon-yellow' : 'bg-dark-800 text-white border-white/5'
                }`}
        >
            <div>
                <span className="block font-medium text-lg">{label}</span>
                {type && <span className="text-xs opacity-60 uppercase tracking-wider">{type}</span>}
            </div>
            {active ? <Check size={20} /> : <ChevronRight size={20} className="opacity-30" />}
        </motion.button>
    );

    return (
        <div className="flex flex-col h-full overflow-y-auto pb-20 px-1 scrollbar-hide">

            {/* HEADER NAVIGATION */}
            {step !== 'PROVINCE' && (
                <button
                    onClick={() => setStep(step === 'ZS' ? 'CHILD' : 'PROVINCE')}
                    className="mb-4 text-white/50 text-sm flex items-center gap-2 hover:text-white"
                >
                    ← Retour
                </button>
            )}

            {/* STEP 1: PROVINCE */}
            {step === 'PROVINCE' && (
                <div className="space-y-1">
                    <h3 className="text-neon-yellow text-xs font-bold uppercase tracking-widest mb-4">Choisir la Province</h3>
                    {provinces.map(p => (
                        <Item key={p} label={p} onClick={() => handleSelect('province', p, 'CHILD')} />
                    ))}
                </div>
            )}

            {/* STEP 2: VILLE / TERRITOIRE */}
            {step === 'CHILD' && (
                <div className="space-y-1">
                    <h3 className="text-neon-yellow text-xs font-bold uppercase tracking-widest mb-4">Ville ou Territoire</h3>
                    {children.map(c => (
                        <Item key={c.name} label={c.name} type={c.type} onClick={() => handleSelect('child', c.name, 'ZS')} />
                    ))}
                </div>
            )}

            {/* STEP 3: ZONE DE SANTE */}
            {step === 'ZS' && (
                <div className="space-y-1">
                    <h3 className="text-neon-yellow text-xs font-bold uppercase tracking-widest mb-4">Zone de Santé</h3>
                    {healthZones.map(zs => (
                        <Item key={zs} label={zs} onClick={() => handleSelect('zs', zs, null)} />
                    ))}
                    <Item label="Je ne sais pas" onClick={() => handleSelect('zs', 'N/A', null)} />
                </div>
            )}

        </div>
    );
};
