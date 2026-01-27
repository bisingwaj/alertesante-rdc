
import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioRecorder = () => {
    const [status, setStatus] = useState('idle'); // idle, recording, paused, reviewing
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPermissionGranted, setIsPermissionGranted] = useState(false);

    const mediaRecorder = useRef(null);
    const streamRef = useRef(null);
    const chunks = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            stopStream();
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const startRecording = async () => {
        try {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setAudioBlob(null);
            setDuration(0);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setIsPermissionGranted(true);

            // Create new MediaRecorder instance
            /* 
               Note: Safari can be tricky with MIME types. 
               We try common types.
            */
            let mimeType = 'audio/webm';
            if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
                mimeType = 'audio/ogg'; // Firefox
            }

            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorder.current = recorder;
            chunks.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunks.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks.current, { type: mimeType });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setPreviewUrl(url);
                setStatus('reviewing');
                stopStream();
                clearInterval(timerRef.current);
            };

            recorder.start(100); // Collect 100ms chunks
            setStatus('recording');

            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

            return stream; // Return stream for visualizer
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setIsPermissionGranted(false);
            setStatus('error');
            throw error;
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
            // Status update happens in onstop
        }
    };

    const resetRecording = () => {
        stopStream();
        setAudioBlob(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setStatus('idle');
        setDuration(0);
    };

    return {
        status,
        duration,
        audioBlob,
        previewUrl,
        startRecording,
        stopRecording,
        resetRecording,
        isPermissionGranted,
        stream: streamRef.current
    }; // We expose stream logic mostly via return of startRecording for now or creating a separate context if needed, 
    // but for this component, returning the stream promise from startRecording is often enough or using the ref if component is colocated.
};
