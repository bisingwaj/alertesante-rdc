import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Activity, Search, Bell } from 'lucide-react';

export const DashboardHeader = () => {
    const { user, signOut } = useAuth();

    return (
        <header className="bg-white border-b border-[#EDF1F7] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6C5CE7] rounded-xl flex items-center justify-center">
                        <Activity size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-[#2E3A59] font-black text-lg">Alerte Santé RDC</h1>
                        <p className="text-[#8F9BB3] text-xs">Tableau de Bord Ministre</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex items-center gap-2 bg-[#F8F9FA] rounded-xl px-4 py-2 w-80">
                    <Search size={18} className="text-[#8F9BB3]" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-transparent outline-none text-sm text-[#2E3A59] placeholder-[#C5CEE0] flex-1"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative w-10 h-10 bg-[#F8F9FA] hover:bg-[#EDF1F7] rounded-xl flex items-center justify-center transition-colors">
                    <Bell size={20} className="text-[#8F9BB3]" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3D71] rounded-full"></span>
                </button>

                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-[#F8F9FA] rounded-xl">
                    <div className="w-8 h-8 bg-[#6C5CE7] rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                    </div>
                    <span className="text-[#2E3A59] text-sm font-semibold hidden md:block">
                        {user?.email?.split('@')[0] || 'Admin'}
                    </span>
                </div>

                {/* Logout */}
                <button
                    onClick={signOut}
                    className="px-4 py-2 bg-[#FFE5EC] hover:bg-[#FFD1DC] border border-[#FF3D71]/20 rounded-xl text-[#FF3D71] text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                    <LogOut size={16} />
                    <span className="hidden md:inline">Déconnexion</span>
                </button>
            </div>
        </header>
    );
};
