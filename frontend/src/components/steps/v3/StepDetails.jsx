
import React, { useState, useRef } from 'react';
import { Camera, Mic, Trash2, CheckCircle2, Loader2, Play, Square } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

export const StepDetails = ({ onNext }) => {
    const [desc, setDesc] = useState('');
    const [uploading, setUploading] = useState(false);

    // MEDIA STATE
    const [photoUrl, setPhotoUrl] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);

    // AUDIO RECORDER
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // --- PHOTO HANDLER ---
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const fileName = `photos/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

        try {
            const { data, error } = await supabase.storage.from('evidence').upload(fileName, file);
            if (error) throw error;

            // Get Public URL
            const { data: publicUrlData } = supabase.storage.from('evidence').getPublicUrl(fileName);
            setPhotoUrl(publicUrlData.publicUrl);
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Erreur upload photo. Vérifiez votre connexion.');
        } finally {
            setUploading(false);
        }
    };

    // --- AUDIO HANDLER ---
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await uploadAudio(audioBlob);
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (err) {
            console.error('Microphone access denied:', err);
            alert("Accès micro refusé.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const uploadAudio = async (blob) => {
        setUploading(true);
        const fileName = `audios/${Date.now()}.webm`;
        try {
            const { error } = await supabase.storage.from('evidence').upload(fileName, blob);
            if (error) throw error;

            const { data: publicUrlData } = supabase.storage.from('evidence').getPublicUrl(fileName);
            setAudioUrl(publicUrlData.publicUrl);
        } catch (error) {
            console.error('Error uploading audio:', error);
            alert('Erreur upload audio.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-full pt-12 px-6">
            <h2 className="text-2xl font-bold mb-2">Détails & Preuves</h2>
            <p className="text-white/60 mb-6">Ajoutez une description ou une photo.</p>

            <textarea
                className="w-full h-32 bg-dark-800 rounded-2xl p-4 text-white placeholder-white/20 border border-white/10 mb-6 focus:border-neon-yellow outline-none resize-none"
                placeholder="Décrivez la situation (ou enregistrez un vocal)..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* PHOTO BUTTON */}
                <div className="relative h-32">
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment" // Force rear camera on mobile
                        onChange={handlePhotoUpload}
                        className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                        disabled={uploading}
                    />
                    <div className={`w-full h-full bg-dark-800 rounded-2xl flex flex-col items-center justify-center gap-2 border ${photoUrl ? 'border-neon-green' : 'border-white/10'}`}>
                        {uploading ? <Loader2 className="animate-spin text-neon-yellow" /> :
                            photoUrl ? <img src={photoUrl} alt="Preuve" className="w-full h-full object-cover rounded-2xl opacity-50" /> :
                                <Camera size={28} className="text-neon-yellow" />}
                        {!photoUrl && <span className="text-sm font-bold">Photo</span>}
                    </div>
                    {photoUrl && <div className="absolute top-2 right-2 z-10 bg-neon-green rounded-full p-1"><CheckCircle2 size={16} className="text-black" /></div>}
                </div>

                {/* AUDIO BUTTON */}
                <button
                    onClick={recording ? stopRecording : (!audioUrl ? startRecording : undefined)}
                    className={`h-32 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-colors ${recording ? 'bg-red-900/50 border-red-500 animate-pulse' :
                        audioUrl ? 'bg-neon-green/10 border-neon-green' :
                            'bg-dark-800 border-white/10 hover:bg-dark-700'
                        }`}
                >
                    {recording ? <Square size={28} className="text-red-500" /> :
                        audioUrl ? <Play size={28} className="text-neon-green" /> :
                            <Mic size={28} className="text-neon-yellow" />}

                    <span className={`text-sm font-bold ${recording ? 'text-red-500' : ''}`}>
                        {recording ? 'Stop Enr.' : audioUrl ? 'Enregistré' : 'Vocal'}
                    </span>
                </button>
            </div>

            {(photoUrl || audioUrl) && (
                <p className="text-xs text-center text-white/40 mb-4">Fichiers sauvegardés sécuritairement.</p>
            )}

            <button
                onClick={() => onNext({ description: desc || 'Aucune description', photoUrl, audioUrl })}
                disabled={uploading}
                className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl mt-auto mb-8 disabled:opacity-50"
            >
                {uploading ? 'Chargement...' : 'Continuer'}
            </button>
        </div>
    );
};
