
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, X } from 'lucide-react';

export const AudioRecorder = ({ onRecordingComplete, onCancel }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const canvasRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const animationRef = useRef(null);
    const chunksRef = useRef([]);

    useEffect(() => {
        startRecording();
        return () => stopResources();
    }, []);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => setDuration(d => d + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const startRecording = async () => {
        try {
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
                onRecordingComplete(blob);
            };

            mediaRecorder.start();
            setIsRecording(true);

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

        const drawArgs = { canvas, ctx, analyser, dataArray };

        const render = () => {
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
        // Vérifier si le contexte existe et n'est pas déjà fermé
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(e => console.warn('AudioContext already closed', e));
        }
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
        }
    };

    const handleStop = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            stopResources();
        }
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
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
        >
            <button onClick={onCancel} className="absolute top-6 right-6 text-white/50 hover:text-white">
                <X size={32} />
            </button>

            <div className="relative w-full h-1/2 flex items-center justify-center">
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <Mic size={48} className="relative z-10 text-black" />
            </div>

            <div className="mt-8 text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">Enregistrement...</h3>
                <p className="font-mono text-neon-green text-xl tracking-widest">{formatTime(duration)}</p>
                <p className="text-white/40 text-sm">Parlez distinctement près du micro</p>
            </div>

            <button
                onClick={handleStop}
                className="mt-12 w-20 h-20 bg-red-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            >
                <Square size={32} className="text-white fill-current" />
            </button>
        </motion.div>
    );
};
