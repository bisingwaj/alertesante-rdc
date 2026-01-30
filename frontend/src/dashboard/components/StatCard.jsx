import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({ title, value, trend, trendValue, icon: Icon, color = 'purple' }) => {
    const colorClasses = {
        purple: {
            bg: 'bg-[#E5E3FF]',
            icon: 'text-[#6C5CE7]',
            border: 'border-[#6C5CE7]/30',
            number: 'text-[#6C5CE7]',
        },
        orange: {
            bg: 'bg-[#FFE5CC]',
            icon: 'text-[#FF8A00]',
            border: 'border-[#FF8A00]/30',
            number: 'text-[#FF8A00]',
        },
        green: {
            bg: 'bg-[#CCFFF0]',
            icon: 'text-[#00D68F]',
            border: 'border-[#00D68F]/30',
            number: 'text-[#00D68F]',
        },
        red: {
            bg: 'bg-[#FFE5EC]',
            icon: 'text-[#FF3D71]',
            border: 'border-[#FF3D71]/30',
            number: 'text-[#FF3D71]',
        },
    };

    const colors = colorClasses[color];
    const isPositive = trendValue >= 0;

    return (
        <div className="card-premium">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center border ${colors.border}`}>
                    <Icon size={24} className={colors.icon} />
                </div>
            </div>
            <div>
                <p className="text-[#8F9BB3] text-[11px] font-semibold uppercase tracking-wider mb-2">
                    {title}
                </p>
                <p className={`text-5xl font-black ${colors.number} mb-2 stat-number`}>
                    {value}
                </p>
                {trend && (
                    <div className="flex items-center gap-1 text-xs">
                        {isPositive ? (
                            <TrendingUp size={14} className="text-[#00D68F]" />
                        ) : (
                            <TrendingDown size={14} className="text-[#FF3D71]" />
                        )}
                        <span className={isPositive ? 'text-[#00D68F]' : 'text-[#FF3D71]'}>
                            {isPositive ? '+' : ''}{trendValue}%
                        </span>
                        <span className="text-[#C5CEE0]">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
