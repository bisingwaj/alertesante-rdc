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
        <aside className="w-24 bg-white border-r border-[#F0F0F0] flex flex-col items-center py-8">
            <nav className="flex-1 flex flex-col gap-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        title={item.label}
                        className={({ isActive }) =>
                            `w-14 h-14 flex items-center justify-center rounded-xl transition-all relative ${isActive
                                ? 'bg-[#6C5CE7]'
                                : 'hover:bg-[#FAFAFA]'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <item.icon size={24} className={isActive ? 'text-white' : 'text-[#C0C0C0]'} />
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="text-[10px] text-[#E0E0E0] font-medium">v1.0</div>
        </aside>
    );
};
