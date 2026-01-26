
import React from 'react';

export const ProgressBar = ({ currentStep, totalSteps }) => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 px-2 py-4 flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                    key={i}
                    className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${i <= currentStep ? 'bg-neon-yellow shadow-[0_0_8px_rgba(255,230,0,0.5)]' : 'bg-white/10'
                        }`}
                />
            ))}
        </div>
    );
};
