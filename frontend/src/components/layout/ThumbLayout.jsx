
import React from 'react';

// Layout optimisé pour l'usage à une main (Zone du pouce)
export const ThumbLayout = ({ children, actions }) => {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header Fixe */}
            <header className="bg-white p-4 shadow-sm flex items-center justify-center sticky top-0 z-10">
                <span className="text-xl font-bold text-blue-900">🇨🇩 AlerteSanté</span>
            </header>

            {/* Contenu Scrollable */}
            <main className="flex-1 overflow-y-auto p-4 pb-32">
                <div className="max-w-md mx-auto space-y-6">
                    {children}
                </div>
            </main>

            {/* Zone Actions (Bottom Fixed) */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                <div className="max-w-md mx-auto">
                    {actions}
                </div>
            </div>
        </div>
    );
};
