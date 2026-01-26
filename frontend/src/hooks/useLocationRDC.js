
import { useState, useMemo } from 'react';
import rdcData from '../data/rdc-admin-data.json';

export const useLocationRDC = () => {
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');

    // Liste des provinces triée
    const provinces = useMemo(() => {
        return rdcData.map(p => p.province).sort();
    }, []);

    // Liste des villes selon la province
    const cities = useMemo(() => {
        if (!selectedProvince) return [];
        const provinceData = rdcData.find(p => p.province === selectedProvince);
        return provinceData ? provinceData.villes.map(v => v.nom).sort() : [];
    }, [selectedProvince]);

    // Liste des communes selon la ville
    const communes = useMemo(() => {
        if (!selectedProvince || !selectedCity) return [];
        const provinceData = rdcData.find(p => p.province === selectedProvince);
        const cityData = provinceData?.villes.find(v => v.nom === selectedCity);
        return cityData ? cityData.communes.sort() : [];
    }, [selectedProvince, selectedCity]);

    // Reset intelligent
    const setProvince = (p) => {
        setSelectedProvince(p);
        setSelectedCity('');
        setSelectedCommune('');
    };

    const setCity = (c) => {
        setSelectedCity(c);
        setSelectedCommune('');
    };

    return {
        provinces,
        cities,
        communes,
        selectedProvince,
        selectedCity,
        selectedCommune,
        setProvince,
        setCity,
        setCommune: setSelectedCommune
    };
};
