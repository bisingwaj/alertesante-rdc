import React from 'react';

export const Badge = ({ children, variant = 'purple', size = 'md' }) => {
    const variants = {
        purple: 'badge-purple',
        orange: 'badge-orange',
        green: 'badge-green',
        red: 'badge-red',
        blue: 'badge-blue',
        gray: 'bg-[#EDF1F7] text-[#8F9BB3]',
    };

    const sizes = {
        sm: 'text-[10px] px-2 py-1',
        md: 'text-[11px] px-3 py-1',
        lg: 'text-[12px] px-4 py-2',
    };

    return (
        <span className={`${variants[variant]} ${sizes[size]} inline-flex items-center rounded-xl font-semibold`}>
            {children}
        </span>
    );
};
