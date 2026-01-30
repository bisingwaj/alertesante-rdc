import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Activity, Search, Bell } from 'lucide-react';

export const DashboardHeader = () => {
    const { user, signOut } = useAuth();

    return (
        <header className="bg-white border-b border-[#F0F0F0] px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#6C5CE7] rounded-xl flex items-center justify-center">
                        <Activity size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-[#1A1A1A] font-black text-lg">Alerte Santé RDC</h1>
                        <p className="text-[#A0A0A0] text-xs">Tableau de Bord Ministre</p>
                    </div>
                </div>

                {/* Search */}
                <div className="hidden md:flex items-center gap-3 bg-[#FAFAFA] rounded-xl px-5 py-3 w-96">
                    <Search size={18} className="text-[#C0C0C0]" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-transparent outline-none text-sm text-[#404040] placeholder-[#C0C0C0] flex-1"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative w-11 h-11 bg-[#FAFAFA] hover:bg-[#F0F0F0] rounded-xl flex items-center justify-center transition-colors">
                    <Bell size={20} className="text-[#808080]" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF3D71] rounded-full"></span>
                </button>

                {/* User */}
                <div className="flex items-center gap-3 px-4 py-2 bg-[#FAFAFA] rounded-xl">
                    <div className="w-9 h-9 bg-[#6C5CE7] rounded-full flex items-center justify-center">
                        <User size={18} className="text-white" />
                    </div>
                    <span className="text-[#1A1A1A] text-sm font-semibold hidden md:block">
                        {user?.email?.split('@')[0] || 'Admin'}
                    </span>
                </div>

                {/* Logout */}
                <button
                    onClick={signOut}
                    className="px-5 py-2.5 bg-white border border-[#F0F0F0] hover:border-[#E0E0E0] rounded-xl text-[#404040] text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                    <LogOut size={16} />
                    <span className="hidden md:inline">Déconnexion</span>
                </button>
            </div>
        </header>
    );
};
