
import React from 'react';
import { Camera, Mic, Upload, SkipForward } from 'lucide-react';

export const MediaStep = ({ onNext }) => {
    return (
        <div className="flex flex-col h-full justify-center gap-6">

            {/* Simulation Camera Viewfinder */}
            <div className="flex-1 bg-black rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center">
                <p className="text-white/30 text-xs">Aperçu Caméra</p>

                {/* Controls Overlay */}
                <div className="absolute bottom-6 w-full flex justify-around items-center px-6">
                    <button className="p-4 rounded-full bg-dark-800 text-white/80"><Upload size={24} /></button>
                    <button className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-white rounded-full" /> {/* Shutter */}
                    </button>
                    <button className="p-4 rounded-full bg-dark-800 text-white/80"><Mic size={24} /></button>
                </div>
            </div>

            <button
                onClick={() => onNext({ media: [] })}
                className="text-white/50 text-sm flex items-center justify-center gap-2 py-4 hover:text-white"
            >
                Passer cette étape <SkipForward size={16} />
            </button>

        </div>
    );
};
