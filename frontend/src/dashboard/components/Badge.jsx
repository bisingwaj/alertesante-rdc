import React from 'react';

export const Badge = ({ children, variant = 'purple', size = 'md' }) => {
    const variants = {
        purple: 'bg-[#F5F3FF] text-[#6C5CE7]',
        orange: 'bg-[#FFF4E6] text-[#FF8A00]',
        green: 'bg-[#E6FAF5] text-[#00D68F]',
        red: 'bg-[#FFE5EC] text-[#FF3D71]',
        blue: 'bg-[#E6F4FF] text-[#0095FF]',
        gray: 'bg-[#F5F5F5] text-[#808080]',
    };

    const sizes = {
        sm: 'text-[11px] px-3 py-1',
        md: 'text-[12px] px-4 py-1.5',
        lg: 'text-[13px] px-5 py-2',
    };

    return (
        <span className={`${variants[variant]} ${sizes[size]} inline-flex items-center rounded-full font-medium`}>
            {children}
        </span>
    );
};
