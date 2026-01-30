import React from 'react';
import { MapPin } from 'lucide-react';

export const MapPage = () => {
    const provinces = [
        { name: 'Kinshasa', count: 45, color: '#FF3D71' },
        { name: 'Nord-Kivu', count: 32, color: '#FF8A00' },
        { name: 'Sud-Kivu', count: 28, color: '#FF8A00' },
        { name: 'Haut-Katanga', count: 18, color: '#6C5CE7' },
        { name: 'Kongo Central', count: 15, color: '#6C5CE7' },
        { name: 'Autres', count: 9, color: '#C0C0C0' },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-12">
            {/* Header */}
            <div className="mb-12">
                <p className="text-[#A0A0A0] text-sm mb-2">Tableau de Bord  </p>
                <h1 className="text-4xl font-bold text-[#1A1A1A]">Carte Géographique</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Distribution RDC</h2>
                        <div className="h-[600px] flex items-center justify-center bg-[#FAFAFA] rounded-xl">
                            <div className="text-center">
                                <MapPin size={48} className="text-[#C0C0C0] mx-auto mb-4" />
                                <p className="text-[#C0C0C0]">Carte interactive en construction</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Province List */}
                <div>
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Par Province</h2>
                        <div className="space-y-4">
                            {provinces.map((province) => (
                                <div key={province.name} className="flex items-center justify-between py-3 border-b border-[#F8F8F8] last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ background: province.color }}
                                        />
                                        <span className="text-sm font-medium text-[#404040]">
                                            {province.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-[#1A1A1A]">
                                        {province.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0] mt-8">
                        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Statistiques</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-1">Total Provinces</p>
                                <p className="text-2xl font-bold text-[#1A1A1A]">26</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-1">Provinces Actives</p>
                                <p className="text-2xl font-bold text-[#6C5CE7]">18</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-1">Zone à Risque</p>
                                <p className="text-2xl font-bold text-[#FF3D71]">3</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
