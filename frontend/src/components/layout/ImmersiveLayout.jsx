
import React from 'react';
import { motion } from 'framer-motion';

// Layout Plein Écran pour expérience type "Snapchat" / "Zenly"
export const ImmersiveLayout = ({ children, title, subtitle }) => {
    return (
        <div className="fixed inset-0 bg-dark-900 text-white overflow-hidden flex flex-col">

            {/* Top Bar Gradiant */}
            <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />

            {/* Header */}
            <header className="relative z-20 px-6 pt-12 pb-4 flex flex-col items-center text-center">
                {title && (
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-bold tracking-tight text-white mb-1"
                    >
                        {title}
                    </motion.h1>
                )}
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white/60 text-sm font-medium"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </header>

            {/* Content Area */}
            <main className="flex-1 relative w-full max-w-lg mx-auto flex flex-col px-4">
                {children}
            </main>

        </div>
    );
};
