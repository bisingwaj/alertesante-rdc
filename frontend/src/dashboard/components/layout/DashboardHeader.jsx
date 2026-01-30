import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Activity } from 'lucide-react';

export const DashboardHeader = () => {
    const { user, signOut } = useAuth();

    return (
        <header className="bg-slate-900/95 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                    <Activity size={20} className="text-blue-400" />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg">Alerte Santé RDC</h1>
                    <p className="text-white/40 text-xs">Tableau de Bord Ministre</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-white/10">
                    <User size={16} className="text-white/60" />
                    <span className="text-white/80 text-sm font-medium">{user?.email}</span>
                </div>
                <button
                    onClick={signOut}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                    <LogOut size={16} />
                    Déconnexion
                </button>
            </div>
        </header>
    );
};
