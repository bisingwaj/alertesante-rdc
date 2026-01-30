import React from 'react';

export const ProgressBar = ({ value, max = 100, color = 'purple', showLabel = false }) => {
    const percentage = Math.min((value / max) * 100, 100);

    const colors = {
        purple: '#6C5CE7',
        orange: '#FF8A00',
        green: '#00D68F',
        red: '#FF3D71',
        blue: '#0095FF',
    };

    return (
        <div className="flex items-center gap-2">
            <div className="progress-bar-container flex-1">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${percentage}%`,
                        background: colors[color],
                    }}
                />
            </div>
            {showLabel && (
                <span className="text-[11px] font-semibold text-[#8F9BB3] min-w-[40px] text-right">
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    );
};
