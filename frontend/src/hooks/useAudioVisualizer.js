
import { useEffect, useRef } from 'react';

export const useAudioVisualizer = (canvasRef, stream, isRecording) => {
    const animationRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current || !stream || !isRecording) {
            cleanup();
            return;
        }

        const init = () => {
            // Re-use or create context
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            } else if (audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }

            const ctx = audioContextRef.current;
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;

            try {
                const source = ctx.createMediaStreamSource(stream);
                source.connect(analyser);

                sourceRef.current = source;
                analyserRef.current = analyser;

                draw();
            } catch (err) {
                console.error("Error setting up visualizer:", err);
            }
        };

        const draw = () => {
            if (!canvasRef.current || !analyserRef.current) return;

            const canvas = canvasRef.current;
            const canvasCtx = canvas.getContext('2d');
            const analyser = analyserRef.current;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const renderFrame = () => {
                animationRef.current = requestAnimationFrame(renderFrame);
                analyser.getByteFrequencyData(dataArray);

                // Setting canvas size slightly larger to handle high-DPI if needed, or just match parent
                // Using parent size is safer for responsive layout
                if (canvas.parentElement) {
                    canvas.width = canvas.parentElement.clientWidth;
                    canvas.height = canvas.parentElement.clientHeight;
                }

                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

                // SHAZAM VIBE LOGIC
                // Low Freqs (Bass) -> Pulse
                const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
                // Mids -> Ripples
                const mids = dataArray.slice(10, 50).reduce((a, b) => a + b, 0) / 40;

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                // Normalizing 0-1
                const pulse = bass / 255;

                // 1. Core Circle (Neon Green)
                const coreBase = 50;
                const coreRadius = coreBase + (pulse * 40);

                canvasCtx.beginPath();
                canvasCtx.arc(centerX, centerY, coreRadius, 0, 2 * Math.PI);
                canvasCtx.fillStyle = '#34C759';

                // Dynamic Glow
                canvasCtx.shadowBlur = 20 + (pulse * 30);
                canvasCtx.shadowColor = '#34C759';
                canvasCtx.fill();
                canvasCtx.shadowBlur = 0; // Reset

                // 2. Ripples (Concentric circles)
                // We create 3 rings
                for (let i = 1; i <= 3; i++) {
                    const time = Date.now() / 300; // Speed factor
                    const offset = (i * 30);
                    // Add sine wave to radius for organic feel
                    const radius = coreRadius + offset + (Math.sin(time + i) * 10) + (mids / 5);

                    canvasCtx.beginPath();
                    canvasCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

                    // Opacity fades out
                    const opacity = Math.max(0, 0.4 - (i * 0.1));
                    canvasCtx.strokeStyle = `rgba(52, 199, 89, ${opacity})`;
                    canvasCtx.lineWidth = 2 + (pulse * 2);
                    canvasCtx.stroke();
                }
            };

            renderFrame();
        };

        init();

        return () => cleanup();
    }, [stream, isRecording]); // Re-run if stream changes or recording toggles

    const cleanup = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        // Do NOT close AudioContext globally if you plan to reuse it, 
        // but often it's safer to close it or suspend it to save battery.
        // We leave it open but disconnected.
    };
};
