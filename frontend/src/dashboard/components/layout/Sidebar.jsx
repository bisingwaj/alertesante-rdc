import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Map, List, Settings } from 'lucide-react';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Vue d\'Ensemble', exact: true },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/dashboard/map', icon: Map, label: 'Carte' },
    { path: '/dashboard/tickets', icon: List, label: 'Signalements' },
    { path: '/dashboard/settings', icon: Settings, label: 'Paramètres' },
];

export const Sidebar = () => {
    return (
        <aside className="w-20 bg-white border-r border-[#EDF1F7] flex flex-col items-center py-6 shadow-sm">
            <nav className="flex-1 flex flex-col gap-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        title={item.label}
                        className={({ isActive }) =>
                            `w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group ${isActive
                                ? 'bg-[#6C5CE7] shadow-lg'
                                : 'hover:bg-[#F8F9FA]'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={22} className={isActive ? 'text-white' : 'text-[#8F9BB3]'} />
                                {/* Tooltip */}
                                <div className="absolute left-full ml-2 px-3 py-1 bg-[#2E3A59] text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                                    {item.label}
                                </div>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="text-center">
                <div className="text-[10px] text-[#C5CEE0] font-semibold">v1.0</div>
            </div>
        </aside>
    );
};
