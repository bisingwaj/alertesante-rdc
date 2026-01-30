import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, trend, trendValue, icon: Icon, color = 'purple' }) => {
    const colorClasses = {
        purple: {
            bg: 'bg-[#F5F3FF]',
            icon: 'text-[#6C5CE7]',
            number: 'text-[#6C5CE7]',
        },
        orange: {
            bg: 'bg-[#FFF4E6]',
            icon: 'text-[#FF8A00]',
            number: 'text-[#FF8A00]',
        },
        green: {
            bg: 'bg-[#E6FAF5]',
            icon: 'text-[#00D68F]',
            number: 'text-[#00D68F]',
        },
        red: {
            bg: 'bg-[#FFE5EC]',
            icon: 'text-[#FF3D71]',
            number: 'text-[#FF3D71]',
        },
    };

    const colors = colorClasses[color];
    const isPositive = trendValue >= 0;

    return (
        <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
            <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center`}>
                    <Icon size={24} className={colors.icon} />
                </div>
            </div>
            <div>
                <p className="text-[#A0A0A0] text-xs font-medium uppercase tracking-wider mb-3">
                    {title}
                </p>
                <p className={`text-5xl font-bold ${colors.number} mb-3`}>
                    {value}
                </p>
                {trend && (
                    <div className="flex items-center gap-2 text-sm">
                        {isPositive ? (
                            <span className="text-[#00D68F] flex items-center gap-1">
                                <TrendingUp size={16} />
                                +{trendValue}%
                            </span>
                        ) : (
                            <span className="text-[#FF3D71] flex items-center gap-1">
                                <TrendingDown size={16} />
                                {trendValue}%
                            </span>
                        )}
                        <span className="text-[#C0C0C0]">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
