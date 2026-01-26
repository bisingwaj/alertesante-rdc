import React, { useState } from 'react';
import { Camera, Mic, Loader2, CheckCircle2, Paperclip } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import { AudioRecorder } from '../../ui/AudioRecorder';
import { MiniAudioPlayer } from '../../ui/MiniAudioPlayer';

export const StepDetails = ({ onNext }) => {
    const [desc, setDesc] = useState('');
    const [uploading, setUploading] = useState(false);

    // MEDIA STATE
    const [photoUrl, setPhotoUrl] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);

    // RECORDER UI STATE
    const [showRecorder, setShowRecorder] = useState(false);

    // --- PHOTO HANDLER ---
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const fileName = `photos/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

        try {
            const { error } = await supabase.storage.from('evidence').upload(fileName, file);
            if (error) throw error;
            const { data } = supabase.storage.from('evidence').getPublicUrl(fileName);
            // On ajoute un timestamp fake pour forcer le refresh si même nom, mais ici nom unique
            setPhotoUrl(data.publicUrl);
        } catch (error) {
            console.error('Error photo:', error);
            alert('Erreur upload photo.');
        } finally {
            setUploading(false);
        }
    };

    // --- AUDIO HANDLER ---
    const handleAudioComplete = async (audioBlob) => {
        setShowRecorder(false);
        setUploading(true);
        const fileName = `audios/${Date.now()}.webm`;
        try {
            const { error } = await supabase.storage.from('evidence').upload(fileName, audioBlob);
            if (error) throw error;
            const { data } = supabase.storage.from('evidence').getPublicUrl(fileName);
            setAudioUrl(data.publicUrl);
        } catch (error) {
            console.error('Error audio:', error);
            alert('Erreur upload audio.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {showRecorder && (
                <AudioRecorder
                    onRecordingComplete={handleAudioComplete}
                    onCancel={() => setShowRecorder(false)}
                />
            )}

            <div className="flex flex-col h-full pt-12 px-6">
                <h2 className="text-2xl font-bold mb-2">Détails et Preuves</h2>
                <p className="text-white/60 mb-6">Description, photo ou note vocale.</p>

                <textarea
                    className="w-full h-28 bg-dark-800 rounded-2xl p-4 text-white placeholder-white/20 border border-white/10 mb-6 focus:border-neon-yellow outline-none resize-none"
                    placeholder="Décrivez la situation..."
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />

                <div className="space-y-4 mb-6">
                    {/* AUDIO SECTION */}
                    {audioUrl ? (
                        <MiniAudioPlayer src={audioUrl} onDelete={() => setAudioUrl(null)} />
                    ) : (
                        <button
                            onClick={() => setShowRecorder(true)}
                            className="w-full p-4 bg-dark-800 rounded-2xl flex items-center justify-between border border-white/10 hover:border-neon-yellow/50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-neon-yellow/10">
                                    <Mic size={24} className="text-white group-hover:text-neon-yellow" />
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold text-lg text-white">Ajouter un vocal</span>
                                    <span className="text-white/40 text-sm">Enregistrer une note audio</span>
                                </div>
                            </div>
                        </button>
                    )}

                    {/* PHOTO/FILE SECTION */}
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            // RETRAIT DE 'capture' POUR PERMETTRE CHOIX FICHIER
                            onChange={handlePhotoUpload}
                            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                            disabled={uploading}
                        />
                        <div className={`w-full p-4 bg-dark-800 rounded-2xl flex items-center justify-between border transition-all group ${photoUrl ? 'border-neon-green bg-neon-green/5' : 'border-white/10 hover:border-neon-yellow/50'}`}>

                            {uploading ? (
                                <div className="flex items-center gap-4 w-full justify-center py-2">
                                    <Loader2 className="animate-spin text-neon-yellow" />
                                    <span className="text-white/60">Envoi en cours...</span>
                                </div>
                            ) : photoUrl ? (
                                <div className="flex items-center gap-4 w-full">
                                    <img src={photoUrl} alt="Preuve" className="w-12 h-12 object-cover rounded-xl border border-white/10" />
                                    <div className="flex-1">
                                        <span className="block font-bold text-white flex items-center gap-2">
                                            Image ajoutée <CheckCircle2 size={16} className="text-neon-green" />
                                        </span>
                                        <span className="text-neon-green text-xs">Prêt à envoyer</span>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-full"><Paperclip size={20} className="text-white/50" /></div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-neon-yellow/10">
                                        <Camera size={24} className="text-white group-hover:text-neon-yellow" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block font-bold text-lg text-white">Ajouter une preuve</span>
                                        <span className="text-white/40 text-sm">Photo ou fichier image</span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <div className="mt-auto mb-8">
                    <button
                        onClick={() => onNext({ description: desc || 'Aucune description', photoUrl, audioUrl })}
                        disabled={uploading}
                        className="w-full py-4 bg-neon-yellow text-black font-black text-lg rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,230,0,0.2)]"
                    >
                        CONTINUER
                    </button>
                </div>
            </div>
        </>
    );
};
