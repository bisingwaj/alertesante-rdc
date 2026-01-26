import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, X, Play, RotateCcw, Check } from 'lucide-react';

export const AudioRecorder = ({ onRecordingComplete, onCancel }) => {
    const [status, setStatus] = useState('idle'); // idle, recording, reviewing
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationRef = useRef(null);
    const chunksRef = useRef([]);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        startRecording();
        return () => {
            stopResources();
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, []);

    useEffect(() => {
        let interval;
        if (status === 'recording') {
            interval = setInterval(() => setDuration(d => d + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    const startRecording = async () => {
        try {
            // Clean up previous preview URL if any
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setAudioBlob(null);
            setDuration(0);
            stopResources(); // Ensure previous resources are stopped before starting new ones

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // 1. Setup Audio Context for Visualizer
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);

            analyser.fftSize = 256;
            source.connect(analyser);

            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;
            sourceRef.current = source;

            // 2. Setup Recorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                setStatus('reviewing');
                stopResources(); // Stop visualizer
            };

            mediaRecorder.start();
            setStatus('recording');

            // 3. Start Visualization Loop
            draw();
        } catch (err) {
            console.error("Mic Error:", err);
            alert("Impossible d'accéder au micro.");
            onCancel();
        }
    };

    const draw = () => {
        if (!canvasRef.current || !analyserRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const analyser = analyserRef.current;

        // Resize canvas
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const render = () => {
            if (status !== 'recording') return; // Stop drawing if not recording

            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // CERCLE CENTRAL PULSANT (Basses fréquences)
            const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
            const scale = 1 + (bass / 256) * 0.5; // Scale entre 1 et 1.5

            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 60 * scale, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(52, 199, 89, ${0.2 + (bass / 512)})`; // Neon Green transp
            ctx.fill();

            ctx.beginPath();
            ctx.arc(canvas.width / 2, canvas.height / 2, 40 * scale, 0, 2 * Math.PI);
            ctx.fillStyle = '#34C759'; // Neon Green solid
            ctx.fill();

            // ONDES CIRCULAIRES (Moyennes fréquences)
            // On dessine des cercles concentriques qui réagissent
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(canvas.width / 2, canvas.height / 2, (80 + i * 30) + (bass / 5), 0, 2 * Math.PI);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - i * 0.02})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(render);
        };
        render();
    };

    const stopResources = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(e => console.warn('AudioContext already closed', e));
            audioContextRef.current = null;
        }
        if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (analyserRef.current) {
            analyserRef.current = null;
        }
    };

    const handleStop = () => {
        if (mediaRecorderRef.current && status === 'recording') {
            mediaRecorderRef.current.stop();
            // The mediaRecorder.onstop handler will set status to 'reviewing'
        }
    };

    const handleRetry = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setAudioBlob(null);
        setPreviewUrl(null);
        setDuration(0);
        startRecording();
    };

    const handlePlayPreview = () => {
        if (previewUrl) {
            audioRef.current.src = previewUrl;
            audioRef.current.play();
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

            {status === 'recording' ? (
                <>
                    <div className="relative w-full h-1/2 flex items-center justify-center">
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                        <Mic size={48} className="relative z-10 text-black p-2 bg-neon-green rounded-full shadow-[0_0_30px_#34C759]" />
                    </div>
                    <div className="mt-8 text-center space-y-2">
                        <h3 className="text-2xl font-bold text-white">Enregistrement...</h3>
                        <p className="font-mono text-neon-green text-xl tracking-widest">{formatTime(duration)}</p>
                    </div>
                    <button
                        onClick={handleStop}
                        className="mt-12 w-20 h-20 bg-red-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_40px_rgba(239,68,68,0.4)]"
                    >
                        <Square size={32} className="text-white fill-current" />
                    </button>
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center gap-8 animate-fade-in text-center">
                        <h3 className="text-2xl font-bold text-white">Aperçu Audio</h3>

                        <button onClick={handlePlayPreview} className="w-24 h-24 bg-dark-800 rounded-full border border-neon-yellow flex items-center justify-center hover:bg-neon-yellow/10 transition-colors">
                            <Play size={40} className="text-neon-yellow ml-2" />
                        </button>

                        <div className="flex gap-6 mt-8">
                            <button onClick={handleRetry} className="flex flex-col items-center gap-2 text-white/50 hover:text-white">
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
