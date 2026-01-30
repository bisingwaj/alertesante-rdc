import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Map, List, Settings } from 'lucide-react';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Vue d\'Ensemble', exact: true },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/dashboard/map', icon: Map, label: 'Carte Géographique' },
    { path: '/dashboard/tickets', icon: List, label: 'Signalements' },
    { path: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
];

export const Sidebar = () => {
    return (
        <aside className="w-64 bg-slate-900/50 border-r border-white/10 flex flex-col">
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${isActive
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} className={isActive ? 'text-blue-400' : 'text-white/60'} />
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-300 text-xs font-semibold">Version 1.0.0</p>
                    <p className="text-white/40 text-xs mt-1">Ministère de la Santé RDC</p>
                </div>
            </div>
        </aside>
    );
};
