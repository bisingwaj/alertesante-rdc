
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, X, Play, RotateCcw, Check, Pause } from 'lucide-react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useAudioVisualizer } from '../../hooks/useAudioVisualizer';

export const AudioRecorder = ({ onRecordingComplete, onCancel }) => {
    // 1. Hooks initialization
    const {
        status,
        duration,
        audioBlob,
        previewUrl,
        startRecording,
        stopRecording,
        resetRecording,
        stream
    } = useAudioRecorder();

    const canvasRef = useRef(null);
    const audioRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);

    // 2. Connect Visualizer
    // We only visualize if status is 'recording' and we have a stream
    useAudioVisualizer(canvasRef, stream, status === 'recording');

    // 3. Auto-start recording on mount
    useEffect(() => {
        startRecording().catch(() => {
            // Error handling handled inside hook state usually, but we can alert parent
        });
        return () => {
            // Reset on unmount handled by hook cleanup, but we can also trigger reset
            resetRecording();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 4. Playback Logic
    const togglePlayback = () => {
        if (!previewUrl) return;

        const audio = audioRef.current;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.src = previewUrl;
            audio.play();
            setIsPlaying(true);
            audio.onended = () => setIsPlaying(false);
        }
    };

    const handleConfirm = () => {
        if (audioBlob) onRecordingComplete(audioBlob);
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
        >
            <button onClick={onCancel} className="absolute top-6 right-6 text-white/50 hover:text-white">
                <X size={32} />
            </button>

            {/* ERROR STATE */}
            {status === 'error' && (
                <div className="text-center space-y-4">
                    <div className="text-red-500 font-bold text-xl">Accès micro refusé 🚫</div>
                    <p className="text-white/60">Veuillez autoriser l'accès au micro dans votre navigateur.</p>
                    <button onClick={onCancel} className="bg-white/10 px-6 py-2 rounded-lg text-white">Fermer</button>
                </div>
            )}

            {/* RECORDING STATE */}
            {status === 'recording' && (
                <>
                    <div className="relative w-full h-1/2 flex items-center justify-center">
                        {/* Canvas fills container */}
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                        {/* Mic Icon Center */}
                        <Mic size={48} className="relative z-10 text-black p-2 bg-neon-green rounded-full shadow-[0_0_30px_#34C759]" />
                    </div>
                    <div className="mt-8 text-center space-y-2 relative z-10">
                        <h3 className="text-2xl font-bold text-white">Enregistrement...</h3>
                        <p className="font-mono text-neon-green text-xl tracking-widest">{formatTime(duration)}</p>
                    </div>
                    <button
                        onClick={stopRecording}
                        className="mt-12 w-20 h-20 bg-red-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_40px_rgba(239,68,68,0.4)] relative z-10"
                    >
                        <Square size={32} className="text-white fill-current" />
                    </button>
                </>
            )}

            {/* REVIEW STATE */}
            {status === 'reviewing' && (
                <>
                    <div className="flex flex-col items-center gap-8 animate-fade-in text-center">
                        <h3 className="text-2xl font-bold text-white">Aperçu Audio</h3>

                        <button
                            onClick={togglePlayback}
                            className={`w-24 h-24 rounded-full border flex items-center justify-center transition-all
                                ${isPlaying ? 'bg-neon-yellow text-black border-neon-yellow' : 'bg-dark-800 text-neon-yellow border-neon-yellow'}
                            `}
                        >
                            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} className="ml-2" fill="currentColor" />}
                        </button>

                        {/* Waveform placeholder or just timer */}
                        <p className="text-white/50 font-mono">Audio capturé</p>

                        <div className="flex gap-6 mt-8">
                            <button onClick={resetRecording} className="flex flex-col items-center gap-2 text-white/50 hover:text-white">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                    <RotateCcw size={24} />
                                </div>
                                <span className="text-sm">Recommencer</span>
                            </button>

                            <button onClick={handleConfirm} className="flex flex-col items-center gap-2 text-neon-green hover:scale-105 transition-transform">
                                <div className="w-16 h-16 rounded-full bg-neon-green text-black flex items-center justify-center shadow-[0_0_20px_rgba(52,199,89,0.4)]">
                                    <Check size={32} strokeWidth={3} />
                                </div>
                                <span className="text-sm font-bold">Valider</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

