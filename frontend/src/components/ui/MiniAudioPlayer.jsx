
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Trash2 } from 'lucide-react';

export const MiniAudioPlayer = ({ src, onDelete }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(p || 0);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    return (
        <div className="w-full bg-dark-800 rounded-2xl p-4 border border-neon-green/30 flex items-center gap-4 animate-fade-in">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                className="hidden"
            />

            <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-neon-green flex items-center justify-center text-black hover:scale-105 transition-transform"
            >
                {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
            </button>

            <div className="flex-1">
                <p className="text-white font-bold text-sm mb-1">Note Vocale</p>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-neon-green transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <button
                onClick={onDelete}
                className="p-3 text-white/30 hover:text-red-500 transition-colors"
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};
