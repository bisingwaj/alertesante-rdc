import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Lock, Globe } from 'lucide-react';

export const SettingsPage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-12">
            {/* Header */}
            <div className="mb-12">
                <p className="text-[#A0A0A0] text-sm mb-2">Tableau de Bord</p>
                <h1 className="text-4xl font-bold text-[#1A1A1A]">Paramètres</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile */}
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <div className="flex items-center gap-3 mb-8">
                            <User size={24} className="text-[#6C5CE7]" />
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Profil</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-[#A0A0A0] mb-2 uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#F0F0F0] rounded-lg text-[#404040]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[#A0A0A0] mb-2 uppercase tracking-wider">Rôle</label>
                                <input
                                    type="text"
                                    value="Administrateur"
                                    disabled
                                    className="w-full px-4 py-3 bg-[#FAFAFA] border border-[#F0F0F0] rounded-lg text-[#404040]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <div className="flex items-center gap-3 mb-8">
                            <Bell size={24} className="text-[#6C5CE7]" />
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Notifications</h2>
                        </div>
                        <div className="space-y-6">
                            {[
                                { label: 'Nouveaux signalements', enabled: true },
                                { label: 'Signalements critiques', enabled: true },
                                { label: 'Rapports hebdomadaires', enabled: false },
                                { label: 'Alertes système', enabled: true },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-3 border-b border-[#F8F8F8] last:border-0">
                                    <span className="text-sm text-[#404040]">{item.label}</span>
                                    <div className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-[#6C5CE7]' : 'bg-[#E0E0E0]'} relative cursor-pointer`}>
                                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${item.enabled ? 'right-0.5' : 'left-0.5'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <div className="flex items-center gap-3 mb-8">
                            <Lock size={24} className="text-[#6C5CE7]" />
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Sécurité</h2>
                        </div>
                        <div className="space-y-4">
                            <button className="w-full px-6 py-3 bg-[#FAFAFA] border border-[#F0F0F0] rounded-lg text-[#404040] font-semibold hover:border-[#E0E0E0] transition-colors text-left">
                                Changer le mot de passe
                            </button>
                            <button className="w-full px-6 py-3 bg-[#FAFAFA] border border-[#F0F0F0] rounded-lg text-[#404040] font-semibold hover:border-[#E0E0E0] transition-colors text-left">
                                Activer l'authentification à deux facteurs
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* System Info */}
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <div className="flex items-center gap-3 mb-6">
                            <Globe size={24} className="text-[#6C5CE7]" />
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Système</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-1">Version</p>
                                <p className="text-sm font-semibold text-[#404040]">1.0.0</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-1">Dernière mise à jour</p>
                                <p className="text-sm font-semibold text-[#404040]">30 Jan 2026</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider mb-1">Environnement</p>
                                <p className="text-sm font-semibold text-[#404040]">Production</p>
                            </div>
                        </div>
                    </div>

                    {/* Help */}
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Aide</h2>
                        <div className="space-y-3">
                            <a href="#" className="block text-sm text-[#6C5CE7] hover:underline">
                                Documentation
                            </a>
                            <a href="#" className="block text-sm text-[#6C5CE7] hover:underline">
                                Tutoriels vidéo
                            </a>
                            <a href="#" className="block text-sm text-[#6C5CE7] hover:underline">
                                Contacter le support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
